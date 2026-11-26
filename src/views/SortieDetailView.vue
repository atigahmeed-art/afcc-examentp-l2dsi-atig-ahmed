<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSorties } from '../composables/useSorties'
import { inscrire } from '../services/api'

const route = useRoute()
const { sorties, chargement, charger } = useSorties()

onMounted(() => {
  if (sorties.value.length === 0) {
    charger()
  }
})

const sortie = computed(() => {
  const idParam = Number(route.params.id)
  return sorties.value.find((item) => Number(item.id) === idParam) || null
})

// Champs du formulaire
const prenom = ref('')
const email = ref('')
const age = ref('')
const reglement = ref(false)

// États d'interaction & envoi
const touche = ref({
  prenom: false,
  email: false,
  age: false,
  reglement: false,
})
const tentativeEnvoi = ref(false)
const envoiEnCours = ref(false)
const messageConfirmation = ref('')
const messageErreurEnvoi = ref('')

// Règles de validation
const erreurPrenom = computed(() => {
  if (prenom.value.trim().length === 0) {
    return 'Le prénom de l’enfant est obligatoire.'
  }
  return ''
})

const erreurEmail = computed(() => {
  if (!email.value.includes('@')) {
    return 'L’e-mail du parent doit contenir @.'
  }
  return ''
})

const erreurAge = computed(() => {
  const valeurAge = Number(age.value)
  if (age.value === '' || Number.isNaN(valeurAge) || valeurAge < 6 || valeurAge > 18) {
    return 'L’âge doit être un nombre entre 6 et 18.'
  }
  return ''
})

const erreurReglement = computed(() => {
  if (!reglement.value) {
    return 'Vous devez accepter le règlement.'
  }
  return ''
})

const formulaireValide = computed(() => {
  return (
    !erreurPrenom.value &&
    !erreurEmail.value &&
    !erreurAge.value &&
    !erreurReglement.value
  )
})

function afficherErreur(champ) {
  return touche.value[champ] || tentativeEnvoi.value
}

async function soumettre() {
  tentativeEnvoi.value = true
  messageConfirmation.value = ''
  messageErreurEnvoi.value = ''

  if (!formulaireValide.value || !sortie.value) {
    return
  }

  envoiEnCours.value = true
  const prenomNettoye = prenom.value.trim()
  const payload = {
    sortield: sortie.value.id,
    prenom: prenomNettoye,
    email: email.value.trim(),
    age: Number(age.value),
    reglement: true,
  }

  try {
    await inscrire(payload)
    messageConfirmation.value = `Inscription de ${prenomNettoye.toUpperCase()} confirmée`

    // Vider les champs en cas de succès
    prenom.value = ''
    email.value = ''
    age.value = ''
    reglement.value = false
    touche.value = {
      prenom: false,
      email: false,
      age: false,
      reglement: false,
    }
    tentativeEnvoi.value = false
  } catch {
    // En cas d'échec, afficher le message et garder les champs remplis
    messageErreurEnvoi.value = 'Envoi impossible'
  } finally {
    envoiEnCours.value = false
  }
}
</script>

<template>
  <section>
    <p><RouterLink :to="{ name: 'accueil' }">Retour à l'accueil</RouterLink></p>

    <p v-if="chargement">Chargement...</p>

    <template v-else-if="sortie">
      <h2>{{ sortie.ville }}</h2>
      <p>{{ sortie.date }}</p>
      <p>Région : {{ sortie.region }}</p>
      <p>{{ sortie.places }} places</p>

      <form @submit.prevent="soumettre" novalidate>
        <div>
          <label for="prenom">Prénom</label>
          <input
            id="prenom"
            v-model="prenom"
            type="text"
            :class="{ invalide: afficherErreur('prenom') && erreurPrenom }"
            @blur="touche.prenom = true"
          />
          <p v-if="afficherErreur('prenom') && erreurPrenom" class="erreur">
            {{ erreurPrenom }}
          </p>
        </div>

        <div>
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            :class="{ invalide: afficherErreur('email') && erreurEmail }"
            @blur="touche.email = true"
          />
          <p v-if="afficherErreur('email') && erreurEmail" class="erreur">
            {{ erreurEmail }}
          </p>
        </div>

        <div>
          <label for="age">Âge</label>
          <input
            id="age"
            v-model="age"
            type="number"
            :class="{ invalide: afficherErreur('age') && erreurAge }"
            @blur="touche.age = true"
          />
          <p v-if="afficherErreur('age') && erreurAge" class="erreur">
            {{ erreurAge }}
          </p>
        </div>

        <div>
          <label>
            <input
              v-model="reglement"
              type="checkbox"
              :class="{ invalide: afficherErreur('reglement') && erreurReglement }"
              @change="touche.reglement = true"
            />
            J'accepte le règlement
          </label>
          <p v-if="afficherErreur('reglement') && erreurReglement" class="erreur">
            {{ erreurReglement }}
          </p>
        </div>

        <button type="submit" :disabled="envoiEnCours">
          {{ envoiEnCours ? 'Envoi...' : "S'inscrire" }}
        </button>
      </form>

      <p v-if="messageErreurEnvoi" class="erreur">{{ messageErreurEnvoi }}</p>
      <p v-if="messageConfirmation" class="confirmation">{{ messageConfirmation }}</p>
    </template>

    <p v-else>Sortie introuvable</p>
  </section>
</template>

<style scoped>
.invalide {
  border: 2px solid crimson;
}

.erreur {
  color: crimson;
  font-size: 0.9rem;
}

.confirmation {
  color: green;
  font-weight: bold;
}
</style>