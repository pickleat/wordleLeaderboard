<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <h1>Leaderboard</h1>
    <p>Coming Soon! But for now, check out your streak!</p>
    <Streak />
  </div>
</template>

<script>
import { store } from "../store"
import { supabase } from "../supabase"
import Auth from "../components/Auth.vue"
import Profile from "../components/Profile.vue"
import Streak from "../components/Streak.vue"
export default {
  components: {
    Auth,
    Profile,
    Streak
  },

  setup() {
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
