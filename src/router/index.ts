import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard/Dashboard.vue'
import ShowDetails from '../pages/ShowDetails/ShowDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/show-details/:id', name: 'show-details', component: ShowDetails },
  ],
})

export default router
