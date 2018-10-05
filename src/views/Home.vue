<template>
  <div class="home">
    <!-- <img alt="eridien logo" src="../assets/logo.png"> -->
    <HelloWorld msg="Welcome to the P3 Control App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
