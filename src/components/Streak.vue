<template>
  <div class="col">
      <h2>Current Streak: {{ currentStreak }} </h2>
      <h2>All Time: {{ allTime }}</h2>
  </div>
</template>

<script>
import { onMounted, ref } from "vue"
import { supabase } from "../supabase"
import { store } from "../store"


export default {
  name: "Streak",
  setup() {
    const currentStreak = ref(Number)
    const allTime = ref(Number)

    async function getUserId() {
      try {
        store.user = supabase.auth.user()

      if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
        console.log('finally')
      }
    }

    async function getStreakData() {
      try {
        let { data, error } = await supabase.from('streaks')
          .select("all_time_high, current_streak")
          .eq('user', store.user.id)
          .limit(1)

        if (data && data.length === 1 && data[0]?.current_streak && data[0]?.all_time_high )
        currentStreak.value = data[0].current_streak
        allTime.value = data[0].all_time_high
        if (error) throw error
      } catch (error) {
        console.error(error.message)
      } finally {
      }
    }

    onMounted( () => {
      getStreakData()
    })
    return {
      currentStreak,
      allTime
    }
  },
}
</script>

<style lang="scss" scoped>

</style>