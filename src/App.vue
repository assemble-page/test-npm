<template>
  <div
    class="test"
    :class="{
      'test__left': align === 'left',
      'test__center': align === 'center',
      'test__right': align === 'right'
    }"
  >
    <div class="test__button">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '按钮文案'
    },
    align: {
      type: String,
      default: 'right'
    }
  }
}
</script>

<style lang="stylus">
.test
  display flex
  &__left
    justify-content flex-start
  &__center
    justify-content center
  &__right
    justify-content flex-end
  &__button
    display flex
    justify-content center
    align-items center
    width 100px
    height 40px
    background-color aquamarine
    border-radius 3px
    color #fff
    font-size 14px
</style>
