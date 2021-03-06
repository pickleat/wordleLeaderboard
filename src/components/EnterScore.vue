<template>
  <div v-if="canPost">
    <h1 class="header">{{ store.user ? "Add your puzzle solution." : "The Leaderboard for Wordle Nerds!"}}</h1>
    <p class="instructions" v-if="store.user">
      Click share (and "copy" on mobile) then paste below.
    </p>
    <form class="form-widget" @submit.prevent="updateProfile">
      <div class="col">
        <label for="puzzleScore">Insert Your Daily Puzzle</label>
        <textarea id="puzzleScore" name="puzzleScore" rows="10" cols="33" v-model="puzzleInput" />
      </div>
      <div class="col">
        <h2>Puzzle Submission Preview</h2>
        <h3 v-if="puzzleNumber">Puzzle Number: {{puzzleNumber}}</h3>
        <h4 v-if="puzzleScore" class="puzzle-data-preview">Score: {{puzzleScore}}</h4>
        <div v-if="puzzleRows">
          <div v-for="row, index in puzzleRows" class="puzzle-data-preview" :key="index">
            {{row}}
          </div>
        </div>
      </div>
      <div class="submit">
        <input
          type="submit"
          class="button block primary"
          @click="postPuzzle"
          :value="loading ? 'Loading ...' : 'Submit'"
          :disabled="loading"
        />
      </div>
    </form>
  </div>
  <div v-else>
    <h1 class="header">Puzzle Posted!</h1>
    <p class="instructions">You've posted your puzzle for the day, check out the <router-link to='leaderboard'>Leaderboard</router-link>
    or come back tomorrow to post your next puzzle.</p>
    <div class='row'>
      <div class="col">
        <h2 class="puzzlePostedH2">Today's Puzzle #{{puzzleNumber}} </h2>
        <div v-if="postedPuzzleRows">
        <h3 v-if="puzzleScore" class="puzzle-data-preview">Score: {{puzzleScore}}</h3>
          <div v-for="row, index in postedPuzzleRows" class="puzzle-data-preview" :key="index">
            {{row}}
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import { supabase } from "../supabase"
import { store } from "../store"
import { computed, onMounted, ref, reactive } from "vue"
import Avatar from "./Avatar.vue"
import Streak from "./Streak.vue"

export default {
  name: "EnterScore",
  components: {
    Avatar,
    Streak,
  },
  data() {
    return {
      puzzleInput: "",
      loading: false
    }
  },
  setup() {
    const canPost = ref(Boolean)
    const postedPuzzleData = ref("")

    async function getUserId() {
      try {
        store.user = supabase.auth.user()

        if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
      }
    }

    async function getPuzzleForToday() {
      try {
        let { data, error } = await supabase.from("puzzles")
          .select('created_at, puzzle_number, user, puzzle_data, puzzle_score')
          .eq('user', store.user.id)
          .order('created_at', { ascending: false })
          .limit(1)

          const newDate = new Date(Date.now())
          const monthPlusOne = (newDate.getMonth() + 1).toString()
          const monthPadStart = monthPlusOne < 10 ? monthPlusOne.padStart(2, '0') : monthPlusOne
          const day = newDate.getDate().toString()
          const dayPadStart = day < 10 ? day.padStart(2, '0') : day
          const date = `${newDate.getFullYear()}-${monthPadStart}-${dayPadStart}`
        if(data[0]?.created_at.slice(0, 10) === date){
          canPost.value = false
          postedPuzzleData.value = data[0]
        }
        if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
      }
    }

    onMounted(() => {
      getPuzzleForToday()
    })

    return {
      store,
      canPost,
      postedPuzzleData,

      getUserId,
    }
  },
  methods: {
    async postPuzzle() {
      this.loading = true
      const updates = {
        user: store.user.id,
        puzzle_data: this.puzzleData,
        puzzle_score: this.puzzleScore,
        puzzle_number: this.puzzleNumber,
        created_at: new Date(),
      }

      try {
        let { error, data } = await supabase.from("puzzles").insert([updates])

        this.canPost = false
        if (error) throw error
      } catch {
        console.error(error)
        this.canPost = true
        
      }finally {
        this.loading = false
        // todo uncomment to test
        // this.updateStreaks()
      }
    },
    async updateStreaks() {
      // this function isn't being called yet
      try {
        let { data, error } = await supabase.from('streaks')
          .select('last_puzzle, id, current_streak, all_time_high')
          .eq('user', store.user.id)
          .limit(1)

          let { last_puzzle, id, current_streak, all_time_high } = data[0]
          const rowId = id

          console.log(data[0])
          let updates = {
            last_puzzle: this.puzzleNumber,
          }
          // Update Current Streak
          if(this.puzzleNumber - 1 === parseInt(last_puzzle)){
            updates.current_streak = (current_streak + 1)
          }
          if (this.puzzleNumber - 1 !== parseInt(last_puzzle)) {
            updates.current_streak = 1
          }

        if (error) throw error
      } catch (error) {
        console.error(error.message)
      } finally {
      }
    }
  },
  computed: {
    // TODO make these more dynamic / fail better (if someone adds more text or something)
    puzzleNumber(){
      return this.puzzleInput ? this.puzzleInput.slice(7, 10) : this.postedPuzzleData.puzzle_number
    },
    puzzleScore(){
      return this.puzzleInput ? this.puzzleInput.slice(11, 14) : this.postedPuzzleData.puzzle_score
    },
    puzzleRows() {
      return this.puzzleInput ? this.puzzleInput.slice(16).split("\n") : null
    },
    postedPuzzleRows() {
      return this.postedPuzzleData ? this.postedPuzzleData.puzzle_data.split("\n") : null;
    },
    puzzleData() {
      return this.puzzleInput.slice(16) 
    },
  }
}
</script>

<style lang="scss" scoped>
  .form-widget{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  #puzzleScore {
      background-color: var(--custom-bg-color);
    color: var(--custom-color);
  }

  .row {
    display: flex;
    flex-direction: column;
    @media (min-width: 650px) {
      flex-direction: row;
      flex-wrap: wrap;
    }

  }
  .col {
    display: flex;
    flex-direction: column;
    width: 100%;
    @media (min-width: 650px) {
      width: auto;
    }
  }
  .puzzle-data-preview {
    width: auto;
    line-height: 1.1rem;
  }

  .button {
    width: auto;
    color: var(--custom-color)
  }

  .submit {
    width: 100%;
  }

  .puzzlePostedH2 {
    margin-bottom: 0;
  }
</style>