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
    <CardBig :title="'Objetivos Diários'" />
    <div
      style="
        display: flex;
        flex-direction: row;
        gap: 16px;
        width: 100%;
        justify-content: space-between;
      "
    >
      <CardSmall :title="'Escanear Ingrediente'" :icon="'camera'" />
      <CardSmall :title="'Sugestão de Receita'" :icon="'list'" />
    </div>
    <CardMedium
      :title="'Atualize para o plano Premium agora mesmo!'"
      :icon="'star'"
      :subtitle="[
        'Sem limite de sugestões de receitas mensal',
        'Sem anúncios',
        'Mais opções de notificações',
      ]"
    />
  </q-page>
</template>

<script>
import CardBig from 'src/components/CardBig.vue'
import CardSmall from 'src/components/CardSmall.vue'
import CardMedium from 'src/components/CardMedium.vue'

export default {
  components: {
    CardBig,
    CardSmall,
    CardMedium,
  },
}
</script>
