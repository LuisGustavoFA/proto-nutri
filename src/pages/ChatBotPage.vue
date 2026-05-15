<template>
  <q-page class="column bg-grey-3 chat-page">
    <div
      class="bg-white q-pa-md shadow-2 row items-center justify-between chat-header"
      style="border-radius: 0 0 20px 20px; z-index: 10"
    >
      <q-btn flat round icon="history" color="black" size="lg" />
      <div class="text-center">
        <div class="text-weight-bold text-subtitle1">Nutricionista</div>
        <div class="text-weight-bold text-subtitle1">Inteligente</div>
      </div>
      <div class="column items-center">
        <q-avatar size="48px" class="bg-grey-4">
          <q-icon name="person" color="grey-7" />
        </q-avatar>
        <q-badge
          color="positive"
          text-color="white"
          label="FREE"
          style="margin-top: -10px; z-index: 9"
        />
      </div>
    </div>

    <div class="q-pa-md chat-scroll" ref="scrollArea">
      <template v-for="msg in messages" :key="msg.id">
        <q-chat-message
          v-if="msg.type === 'user'"
          bg-color="light-green-3"
          :text="[msg.text]"
          sent
        />

        <q-chat-message v-else bg-color="white">
          <div class="markdown-body">
            <div v-html="renderMarkdown(msg.text)"></div>
          </div>
        </q-chat-message>
      </template>
    </div>

    <div class="q-pa-md bg-white shadow-2 chat-input" style="border-radius: 20px 20px 0 0">
      <q-form @submit.prevent="send">
        <q-input
          rounded
          outlined
          v-model="inputText"
          placeholder="Digitar..."
          dense
          :loading="loading"
          :disable="loading"
        >
          <template v-slot:append>
            <q-btn round flat icon="send" color="grey-7" @click="send" :disable="loading" />
          </template>
        </q-input>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { useMessagesStore } from 'src/stores/messagesStore'
import runGroq from '../services/geminiApi'
import { userHistory } from '../services/geminiApi'
import { marked } from 'marked'
import { Notify } from 'quasar'

export default {
  data() {
    return {
      inputText: '',
      loading: false,
      store: useMessagesStore(),
    }
  },
  computed: {
    messages() {
      return this.store.messages
    },
  },
  methods: {
    // Função para transformar Markdown em HTML
    renderMarkdown(text) {
      if (!text) return ''
      return marked(text, { breaks: true })
    },

    async send() {
      if (this.store.messages.filter((m) => m.type === 'bot').length >= 5) {
        Notify.create({
          message:
            'Limite de mensagens excedido. Por favor inscreva-se para o beta fechado na aba Perfil.',
          position: 'bottom',
        })
        console.log(this.store.messages)
      } else {
        const messageContent = this.inputText.trim()
        if (!messageContent || this.loading) return

        this.inputText = ''
        this.loading = true

        this.store.addMessage({
          id: Date.now(),
          type: 'user',
          text: messageContent,
        })

        this.scrollToBottom()

        const loadingId = Date.now() + 1
        this.store.addMessage({
          id: loadingId,
          type: 'bot',
          text: '...',
        })

        try {
          const responseText = await runGroq(messageContent)
          userHistory.push({ userMessage: messageContent, botReply: responseText })

          // Atualiza a mensagem na store
          const index = this.store.messages.findIndex((m) => m.id === loadingId)
          if (index !== -1) {
            this.store.messages[index].text = responseText
            this.totalMsgs++
          }
        } catch (error) {
          console.error(error)
        } finally {
          this.loading = false
          this.scrollToBottom()
        }
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.scrollArea
        if (el) el.scrollTop = el.scrollHeight
      })
    },
  },
}
</script>

<style scoped>
/* Estilos para deixar o Markdown bonito dentro do chat */
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin: 8px 0;
  font-weight: bold;
  line-height: 1.2;
}

.markdown-body :deep(h3) {
  font-size: 1.2rem;
}
.markdown-body :deep(h4) {
  font-size: 1rem;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.markdown-body :deep(p) {
  margin-bottom: 8px;
}

/* Garante que o texto não quebre o layout */
.chat-scroll {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 290px);
}
</style>
