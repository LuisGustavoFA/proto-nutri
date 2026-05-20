<template>
  <!-- Mude a tag de abertura da página para isto: -->
<q-page class="column bg-grey-3 chat-page" :style-fn="(offset) => { return { height: `calc(100vh - ${offset}px)` } }">
    <!-- HEADER -->
    <div class="bg-white q-pa-md shadow-2 row items-center justify-between chat-header" style="border-radius: 0 0 20px 20px; z-index: 10">
      <!-- BOTÃO HISTÓRICO CONECTADO -->
      <q-btn flat round icon="history" color="black" size="lg" @click="openHistoryDialog" />
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

    <!-- AREA DE MENSAGENS -->
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

    <!-- INPUT -->
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

    <!-- DIALOG DE FEEDBACK / AVALIAÇÃO DE PREFERÊNCIAS (SITUAÇÃO 1) -->
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
            <p class="q-mb-xs text-weight-bold">Quão precisas estão essas informações?</p>
            <q-rating v-model="rating" max="5" size="2em" color="yellow-8" icon="star_border" icon-selected="star" />
          </div>
        </q-card-section>

        <q-card-actions align="center" v-if="!feedbackSubmitted" class="q-pa-md">
          <q-btn color="green" label="Enviar Avaliação" @click="submitFeedback" :disable="rating === 0 || loadingFeedback" :loading="loadingFeedback" class="full-width" />
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

    <!-- POPUP DO HISTÓRICO DE RECEITAS (REQUISITO 2) -->
    <q-dialog v-model="showHistoryDialog">
      <q-card style="min-width: 350px; max-width: 600px; width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-green text-weight-bold">Minhas Receitas</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section style="max-height: 65vh" class="scroll q-pt-md">
          <div v-if="localRecipes.length === 0" class="text-center text-grey-6 q-pa-xl">
            <q-icon name="restaurant_menu" size="3em" color="grey-4" class="q-mb-sm" />
            <div>Nenhuma receita gerada ou salva ainda nesta sessão.</div>
          </div>
          <div v-else v-for="recipe in localRecipes" :key="recipe.id" class="q-mb-md q-pa-md bg-grey-1 rounded-borders shadow-1">
            <div class="text-caption text-grey-6 text-weight-medium q-mb-sm row items-center">
              <q-icon name="calendar_today" size="xs" class="q-mr-xs" /> {{ recipe.date }}
            </div>
            <div class="markdown-body" v-html="renderMarkdown(recipe.content)"></div>
          </div>
        </q-card-section>
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
      loadingFeedback: false,
      store: useMessagesStore(),
      showFeedbackDialog: false,
      showHistoryDialog: false,
      rating: 0,
      feedbackSubmitted: false,
      userPreferences,
      localRecipes: []
    }
  },
  computed: {
    messages() {
      return this.store.messages
    },
  },
  mounted() {
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

    openHistoryDialog() {
      // Carrega os dados atualizados do localStorage toda vez que abre o popup
      this.localRecipes = JSON.parse(localStorage.getItem('nutro_recipes') || '[]')
      this.showHistoryDialog = true
    },

    async submitFeedback() {
      this.loadingFeedback = true
      try {
        // Resgata o histórico local de receitas salvas para enviar no corpo do e-mail
        const historicoReceitasSalvas = localStorage.getItem('nutro_recipes') || '[]'

        // Dica: Se process.env.WEB_FORM_KEY falhar, coloque a string direta 'sua-chave-aqui'
        const ACCESS_KEY = '05e903e1-3974-4377-82bf-cce7fb21b6a9';

        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            access_key: ACCESS_KEY,
            subject: '⭐ Novo Feedback de Limite Atingido - Nutro',
            nota_satisfacao: this.rating,
            preferencias_automaticas: JSON.stringify(this.userPreferences, null, 2),
            historico_de_receitas: historicoReceitasSalvas
          })
        })

        this.feedbackSubmitted = true
      } catch (error) {
        console.error('Erro ao enviar para o Web3Forms:', error)
        this.$q.notify({
          color: 'negative',
          message: 'Falha ao processar o envio. Tente novamente.',
          icon: 'error'
        })
      } finally {
        this.loadingFeedback = false
      }
    },

    goToForm() {
      window.open('/sub', '_blank')
      this.showFeedbackDialog = false
    },

    async send() {
      const userMessageCount = this.store.messages.filter(m => m.type === 'user').length

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

        if (responseText.includes('###')) {
          const savedRecipes = JSON.parse(localStorage.getItem('nutro_recipes') || '[]')
          const newRecipe = {
            id: Date.now(),
            date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
            content: responseText
          }
          savedRecipes.push(newRecipe)
          localStorage.setItem('nutro_recipes', JSON.stringify(savedRecipes))
        }

      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
        this.scrollToBottom()
        this.$nextTick(() => {
          if (this.$refs.chatInput) this.$refs.chatInput.focus()
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
/* Garante que a página não crie scroll externo */
.chat-page {
  overflow: hidden;
}

/* Faz a área de mensagens expandir no meio e cria o scroll interno */
.chat-scroll {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

/* Garante que o input nunca seja esmagado e fique fixo na base */
.chat-input {
  flex-shrink: 0;
}

/* Estilos para deixar as receitas formatadas bonitas */
.markdown-body :deep(h3), .markdown-body :deep(h4) { margin: 8px 0; font-weight: bold; line-height: 1.2; }
.markdown-body :deep(h3) { font-size: 1.2rem; }
.markdown-body :deep(h4) { font-size: 1rem; }
.markdown-body :deep(ul), .markdown-body :deep(ol) { padding-left: 20px; margin: 8px 0; }
.markdown-body :deep(p) { margin-bottom: 8px; }
</style>
