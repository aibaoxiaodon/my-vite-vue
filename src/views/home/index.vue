<template>
  <div>
    <input type="text" v-model="state.val" @keyup.enter="addTodo">
    <ul>
      <li v-for="todo in state.todos" :key="todo">{{ todo.name }}</li>
    </ul>
    <div>
      total: {{ total }}
    </div>
  </div>
</template>

<script>
  import { ref, reactive, computed } from 'vue'
  export default {
    setup () {
      let state = reactive({
        todos: [ { name: '学习', done: false }, { name: '上班', done: false }],
        val: ''
      })

      let total = computed(() => state.todos.length)

      function addTodo () {
        state.todos.push({
          done: false,
          name: state.val
        })
        state.val = ''
      }

      return { state, total, addTodo }
    },
    name: 'Home'
  }
</script>

<style lang="scss" scoped>
  .hxd_home {
    width: 100%;
    height: 100%;
  }
</style>