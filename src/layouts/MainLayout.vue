<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-green" elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Nutro</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="bg-green" style="height: 80px">
      <div style="display: flex; flex-direction: row; width: 100%; height: 100%">
        <q-btn flat style="flex: 1" @click="this.$router.push('/home')"
          ><q-icon name="home"
        /></q-btn>
        <q-btn flat style="flex: 1" @click="this.$router.push('/objectives')"
          ><q-icon name="list"
        /></q-btn>
        <q-btn flat style="flex: 1" @click="this.$router.push('/chatbot')"
          ><q-icon name="chat"
        /></q-btn>
        <q-btn flat style="flex: 1" @click="this.$router.push('/more')"
          ><q-icon name="person"
        /></q-btn>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Landing Page',
    caption: 'Voltar para a Landing Page',
    icon: 'home',
    link: '/',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
