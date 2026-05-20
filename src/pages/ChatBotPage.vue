<template>
  <q-page class="column bg-grey-3 chat-page">
    <div class="bg-white q-pa-md shadow-2 row items-center justify-between chat-header" style="border-radius: 0 0 20px 20px; z-index: 10">
      <q-btn flat round icon="history" color="black" size="lg" />
      <div class="text-center">
        <div class="text-weight-bold text-subtitle1">Nutricionista</div>
        <div class="text-weight-bold text-subtitle1">Inteligente</div>
      </div>
      <div class="column items-center">
        <q-avatar size="48px" class="bg-grey-4">
          <q-icon name="person" color="grey-7" />
        </q-avatar>
        <q-badge color="positive" text-color="white" label="FREE" style="margin-top: -10px; z-index: 9" />
      </div>
    </div>

    <div class="q-pa-md chat-scroll" ref="scrollArea">
      <template v-for="msg in messages" :key="msg.id">
        <q-chat-message v-if="msg.type === 'user'" bg-color="light-green-3" :text="[msg.text]" sent />
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
  ref="chatInput"
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

    <!-- DIALOG DE FEEDBACK / AVALIAÇÃO DE PREFERÊNCIAS -->
    <q-dialog v-model="showFeedbackDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section v-if="!feedbackSubmitted" class="q-pb-none">
          <div class="text-h6 text-center text-green">Limite Atingido</div>
          <p class="text-center q-mt-sm">Baseado na nossa conversa, aqui está o seu perfil extraído pela IA:</p>

          <div class="q-my-md bg-grey-2 q-pa-sm rounded-borders" style="font-size: 13px;">
            <div v-for="(items, cat) in userPreferences" :key="cat" class="q-mb-xs">
              <strong>{{ formatTitle(cat) }}:</strong>
              <span v-if="items.length">{{ items.join(', ') }}</span>
              <span v-else class="text-grey-6">Não informado</span>
            </div>
          </div>

          <div class="text-center q-mt-md">
            <p class="q-mb-xs font-weight-bold">Quão precisas estão essas informações?</p>
            <q-rating v-model="rating" max="5" size="2em" color="yellow-8" icon="star_border" icon-selected="star" />
          </div>
        </q-card-section>

        <q-card-actions align="center" v-if="!feedbackSubmitted" class="q-pa-md">
          <q-btn color="green" label="Enviar Avaliação" @click="submitFeedback" :disable="rating === 0" class="full-width" />
        </q-card-actions>

        <!-- TELA PÓS-AVALIAÇÃO -->
        <q-card-section v-else class="text-center">
          <q-icon name="check_circle" color="green" size="4em" />
          <div class="text-h6 q-mt-md">Obrigado!</div>
          <p class="text-grey-7">Seu feedback ajuda a melhorar o Nutro.</p>
        </q-card-section>

        <q-card-actions align="center" v-if="feedbackSubmitted" class="q-pa-md column q-gutter-sm">
          <q-btn color="secondary" label="Preencher formulário completo" @click="goToForm" class="full-width" />
          <q-btn flat color="grey-8" label="Fechar e continuar olhando" v-close-popup class="full-width q-ml-none" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { useMessagesStore } from 'src/stores/messagesStore'
import runGroq, { userHistory, userPreferences } from '../services/geminiApi'
import { marked } from 'marked'

export default {
  data() {
    return {
      inputText: '',
      loading: false,
      store: useMessagesStore(),
      showFeedbackDialog: false,
      rating: 0,
      feedbackSubmitted: false,
      userPreferences // Importando o state reativo do geminiApi
    }
  },
  computed: {
    messages() {
      return this.store.messages
    },
  },
  mounted() {
    // 1. Faz a primeira pergunta ao entrar no Chat caso não haja mensagens
    if (this.store.messages.length === 0) {
      this.store.addMessage({
        id: Date.now(),
        type: 'bot',
        text: 'Olá! Sou seu Nutricionista Inteligente. Para montar receitas perfeitas para você, vamos configurar seu perfil em 3 passos rápidos.\n\n**1. Quais são seus objetivos de saúde (ex: perder peso, hipertrofia) e como é sua rotina de exercícios?**'
      })
    }
  },
  methods: {
    renderMarkdown(text) {
      if (!text) return ''
      return marked(text, { breaks: true })
    },

    formatTitle(key) {
      const titles = {
        objetivosSaude: 'Objetivos',
        preferenciasAlimentares: 'Alimentação',
        estiloVidaTreino: 'Rotina e Treino',
        necessidadesEspecificas: 'Necessidades Extras',
        cozinhaOrcamento: 'Orçamento/Equipamentos',
      }
      return titles[key] || key
    },

    submitFeedback() {
      // Simula o envio de feedback
      this.feedbackSubmitted = true
    },

    goToForm() {
      // Substitua pela URL do seu formulário
      window.open('/sub', '_blank')
      this.showFeedbackDialog = false
    },

    async send() {
      // Conta apenas as mensagens do usuário
      const userMessageCount = this.store.messages.filter(m => m.type === 'user').length

      // Limite: 4 passos do onboarding + 3 pedidos de receita (total 7)
      if (userMessageCount >= 7) {
        this.showFeedbackDialog = true
        return
      }

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

        const index = this.store.messages.findIndex((m) => m.id === loadingId)
        if (index !== -1) {
          this.store.messages[index].text = responseText
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
        this.scrollToBottom()

        // Retorna o foco ao input
        this.$nextTick(() => {
          if (this.$refs.chatInput) {
            this.$refs.chatInput.focus()
          }
        })
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
/* Mantido seu estilo anterior */
.markdown-body :deep(h3), .markdown-body :deep(h4) { margin: 8px 0; font-weight: bold; line-height: 1.2; }
.markdown-body :deep(h3) { font-size: 1.2rem; }
.markdown-body :deep(h4) { font-size: 1rem; }
.markdown-body :deep(ul), .markdown-body :deep(ol) { padding-left: 20px; margin: 8px 0; }
.markdown-body :deep(p) { margin-bottom: 8px; }
.chat-scroll { flex: 1; overflow-y: auto; max-height: calc(100vh - 290px); }
</style>
