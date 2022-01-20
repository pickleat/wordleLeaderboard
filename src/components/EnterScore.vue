<template>
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
        <!-- :value="loading ? 'Loading ...' : 'Submit'"
        :disabled="loading" -->
      <input
        type="submit"
        class="button block primary"
        @click="postPuzzle"
      />
    </div>
  </form>

  
</template>

<script>
import { supabase } from "../supabase"
import { store } from "../store"
import { computed, onMounted, ref } from "vue"
import Avatar from "./Avatar.vue"

export default {
  components: {
    Avatar,
  },
  data() {
    return {
      puzzleInput: "",
    }
  },
  setup() {

    async function getUserId() {
      try {
        store.user = supabase.auth.user()

        if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
      }
    }

    return {
      store,

      getUserId,
    }
  },
  methods: {
    async postPuzzle() {

      // TODO add back loading state
      // TODO check if they have already posted a puzzle for this day and render a come back tomorrow otherwise?
      const updates = {
        user: store.user.id,
        puzzle_data: this.puzzleData,
        puzzle_score: this.puzzleScore,
        puzzle_number: this.puzzleNumber,
        created_at: new Date(),
      }

      // TODO Check if user has already submitted this puzzleNumber.

      let { error, data } = await supabase.from("puzzles").insert([updates])
    }
  },
  computed: {
    // TODO make these more dynamic / fail better (if someone adds more text or something)
    puzzleNumber(){
      return this.puzzleInput.slice(7, 10)
    },
    puzzleScore(){
      return this.puzzleInput.slice(11, 14)
    },
    puzzleRows() {
      return this.puzzleInput.slice(16).split("\n")
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

  .col {
    display: flex;
    flex-direction: column;
    width: 100%;
    @media (min-width: 650px) {
      width: 48%;
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
</style>