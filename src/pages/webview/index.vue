<style>
</style>
<template>
  <view>
    <web-view :src="imgSrc" />
  </view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getCurrentInstance } from '@tarojs/runtime';

@Component({
  name: 'Webview'
})

export default class extends Vue {
  private imgSrc: string = '';
  created () {
    const { src } = getCurrentInstance().router.params;
    this.imgSrc = src;
  }
};
</script>

