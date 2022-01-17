<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <h1>Not Found</h1>
    <p>Sorry the page you are looking for: "{{ $route.path }}". Cannot be found.</p>
    <router-link to="/">Home</router-link> | <router-link to="/profile">Profile</router-link>
  </div>
</template>

<script>
import { store } from "../store"
import { supabase } from "../supabase"
import Auth from "../components/Auth.vue"

export default {
  name: 'NotFound',
}
</script>
