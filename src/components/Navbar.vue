<template>
  <nav class="nav">
    <router-link to="/">🏠</router-link>
    <router-link v-if="store.user" to="/edit-profile">
      <Avatar v-model:path="avatar_url" size="2rem"/>
    </router-link>
    <router-link v-else to="/">login/signup</router-link>
  </nav>
</template>

<script>
import { supabase } from "../supabase"
import { store } from "../store"
import Avatar from "./Avatar.vue"
import { onMounted, ref } from 'vue'

export default {
  name: "Navbar",
  components: {
    Avatar,
  },
  setup() {
    const loading = ref(true)
    const username = ref("")
    const website = ref("")
    const avatar_url = ref("")
    store.user = supabase.auth.user()

    async function loadAvatarUrl(){
      try {
        loading.value = true
        // store.user = supabase.auth.user()
         let { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", store.user.id)
          .single()

        if (error && status !== 406) throw error

        if (data) {
          username.value = data.username
          website.value = data.website
          avatar_url.value = data.avatar_url
        }
      } catch (error) {
        
        console.error(error.message)
      } finally {
        loading.value = false
      }
    }

    onMounted(
      () => {
        if(store.user){
          loadAvatarUrl()
        }
      }
    )

    return {
      store,
      loading,
      username,
      website,
      avatar_url,
    }
  }
}

</script>

<style lang="scss" scoped>

  .nav{
    display: flex;
    justify-content: space-between;
    max-width: 80rem;
    width: 100%;
    margin: 1rem auto;
    padding: 0 2rem;
  }

</style>
