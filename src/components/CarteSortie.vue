<script setup>
defineProps({
  sortie: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <span :class="{ sud: sortie.region === 'sud' }">
    {{ sortie.ville }} — {{ sortie.date }} {{ sortie.places }} places
  </span>
</template>

<style scoped>
.sud {
  color: teal;
  font-weight: bold;
}
</style>