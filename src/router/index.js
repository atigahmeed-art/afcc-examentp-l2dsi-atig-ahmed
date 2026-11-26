import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/AccueilView.vue'
import SortieDetailView from '../views/SortieDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: AccueilView,
    },
    {
      path: '/sorties/:id',
      name: 'sortie',
      component: SortieDetailView,
    },
    {
      path: '/sud',
      name: 'sud',
      redirect: { name: 'sortie', params: { id: '4' } },
    },
  ],
})

export default router