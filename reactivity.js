const { ref, effect } = require('@vue/reactivity')
const count = ref(0)

effect(() => {
    console.log('count: ', count.value);
})


setInterval(() => {
    count.value++
}, 1000)