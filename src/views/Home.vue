<template>
  <div class="container" style="padding: 2rem 0 2rem 0">
    <h1 class="header">{{ store.user ? "Add your puzzle solution." : "The Leaderboard for Wordle Nerds!"}}</h1>
    <p class="instructions" v-if="store.user">
      Click share (and copy on mobile) then paste below.
    </p>
    <EnterScore v-if="store.user" />
    <Auth v-else />
  </div>
</template>

<script>
import { store } from "../store"
import { supabase } from "../supabase"
import Auth from "../components/Auth.vue"
import EnterScore from "../components/EnterScore.vue"
export default {
  name: "Home",
  components: {
    Auth,
    EnterScore,
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

<style lang="scss" scoped>
  .header {
    text-align: center;
  }

  .instructions {
    text-align: center;
  }
</style>