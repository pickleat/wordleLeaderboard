import { createApp } from "vue"
import { createRouter, createWebHistory } from 'vue-router'
import App from "./App.vue"

// Views
import Home from './views/Home.vue'
import Signin from './views/Signin.vue'
import Leaderboard from './views/Leaderboard.vue'
import EditProfile from './views/EditProfile.vue'
import PlayerProfile from './views/PlayerProfile.vue'
import NotFound from './views/404.vue'

import "./assets/main.css"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin
  },
  {
    path: '/edit-profile',
    name: 'EditProfile',
    component: EditProfile
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  },
  { 
    path: '/:id',
    name: 'PlayerProfile',
    component: PlayerProfile 
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound 
  },
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

createApp(App)
.use(router)
.mount("#app")
