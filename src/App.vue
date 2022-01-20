<template>
  <Navbar />
   <div id="app-content">
    <router-view />
  </div>
</template>

<script>
import { store } from "./store"
import { supabase } from "./supabase"
import { useRouter, useRoute } from 'vue-router'
import Navbar from "./components/Navbar.vue"
import Auth from "./components/Auth.vue"
import Profile from "./components/Profile.vue"
export default {
  components: {
    Navbar,
    Auth,
    Profile,
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    store.user = supabase.auth.user()
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user
    })

    return {
      store,
    }
  },
}
</script>
