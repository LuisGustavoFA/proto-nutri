<template>
  <q-card
    style="
      width: 100%;
      height: 240px;
      display: flex;
      flex-direction: column;
      padding: 8px;
      border-radius: 8px;
    "
  >
    <div
      style="
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        padding: 8px;
      "
    >
      <q-icon
        v-if="icon"
        :name="icon"
        style="background-color: green; border-radius: 50%; padding: 4px"
        size="40px"
      />
      <q-title style="font-size: 16px; width: 100%">{{ title }}</q-title>
    </div>
    <div style="flex: 2">
      <q-title
        style="font-size: 14px; flex: 1.65; color: gray"
        v-for="sub in subtitle"
        v-bind:key="sub"
        ><br />- {{ sub }}</q-title
      >
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String,
    subtitle: [],
  },
}
</script>
