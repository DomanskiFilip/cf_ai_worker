# CF_Ai_Worker assignment app

A full-stack AI chat application built with Cloudflare Workers, Hono, D1, and Vue 3. The AI identifies as a professional assistant that is secretly a Yellow Maine Coon cat.

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Cloudflare](https://img.shields.io/badge/Cloudflare-000000?style=for-the-badge&logo=cloudflare&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-000000?style=for-the-badge&logo=hono&logoColor=white)
![D1](https://img.shields.io/badge/D1-000000?style=for-the-badge&logo=d1&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Wrangler](https://img.shields.io/badge/Wrangler-000000?style=for-the-badge&logo=wrangler&logoColor=white)
![CloudflareWorkers](https://img.shields.io/badge/CloudflareWorkers-000000?style=for-the-badge&logo=cloudflareworkers&logoColor=white)
![Generative Artificial Intelligence](https://img.shields.io/badge/Generative%20Artificial%20Intelligence-000000?style=for-the-badge&logo=generative-artificial-intelligence&logoColor=white)
## Prerequisites
Node.js (v18 or higher)

npm

Cloudflare Account (for AI model access)

Run npx wrangler login in your terminal to authenticate.

## Project Structure
```
cf_ai_worker/
├── backend/                # Cloudflare Worker & AI Logic
│   ├── src/
│   │   └── index.ts        # Entry point: Hono API routes & ChatWorkflow class
│   ├── schema.sql          # D1 Database table definitions
│   ├── wrangler.toml       # Cloudflare configuration (D1, Workflows, AI bindings)
│   └── package.json        # Backend dependencies (Hono, Wrangler)
│
├── frontend/               # Vue.js Web Application
│   ├── src/
│   │   ├── components/
│   │   │   └── chat.vue    # Main Chat component (UI & API fetching)
│   │   ├── App.vue         # Root Vue component (Layout & Footer)
│   │   └── main.js         # Vue initialization
│   ├── .env                # Local environment variables (VITE_API_URL)
│   ├── index.html          # HTML entry point
│   └── package.json        # Frontend dependencies (Vue, Vite)
│
└── README.md               # Project documentation
```
## Setup Instructions
1. Backend Setup (Cloudflare Worker)
Navigate to the backend directory:
```bash
cd backend
npm install
```
Initialize Local Database: Even in local development, you must create the D1 table structure.
```bash
npx wrangler d1 execute chat-memory --local --file=./schema.sql
```
Start the Backend Server:
```bash
npx wrangler dev
```
The server should now be running at http://127.0.0.1:8787.

2. Frontend Setup (Vue.js)
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```
Configure Environment Variables: Create a .env file in the frontend/ root folder:

```Plaintext
VITE_API_ENDPOINT=http://127.0.0.1:8787
```
Start the Frontend App:
```bash
npm run dev
```
The app should now be accessible at http://localhost:5173.

## Key Features Demonstrated
Hono Framework: Used for lightweight, edge-native routing and CORS handling.

Cloudflare Workflows: Orchestrates the multi-step process (Fetch History -> AI Inference -> Save to DB).

D1 Database: Persistent storage for user chat history to provide AI "memory."

Llama 3.3 70B: High-performance AI model used via Workers AI.

State Management: Vue 3 Composition API with persistent localStorage for User IDs.

## Troubleshooting
500 Internal Server Error: Check the backend terminal. Ensure you ran the d1 execute --local command.

CORS Error: Ensure app.use('*', cors()) is present in backend/src/index.ts.

Undefined URL: If the frontend can't find the backend, ensure your .env variables start with VITE_ and that you restarted the frontend dev server.
