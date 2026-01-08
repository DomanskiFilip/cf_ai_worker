<template>
  <main id="chat">
    <!--chat history box --> 
    <div class="chat-messages" ref="scrollContainer">
      <div v-for="(msg, index) in chatHistory" :key="index" :class="['message', msg.role]">
        <span class="role">{{ msg.role === 'user' ? 'You' : 'Cat' }}:</span>
        <p>{{ msg.content }}</p>
      </div>
      <!-- typing animation -->
      <div v-if="isTyping" class="typing">🐾 Cat is typing...</div>
    </div>

    <!--chat input box -->
    <div class="chat-input">
      <input 
        type="text" 
        v-model="userText" 
        @keyup.enter="sendMessage" 
        placeholder="Type your message..." 
        :disabled="isTyping"
      />
      <button @click="sendMessage" :disabled="isTyping">Send</button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userText = ref('');
const chatHistory = ref([]);
const isTyping = ref(false);

// Using localstorage for persistent ID instead of oauth and logins (I do this for demos)
const userId = ref(localStorage.getItem('chat_uid') || crypto.randomUUID());

onMounted(() => {
  localStorage.setItem('chat_uid', userId.value);
});

async function sendMessage() {
  if (!userText.value.trim()) return;

  // Add user message to the UI
  const currentMsg = userText.value;
  chatHistory.value.push({ role: 'user', content: currentMsg });
  userText.value = '';
  isTyping.value = true;

  try {
    // hit the endpoint in to Wrangler server
    const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId.value, message: currentMsg }),
    });

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    
    // Add AI response/error to the UI
    chatHistory.value.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    console.error('Error sending message:', err);
    chatHistory.value.push({ role: 'assistant', content: 'Meow error! Is the backend running?' });
  } finally {
    isTyping.value = false;
  }
}
</script>

<style scoped>
#chat {
  max-width: 60rem;
  width: 100%;
  background: #F6D485;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  width: 90%;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 10px;
  border-radius: 8px;
  max-width: 80%;
}

.user {
  align-self: flex-end;
  background-color: #f1c40f;
  color: black;
}

.assistant {
  align-self: flex-start;
  background-color: #f58928;
  color: black;
}

.chat-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #242424;
  width: 100%;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  margin-left: 10px;
  padding: 10px 20px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #242424;
}

button:active {
  background: #f1c40f;
}
</style>