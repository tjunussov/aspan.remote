<template lang="pug">
.hello
  h1 
  h2 Bar content
</template>

<script>
export default {
  name: 'Bar',
  data () {
    return {
      msg: 'Bar'
    }
  }
}
</script>

<style scoped lang="stylus">
h1, h2
    font-weight normal

</style>
