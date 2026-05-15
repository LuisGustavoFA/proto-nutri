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
    <CardMedium :title="'Fulano de Tal'" :icon="'person'" :subtitle="['Entrou há 2 semanas']" />
    <q-btn @click="$router.push('/sub')" noCaps style="font-size: 12px; padding: 0">
      <CardToggle
        :icon="'star'"
        :title="'Inscreva-se para participar da próxima etapa de testes'"
      />
    </q-btn>
    <CardToggle :icon="'message'" :title="'Notificações'" :toggleNotif="true" @toggle="doToggle" />
    <CardToggle :icon="'lightbulb'" :title="'Modo Escuro'" :toggleDark="true" @toggle="doToggle" />
    <q-space />
    <span style="color: gray; text-align: center; font-size: 12px">v1.0 proto</span>
  </q-page>
</template>

<script>
import CardMedium from 'src/components/CardMedium.vue'
import CardToggle from 'src/components/CardToggle.vue'

export default {
  components: {
    CardMedium,
    CardToggle,
  },
  methods: {
    doToggle(type, value) {
      console.log(type + ': ' + value)
    },
  },
}
</script>
