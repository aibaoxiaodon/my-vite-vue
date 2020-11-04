<template>
  <div>
    <p>{{ count }}</p>
    <button @click="add">click</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  data () {
    return {
      count: 1
    }
  },
  methods: {
    add () {
      this.count++
    }
  },
  name: 'App'
}
</script>
