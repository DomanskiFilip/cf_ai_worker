// hono instead of express for smaller size and speed
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { WorkflowEntrypoint, WorkflowStep } from 'cloudflare:workers';

// chat workflow class/object
export class ChatWorkflow extends WorkflowEntrypoint<Env, any> {
  async run(event: any, step: WorkflowStep) {
    // get the user id and msg from endpoint
    const { userId, message } = event;

    // look for chat history for the provided user id (max 6 last messages)
    const history = await step.do('fetch-history', async () => {
      const { results } = await this.env.chat_memory.prepare(
        "SELECT role, content FROM messages WHERE userId = ? ORDER BY created_at ASC LIMIT 6"
      ).bind(userId).all();
      return results;
    });

    // query the AI model with the chat history and user message (llama 3.3 70b instruct version -> even smaller model would sufice for demo ai chat or simple ai app)
    const aiResponse = await step.do('ai-inference', async () => {
      try {
        const result: any = await this.env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [
            { role: 'system', content: 'You are a professional AI assistant. when asked you identify as yellow maincoon cat. feel free to use emojis' },
            ...history,
            { role: 'user', content: message }
          ]
        });
        
        if (!result || !result.response) {
            throw new Error("AI returned an empty response");
        }
        
        return result.response;
      } catch (err) {
        // Log the error in wrangler logs
        console.error("AI Inference Error:", err);
        return "Meow... I'm having a bit of trouble thinking right now. Can you try again?";
      }
    });

    // save the chat history to the database appened with recent responce (unless its error message)
    if (!aiResponse.startsWith("Meow... I'm having a bit of trouble")) {
      await step.do('save-to-db', async () => {
        await this.env.chat_memory.prepare(
          "INSERT INTO messages (userId, role, content) VALUES (?, 'user', ?), (?, 'assistant', ?)"
        ).bind(userId, message, userId, aiResponse).run();
      });
    }

    // send the ai response back to the user
    return aiResponse;
  }
}

// API endpoint
const app = new Hono<{ Bindings: Env }>();
// allowing all origins though cors (not secure but fine for this demo/assigment)
app.use('*', cors());

// when endpoint '/chat' is hit start the agent/chat workflow
app.post('/chat', async (chat) => {
  // send user id with chat msg
  const { userId, message } = await chat.req.json();

  // Trigger Workflow
  const instance = await chat.env.CHAT_WORKFLOW.create({
    params: { userId, message }
  });

  const reply = await instance.query();
  return chat.json({ reply });
});

export default app;

export interface Env {
  chat_memory: D1Database;
  AI: any;
  CHAT_WORKFLOW: WorkflowNamespace;
}