import { createRouter, createWebHistory } from 'vue-router'

// Both pages are lazy so each only loads its own stylesheet:
// the house (Home) and the sketch-kit admin don't share CSS.
const routes = [
  { path: '/', name: 'home', component: () => import('../views/Home.vue') },
  { path: '/admin', name: 'admin', component: () => import('../views/Admin.vue') },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
