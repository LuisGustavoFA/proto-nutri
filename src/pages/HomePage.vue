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
    <CardBig :title="'Objetivos Diários'"/>
    <div
      style="
        display: flex;
        flex-direction: row;
        gap: 16px;
        width: 100%;
        justify-content: space-between;
      "
    >
      <div @click="handleEscanear" class="cursor-pointer" style="width: 100%;">
        <CardSmall :title="'Escanear Ingrediente'" :icon="'camera'"/>
      </div>

      <div @click="handleSugestao" class="cursor-pointer" style="width: 100%;">
        <CardSmall :title="'Sugestão de Receita'" :icon="'list'"/>
      </div>
    </div>

    <div @click="handlePremium" class="cursor-pointer">
      <CardMedium :title="'Atualize para o plano Premium agora mesmo!'" :icon="'star'" :subtitle="[
          'Sem limite de sugestões de receitas mensal',
          'Sem anúncios',
          'Mais opções de notificações',
        ]"/>
    </div>
  </q-page>
</template>

<script>
import CardBig from 'src/components/CardBig.vue'
import CardSmall from 'src/components/CardSmall.vue'
import CardMedium from 'src/components/CardMedium.vue'
import { Notify } from 'quasar'

export default {
  components: {
    CardBig,
    CardSmall,
    CardMedium,
  },
  methods: {
    handleEscanear() {
      Notify.create({
        message: 'Scanner de ingredientes em desenvolvimento (Apenas simulação).',
        color: 'blue-8',
        icon: 'camera_alt',
        position: 'top'
      })
    },
    handleSugestao() {
      // Leva o usuário para a tela do chat
      this.$router.push('/chatbot')
    },
    handlePremium() {
      Notify.create({
        message: 'O serviço Premium ainda não foi implementado neste protótipo!',
        color: 'orange-9',
        icon: 'warning',
        position: 'bottom'
      })
    }
  }
}
</script>
