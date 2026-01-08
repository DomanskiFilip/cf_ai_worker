<template>
  <main>
      <section id="header">
        <h1>Cloudflare AI Chatbot Assignment</h1>
      </section>
      <Chat />
      <section id="footer">
        <p>© 2026 Filip Domański | Powered by Cloudflare AI</p>
      </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import Chat from './components/Chat.vue';
</script>

<style scoped>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    padding: 20px;
  }
  
  section {
    text-align: center;
    width: 100%;
    height: 10%;
  }
  
  #header {
    margin-bottom: 20px;
  }
  
  #footer {
    margin-top: 20px;
  }
</style>
