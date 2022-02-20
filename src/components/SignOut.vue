<template>
   <button class="button" @click="signOut" :disabled="loading">
      Sign Out
    </button> 
</template>

<script>
export default {
  setup() {
    async function signOut() {
      try {
        loading.value = true
        let { error } = await supabase.auth.signOut()
        if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      signOut
    }
  },
}
</script>