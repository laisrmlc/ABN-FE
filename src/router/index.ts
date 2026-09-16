import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard/Dashboard.vue'
import ShowDetails from '../pages/ShowDetails/ShowDetails.vue'
import NotFound from '../pages/NotFound/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: Dashboard },
    { path: '/show-details/:id', name: 'show-details', component: ShowDetails },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
  ],
})

export default router
