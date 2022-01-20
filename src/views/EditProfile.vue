<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <h1>Edit Profile</h1>
    <router-link :to="username">View Profile</router-link>
    <Profile />
  </div>
</template>

<script>
import { store } from "../store"
import { supabase } from "../supabase"
import { onMounted, ref } from "vue"
import Auth from "../components/Auth.vue"
import Profile from "../components/Profile.vue"
export default {
  components: {
    Auth,
    Profile,
  },

  setup() {

    const username = ref("")

    store.user = supabase.auth.user()
    
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user
    })

    async function getUsername() {

      try {
        let { data, error, status } = await supabase
            .from("profiles")
            .select(`username`)
            .eq("id", store.user.id)
            .single()
            
        if (error && status !== 406) throw error

        if (data) {
          username.value = data.username
      } 
      } catch (error) {
        alert(error.message)
      } finally {
        console.log('finished getting the username')
      }
    }

    onMounted(() => {
      getUsername()
    })

    return {
      store,
      username,

      getUsername
    }
  },
}
</script>
