<template>
  <div class="container" style="padding: 2rem 0 2rem 0">
    <EnterScore v-if="store.user" />
    <PastPuzzles v-if="store.user" />
    <!-- <Streak  v-if="store.user" /> -->
    <Auth v-else />
  </div>
</template>

<script>
import { store } from "../store"
import { supabase } from "../supabase"
import { onMounted } from "vue"
import Auth from "../components/Auth.vue"
import EnterScore from "../components/EnterScore.vue"
import PastPuzzles from "../components/PastPuzzles.vue"
import Streak from "../components/Streak.vue"
export default {
  name: "Home",
  components: {
    EnterScore,
    PastPuzzles,
    Auth,
    Streak,
  },

  setup() {
    store.user = supabase.auth.user()
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user
    })

    async function checkForProfile() {
      if(store.user.id){
        try {
          let { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', store.user.id)
          .single()

        if ( error ) throw error
        } catch ( error ) {
          console.error(error)
        }
      } 
      else {
        createUsername()
      }
    }

    async function createUsername() {
      try {
        const email = store.user.email
        let username = email.substring(0, email.indexOf('@'))
        const updates = {
          id: store.user.id,
          username,
          updated_at: new Date(),
        }
         let { error } = await supabase.from("profiles").upsert(updates, {
          returning: "minimal", // Don't return the value after inserting
        })
        if(error) throw error
      } catch (error) {
        console.error(error)
      } finally {

      }
    }

    onMounted(() => {
      checkForProfile()
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