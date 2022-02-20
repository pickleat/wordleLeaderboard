<template>

  <h3>Streaks!</h3>
  <div class="row">
    <div class="streak-box" v-if="currentStreak">
      <div class="streak-type">Current</div>
      <div class="streak-number">{{ currentStreak }}</div>
    </div>
    <div class="streak-box" v-if="allTime">
      <div class="streak-type">All Time</div>
      <div class="streak-number">{{ allTime }}</div>
    </div>
    <p v-else>No Streaks Yet, post your first puzzle for one!</p>
  </div>
</template>

<script>
import { onMounted, ref } from "vue"
import { supabase } from "../supabase"
import { store } from "../store"


export default {
  name: "Streak",
  setup() {
    const currentStreak = ref(Number(null))
    const allTime = ref(Number(null))
    const puzzles = ref(Array)
    const lastPuzzle = ref(Number(null))

    async function getUserId() {
      try {
        store.user = supabase.auth.user()

      if (error) throw error
      } catch (error) {
        alert(error.message)
      }
    }

    async function setupStreaks() {
      try {
        let { data, error } = await supabase.from('puzzles')
        .select('puzzle_number')
        .eq('user', store.user.id)
        .order('puzzle_number', { ascending: false})

        if( data ) {
          const puzzleNumbers = data.map(puzzle => parseInt(puzzle.puzzle_number))
          puzzles.value = [...puzzleNumbers]
        }
        if ( error ) throw error
        } catch (error) {
          console.error(error)
        } finally {
          await getAllTimeHigh()
          await getCurrentStreak()
          await postStreak()
        }
    }

    async function shouldUpsert(){
      try {
        let { data, error } = await supabase.from('streaks')
          .select('*')
          .eq('user', store.user.id)
          .limit(1)
        if ( data ) {
          return data[0].id
        }
        if( error ) throw error 
      } catch ( error ) {
        console.error(error)
        return undefined
      }
    }

    async function postStreak() {
      const updates = {
        user: store.user.id,
        current_streak: currentStreak.value, 
        all_time_high: allTime.value,
        last_puzzle: puzzles.value[0],
      }
      const getMonth = (date) => {
        const month = date.getUTCMonth()
        if(month < 10){
          return `0${month+1}`
        }
        else return month + 1
      }
      const buildDate = () => {
        const date = new Date()
        const year = date.getFullYear()
        const month = getMonth(date)
        const day = date.getUTCDate()
        const hours = date.getUTCHours()
        const minutes = date.getUTCMinutes()
        const seconds = '000+00:00'
        const timestampz = `${year}-${month}-${day}T${hours}:${minutes}.${seconds}`
        return timestampz
      }
      updates.updated_at = buildDate();

      const canUpsert = await shouldUpsert()
      if( canUpsert ) {
        updates.id = canUpsert
        try {
          let { data, error } = await supabase.from('streaks').upsert([updates])
          if ( error ) throw error
        } catch (error) {
              console.error(error)
        } 

      } else {
        try {
          let { data, error } = await supabase.from('streaks').insert([updates])
          if ( error ) throw error
        } catch (error) {
            console.error(error)
        } 
      }

    }

      async function getStreaks(){
        try {
          let { data, error } = await supabase.from('streaks')
            .select("all_time_high, current_streak")
            .eq('user', store.user.id)
            .limit(1)
          if(data.length !== 1){
            setupStreaks()
          }  
          if (data && data.length === 1 && data[0]?.current_streak && data[0]?.all_time_high ) {
            currentStreak.value = data[0].current_streak
            allTime.value = data[0].all_time_high
          }


          if (error) throw error
        } catch (error) {
          console.error(error.message)
        }
      }



    async function getCurrentStreak() {
      if(puzzles){
        const puzzleNumbers = [...puzzles.value]        
        let currentHigh = 1

        for(let i = 1; i < puzzleNumbers.length; i++){
          if(puzzleNumbers[i - 1] - puzzleNumbers[i] === 1){
            currentHigh += 1
          } else { 
            i = puzzleNumbers.length
          }
        }
        currentStreak.value = currentHigh
      }

    }

    async function getAllTimeHigh() {
      if(puzzles){
        // const puzzleNumbers = puzzles._rawValue.map(puzzle => parseInt(puzzle.puzzle_number))
        // const puzzleNumbers = [25, 24, 19, 18, 17, 16, 15, 13, 12, 11, 9, 8, 7, 6, 4, 3, 2, 1]
        // puzzles.value = [...puzzleNumbers]
        const puzzleNumbers = [...puzzles.value]
        let max = 0;
        let currentHigh = 1
        puzzleNumbers.map((currPuzzle, index) => {
          const prevPuzzle = puzzleNumbers[index - 1]
          if(prevPuzzle - currPuzzle === 1){
            currentHigh += 1
          } else {
            currentHigh = 1
          }

          if(max < currentHigh){
            max = currentHigh
          }
        })

        allTime.value = max
      }
    }

    onMounted( () => {
      // todo once streaks is more secure and updated easier in its own table... 
      // todo we can switch this to simply fetch streak data
      // getStreaks()
      setupStreaks()
    })
    return {
      currentStreak,
      allTime,
      puzzles
    }
  },
}
</script>

<style lang="scss" scoped>
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    @media (min-width: 769px) {
      justify-content: start;
    }
    &::after {
      display: none;
    }
  }
  h3 {
    text-align: center;
    font-size: 2rem;
     @media (min-width: 769px) {
      width: 22rem;
    }
  }
  .streak-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: solid white 4px;
    border-radius: 1rem;
    padding: 1rem;
    width: 10rem;
    height: 10rem;
    text-align: center;
    @media (min-width: 769px) {
      margin-right: 2rem;
    }

    .streak-type, .streak-number {
      font-weight: 800;
    }
    .streak-type {
      font-size: 1.5rem;
      color: var(--custom-color-brand);
    }
    .streak-number {
      font-size: 4rem;
    }
  }

</style>