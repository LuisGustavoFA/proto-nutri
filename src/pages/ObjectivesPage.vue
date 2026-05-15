<template>
  <q-page
    style="
      padding: 16px 24px;
      background-color: #e9e9e9;
      gap: 16px;
      display: flex;
      justify-content: start;
      flex-direction: column;
    "
  >
    <div v-for="(items, categoria) in userPref" :key="categoria" class="relative-position">
      <CardSmall :title="formatTitle(categoria)" :items="items" />
      <q-btn
        flat
        round
        dense
        icon="edit"
        color="green"
        class="absolute-top-right q-ma-xs"
        @click="openEditDialog(categoria, items)"
      />
    </div>

    <q-space />

    <span style="color: gray; text-align: center; font-size: 12px">
      Informações inferidas com base em sua atividade com o Nutricionista Inteligente
    </span>

    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Editar {{ formatTitle(currentCategory) }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            v-model="tempItems"
            use-input
            use-chips
            multiple
            hide-dropdown-icon
            input-debounce="0"
            new-value-mode="add-unique"
            hint="Pressione Enter para adicionar novos itens"
            filled
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Salvar" @click="savePreferences" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import CardSmall from 'src/components/CardSmall.vue'
import { userPreferences } from 'src/services/geminiApi'

export default {
  components: { CardSmall },

  data() {
    return {
      showEditDialog: false,
      currentCategory: '',
      tempItems: [], // Cópia temporária para não mutar o estado antes de salvar
    }
  },

  computed: {
    userPref() {
      return userPreferences
    },
  },

  methods: {
    formatTitle(key) {
      const titles = {
        objetivosSaude: 'Objetivos de Saúde',
        preferenciasAlimentares: 'Preferências Alimentares',
        estiloVidaTreino: 'Estilo de Vida e Treino',
        necessidadesEspecificas: 'Necessidades Específicas',
        cozinhaOrcamento: 'Cozinha e Orçamento',
      }
      return titles[key] || key
    },

    openEditDialog(categoria, items) {
      this.currentCategory = categoria
      // Criamos uma cópia rasa para o dialog
      this.tempItems = [...items]
      this.showEditDialog = true
    },

    savePreferences() {
      // Atualiza o objeto reativo importado
      if (this.currentCategory && userPreferences[this.currentCategory]) {
        userPreferences[this.currentCategory] = [...this.tempItems]

        // Opcional: Notificação de sucesso
        this.$q.notify({
          message: 'Preferências atualizadas!',
          color: 'blue',
          icon: 'check',
          timeout: 2000,
        })
      }
    },
  },
}
</script>
