<template>
  <div>
    <h1 class="header">Past Puzzles</h1>
    <ol v-if="pastPuzzles" class="flex flex-wrap">  
      <li v-for="{puzzle_number, puzzle_data, puzzle_score, id } in pastPuzzles" :key="puzzle_number">
        <div class="col">
          <h2 class="puzzlePostedH2">#{{puzzle_number}} </h2>
          <h3 v-if="puzzle_score" class="puzzle-data-preview">Score: {{puzzle_score}}</h3>
          <div v-if="puzzle_data">
            <div v-for="row, index in puzzle_data.split('\n')" class="puzzle-data-preview" :key="index">
              {{row}}
            </div>
          </div>
        </div>
      </li>
    </ol>
  </div>
  
</template>

<script>
import { supabase } from "../supabase"
import { store } from "../store"
import { computed, onMounted, ref, reactive } from "vue"
import Avatar from "./Avatar.vue"

export default {
  name: "PastPuzzles",
  components: {
    Avatar,
  },
  data() {
    return {
      puzzleInput: "",
      loading: false
    }
  },
  setup() {
    const pastPuzzles = ref([])

    async function getUserId() {
      try {
        store.user = supabase.auth.user()

        if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
      }
    }

    async function getPuzzles() {
      try {
        let { data, error } = await supabase.from("puzzles")
          .select('created_at, puzzle_number, user, puzzle_data, puzzle_score')
          .eq('user', store.user.id)
          .order('puzzle_number', { ascending: false })

          pastPuzzles.value = data
        if (error) throw error
      } catch (error) {
        alert(error.message)
      } finally {
      }
    }

    onMounted(() => {
      getPuzzles()
    })

    return {
      store,
      pastPuzzles,

      getUserId,
    }
  },
  methods: {
    puzzleDataSplit(data){
      return data.split("\n")
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

  .col {
    display: flex;
    flex-direction: column;
    width: 100%;
    @media (min-width: 650px) {
      width: auto;
    }
    margin-right: 1rem;
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

  .flex-wrap {
    flex-wrap: wrap;
  }

  li::marker {
    // TODO Hide this and make it less ugly. 
  }
</style>