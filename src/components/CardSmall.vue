<template>
  <q-card
    style="width: 100%; display: flex; flex-direction: column; padding: 8px; border-radius: 8px"
  >
    <div
      style="display: flex; flex-direction: row; align-items: center; cursor: pointer"
      @click="toggleExpand"
    >
      <q-icon v-if="icon" :name="icon" style="flex: 0.75" size="40px" />

      <q-title style="font-size: 16px; flex: 1.25">
        {{ title }}
      </q-title>

      <q-icon
        v-if="!icon"
        :name="isExpanded ? 'fa fa-angle-up' : 'fa fa-angle-down'"
        style="flex: 0.45"
        size="20px"
      />
    </div>

    <q-slide-transition>
      <div v-show="!icon && isExpanded" style="margin-top: 8px">
        <q-list dense>
          <q-item v-for="(item, index) in items" :key="index">
            <q-item-section style="color: gray">• {{ item }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String,
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      isExpanded: true,
    }
  },

  methods: {
    toggleExpand() {
      if (!this.icon) {
        this.isExpanded = !this.isExpanded
      }
    },
  },
}
</script>
