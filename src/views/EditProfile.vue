<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <h1>Edit Profile</h1>
    <div class="row">
      <router-link class="view-profile-link" :to="username">View Profile</router-link>
      <SignOut />
    </div>
    <Profile />
  </div>
</template>

<script>
import { store } from "../store"
import { supabase } from "../supabase"
import { onMounted, ref } from "vue"
import Auth from "../components/Auth.vue"
import Profile from "../components/Profile.vue"
import SignOut from "../components/SignOut.vue"
export default {
  components: {
    Auth,
    Profile,
    SignOut,
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

<style lang="scss" scoped>
  .row {
    display: flex;
    align-items: center;
    padding: 1rem 0;

    .view-profile-link {
      // margin-right: 1rem;
      padding: .5rem 1rem .5rem 0;
      text-transform: uppercase;
      font-size: 14px;
      &:hover {
        text-decoration: underline;
        text-decoration-color: var(--custom-color-brand);
      }
    }
  }

</style>
