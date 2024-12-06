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
        <p>{{ message.text }}</p>
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
        placeholder="Type your message..."
      />
      <button @click="runAI">Send</button>
    </div>
  </div>
</template>

<script>
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ref, nextTick } from 'vue'

export default {
  data() {
    return {
      messages: [{ text: 'Hello! How can I help you today?', sender: 'bot' }],
      newMessage: '',
      isBotTyping: false,
    }
  },
  setup() {
    const messagesContainer = ref(null)

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    return {
      messagesContainer,
      scrollToBottom,
    }
  },
  methods: {
    runAI() {
      try {
        if (this.newMessage.trim()) {
          this.isBotTyping = true
          const msg = this.newMessage
          // Add user message to messages
          this.messages.push({ text: this.newMessage.trim(), sender: 'user' })

          // Simulate bot response after 1 second
          setTimeout(async () => {
            const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
            if (!apiKey) {
              throw new Error('API Key not found in environment variables.')
            }

            const genAI = new GoogleGenerativeAI(apiKey)

            const model = genAI.getGenerativeModel({
              model: 'gemini-1.5-pro',
            })

            const generationConfig = {
              temperature: 1,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 8192,
              responseMimeType: 'text/plain',
            }

            const chatSession = await model.generateContent(msg, generationConfig)

            const response = chatSession.response.text()

            this.messages.push({ text: response.trim(), sender: 'bot' })

            await nextTick()
            this.scrollToBottom()
            this.isBotTyping = false
          }, 1000)

          // Clear the input field
          this.newMessage = ''
        }
      } catch (error) {
        console.error(error.message)
      }
    },
  },
}
</script>

<style scoped>
.chat-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  height: 500px;
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
