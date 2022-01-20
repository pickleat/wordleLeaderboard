<template>
  <div class="profile-card">
    <Avatar class="profile-avatar" size="8rem" :allowUpload="false" v-model:path="avatar_url"/>
    <div class="column">
      <h1>{{username}}</h1>
      <a :href="website">Website</a>
      <a :href="twitter_url">{{twitter}}</a>
    </div>
    
    <!-- <Profile /> -->
  </div>
</template>

<script>
import { store } from "../store"
import { supabase } from "../supabase"
import { computed, onMounted, ref } from "vue"
import { useRoute } from 'vue-router'
import Avatar from "../components/Avatar.vue"

export default {
  components: {
    Avatar
  },

   setup() {
    const route = useRoute()
    const id = route.params.id
    const loading = ref(true)
    const username = ref("")
    const website = ref("")
    const avatar_url = ref("")
    const twitter = ref("")
    const puzzles = ref([])

    async function getProfile() {
      try {
        loading.value = true
        store.user = supabase.auth.user()

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`username, website, avatar_url, twitter`)
          .eq("username", id)
          .single()

        if (error && status !== 406) throw error

        if (data) {
          username.value = data.username
          website.value = data.website
          avatar_url.value = data.avatar_url
          twitter.value = data.twitter
        }
      } catch (error) {
        alert(error.message)
      } finally {
        loading.value = false
      }
    }

    async function getPuzzles(){
      try {
        let { data, error, status } = await supabase
          .from("puzzles")
          .select(``)
      } catch (error) {
        // catch errs
      } finally {
        // finally do something
      }
    }

      onMounted(() => {
      getProfile()
    })

    return {
      store,
      loading,
      username,
      website,
      avatar_url,
      twitter
    }
  },
  computed: {
    twitter_url() {
      let twitter_url = `https://twitter.com/`
      if(this.twitter){

        if(this.twitter.indexOf(0) === "@"){
          return `https://twitter.com/${this.twitter.slice(1)}`
        } else if (this.twitter.startsWith("https://twitter.com/") || this.twitter.startsWith("http://twitter.com/" || this.twitter.startsWith("https://www.twitter.com/") || this.twitter.startsWith("http://www.twitter.com/"))){
          return this.twitter
        }
      }
      return twitter_url
    }
  }
}
</script>

<style lang="scss" scoped>
  .profile-card {
    display: flex;
    margin-left: 12rem;

    .profile-avatar {
      margin-right: 1rem;
    }
  }
  .column {
    display: flex;
    flex-direction: column;
    justify-content: start;

    h1 {
      margin: 0;
    }
  }
</style>