<style lang="less">
@import '~@/style/var';
.img-box {
  width: 120px;
  height: 120px;
  margin-right: 15px;
  border-radius: 10px;
}
</style>
<template>
  <image
    :src="imgSrc"
    class="img-box"
  />
</template>
<script>
import { qiniu } from '@/filter/filters';
import png404 from '@/assets/404.png';
export default {
  name: 'ImageBox',
  props: {
    src: {
      type: String,
      default: ''
    },
    query: {
      type: String,
      default: 'imageView2/1/w/120'
    }
  },
  computed: {
    imgSrc () {
      if (!this.src) return png404;
      return qiniu(this.src, this.query);
    }
  }
}
</script>
