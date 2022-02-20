<template>
  <div class="container" style="padding: 2rem 0 2rem 0">
    <Auth />
  </div>
</template>

<script>
import { store } from "../store"
import { supabase } from "../supabase"
import { useRouter } from 'vue-router'
import Auth from "../components/Auth.vue"
export default {
  name: "Home",
  components: {
    Auth
  },

  setup() {
    store.user = supabase.auth.user()
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user
    })

    if(store.user){
      const router = useRouter()
      router.push('/')
    }

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