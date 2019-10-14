<template>
  <div class=""></div>
</template>

<script>
export default {
  props: {
    set: String
  },
  setup(props, ctx) {
    console.log('--setup--')
    console.log(props)
    console.log(ctx)
  },
  beforeCreate() {
    console.log('--beforecreate--')
  },
  created() {
    console.log('--created--')
  }
}
</script>

<style lang="scss" scoped></style>
