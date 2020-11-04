<template>
  <div id="container"></div>
</template>

<script>
import useMap from './useMap'

export default {
  setup() {
    useMap()
  },
  name: 'Amap',
}
</script>

<style lang="scss" scoped>
  #container {
    width: 100%;
    height: 100%;
  }
</style>

<style lang="scss">
  img {
    width: 25px;
    height: 25px;
  }
</style>
