<template>
  <h1>{{ title }}, 第一个vue3的项目</h1>
  <router-link to="/">hxd1</router-link>
  <router-link to="/hxd">hxd2</router-link>
  <router-view />
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const title = ref('Hello, word')
    return {
      title
    }
  },
  name: 'App'
}
</script>
