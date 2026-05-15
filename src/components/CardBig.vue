<template>
  <q-card
    style="
      width: 100%;
      height: 360px;
      display: flex;
      flex-direction: column;
      padding: 8px;
      border-radius: 8px;
    "
  >
    <q-title style="font-size: 16px">{{ title }}</q-title>
    <div style="width: 100%">
      <img class="img_graph" src="../assets/semanal-graph.png" style="object-fit: contain" />
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    title: String,
  },
}
</script>

<style>
@media (max-width: 800px) {
  .img_graph {
    width: 100%;
  }
}
</style>
