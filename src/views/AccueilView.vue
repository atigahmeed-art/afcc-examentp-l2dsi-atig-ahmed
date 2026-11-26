<script setup>
import { ref, computed, onMounted } from 'vue'
import CarteSortie from '../components/CarteSortie.vue'
import { useSorties } from '../composables/useSorties'

const { sorties, chargement, erreurChargement, charger } = useSorties()
const filtre = ref('')

onMounted(() => {
  if (sorties.value.length === 0) {
    charger()
  }
})

const sortiesFiltrees = computed(() => {
  const recherche = filtre.value.trim().toLowerCase()
  if (!recherche) {
    return sorties.value
  }
  return sorties.value.filter((sortie) =>
    sortie.ville.toLowerCase().includes(recherche)
  )
})

const nombreSud = computed(() => {
  return sortiesFiltrees.value.filter((sortie) => sortie.region === 'sud').length
})
</script>

<template>
  <section>
    <p v-if="chargement">Chargement...</p>

    <template v-else-if="erreurChargement">
      <p class="erreur">{{ erreurChargement }}</p>
      <button type="button" @click="charger">Réessayer</button>
    </template>

    <template v-else>
      <div>
        <label for="filtre">Filtre</label>
        <input id="filtre" v-model="filtre" type="text" placeholder="Rechercher une ville..." />
      </div>

      <p>{{ nombreSud }} sortie(s) du sud</p>

      <ul v-if="sortiesFiltrees.length > 0">
        <li v-for="sortie in sortiesFiltrees" :key="sortie.id">
          <CarteSortie :sortie="sortie" />
          <RouterLink :to="{ name: 'sortie', params: { id: sortie.id } }">Voir</RouterLink>
        </li>
      </ul>
      <p v-else>Aucun résultat</p>
    </template>
  </section>
</template>

<style scoped>
.erreur {
  color: crimson;
}
</style>