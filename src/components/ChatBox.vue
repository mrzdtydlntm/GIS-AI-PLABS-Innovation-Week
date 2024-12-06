<template>
  <div class="chat-box">
    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="chat-message"
        :class="{
          'user-message': message.sender === 'user',
          'bot-message': message.sender === 'bot',
        }"
      >
        <div v-html="parseMarkdown(message.text)"></div>
      </div>
      <div v-if="isBotTyping" class="chat-message bot-message typing-indicator">
        <p>Bot is typing...</p>
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="newMessage"
        @keyup.enter="runAI"
        type="text"
        :disabled="isChatDisabled"
        placeholder="Type your message..."
      />
      <button @click="runAI" :disabled="isChatDisabled">Send</button>
    </div>
  </div>
</template>

<script setup>
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ref, reactive, nextTick } from 'vue'
import { marked } from 'marked'

const messages = reactive([
  { text: 'Please click the marker in maps to get the data', sender: 'bot' },
])
const newMessage = ref('')
const isBotTyping = ref(false)
const messagesContainer = ref(null)
const isChatDisabled = ref(true)

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function parseMarkdown(text) {
  return marked(text)
}

function runAI(data) {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
    if (!apiKey) {
      throw new Error('API Key not found in environment variables.')
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    })

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain',
    }

    if (newMessage.value.trim()) {
      isBotTyping.value = true
      let msg = newMessage.value

      messages.push({ text: newMessage.value.trim(), sender: 'user' })

      setTimeout(async () => {
        const chatSession = await model.generateContent(msg, generationConfig)

        const response = chatSession.response.text()

        messages.push({ text: response.trim(), sender: 'bot' })

        await nextTick()
        scrollToBottom()
        isBotTyping.value = false
        isChatDisabled.value = false
      }, 1000)
      newMessage.value = ''
      nextTick()
      scrollToBottom()
    } else if (data && data.length === 2) {
      isBotTyping.value = true
      const msg = `Please search this longitude ${data[0]} and latitude ${data[1]} country info and show me the result please and check the disease that happen on this area`

      setTimeout(async () => {
        const chatSession = await model.generateContent(msg, generationConfig)

        const response = chatSession.response.text()

        messages.push({ text: response.trim(), sender: 'bot' })

        await nextTick()
        scrollToBottom()
        isBotTyping.value = false
      }, 1000)
    }
  } catch (error) {
    console.error(error.message)
  }
}

// Expose methods for parent access
defineExpose({
  runAI,
})
</script>

<style scoped>
.chat-box {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 700px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-message {
  max-width: 80%;
  padding: 10px;
  border-radius: 8px;
  word-wrap: break-word;
}

.user-message {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.bot-message {
  align-self: flex-start;
  background-color: #e9ecef;
  color: black;
}

.typing-indicator {
  font-style: italic;
  color: gray;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ccc;
  padding: 10px;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.chat-input button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #0056b3;
}
</style>
