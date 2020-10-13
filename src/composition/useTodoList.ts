import { reactive, computed } from 'vue'

function useTodoList () {
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
}

export default useTodoList