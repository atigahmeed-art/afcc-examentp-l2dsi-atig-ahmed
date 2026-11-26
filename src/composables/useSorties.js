import { ref } from 'vue'
import { charger as chargerApi } from '../services/api'

const sorties = ref([])
const chargement = ref(false)
const erreurChargement = ref('')

export function useSorties() {
  async function charger() {
    chargement.value = true
    erreurChargement.value = ''
    try {
      const data = await chargerApi()
      sorties.value = data
    } catch {
      erreurChargement.value = 'Impossible de charger les sorties.'
    } finally {
      chargement.value = false
    }
  }

  return {
    sorties,
    chargement,
    erreurChargement,
    charger,
  }
}