<template>
  <div>
    <input type="text" v-model="state.val" @keyup.enter="addTodo">
    <ul>
      <li v-for="todo in state.todos" :key="todo">{{ todo.name }}</li>
    </ul>
    <div>
      total: {{ total }}
    </div>

    <p>{{ x }} {{ y }}</p>
  </div>
</template>

<script>
  import useTodoList from '../../composition/useTodoList'
  import useSlipBy from '../../composition/useSlipBy'
  export default {
    setup () {
      const { state, total, addTodo } = useTodoList()
      const { x, y } = useSlipBy()

      return { state, total, addTodo, x, y }
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