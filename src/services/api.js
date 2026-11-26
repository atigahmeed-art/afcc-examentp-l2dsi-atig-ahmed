const BASE_URL = 'http://localhost:3000'

export async function charger() {
  const r = await fetch(`${BASE_URL}/sorties`)
  if (!r.ok) {
    throw new Error('Erreur lors du chargement des sorties')
  }
  return await r.json()
}

export async function inscrire(payload) {
  const r = await fetch(`${BASE_URL}/inscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!r.ok) {
    throw new Error('Envoi impossible')
  }
  return await r.json()
}