<template>
  <q-card
    style="
      width: 100%;
      display: flex;
      flex-direction: row;
      padding: 8px;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
    "
    :style="icon ? 'height: 90px;' : 'height: 60px; font-weight: 600;'"
  >
    <q-icon v-if="icon" :name="icon" style="flex: 0.75" size="40px" />
    <q-title style="font-size: 16px; flex: 1.25">{{ title }}</q-title>
    <q-icon v-if="!icon" :name="'fa fa-angle-down'" style="flex: 0.25" size="20px" />
    <q-toggle v-if="toggleNotif" v-model="isToggled" @update:model-value="doToggle('notif')" />
    <q-toggle v-if="toggleDark" v-model="isToggled" @update:model-value="doToggle('dark')" />
  </q-card>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String,
    toggleNotif: Boolean,
    toggleDark: Boolean,
  },

  data: () => {
    return {
      isToggled: false,
    }
  },

  methods: {
    doToggle(type) {
      this.$emit('toggle', type, this.isToggled)
    },
  },
}
</script>
