<style lang="less">
@import '~@/style/var';
.login-wrap{
  background: #fff;
  width: 100vw;
  height: 100vh;
  .title-container {
    padding-top: 5vh;
    text-align: center;
    .login-logo {
      width: 128px;
      height: 128px;
      margin-bottom: 20px;
    }
    .title {
      text-align: center;
      font-size: 38px;
      font-weight: bold;
    }
  }
  .login-form {
    padding: 20px 40px;
    .form-input {
      height: 145px;
      border-bottom: 1px solid #d8d8d8;
    }
    .login-btn {
      display: block;
      width: 100%;
      height: 96px;
      line-height: 96px;
      background: #f6f6f6;
      color: #ddd;
      border-radius: 48px;
      margin-top: 60px;
      &.active{
        background: @primary;
        color: #fff;
      }
    }
  }
  .login-footer {
    width: 100%;
    font-size: @small;
    color: #666;
    position: fixed;
    bottom: 50px;
    justify-content: center;
  }
  .text-primary {
    color: @primary;
  }
}
</style>
<template>
  <view class="login-wrap">
    <view class="title-container">
      <image
        :src="pngLogo"
        class="login-logo"
      />
    </view>
    <view class="login-form">
      <input
        v-model="form.phone"
        class="form-input"
        placeholder="请输入手机号码"
        type="number"
        maxlength="11"
      >
      <input
        v-model="form.pwd"
        class="form-input"
        placeholder="请输入密码"
        type="password"
      >
      <button
        class="login-btn"
        :class="{active: !isDisabled}"
        @tap="handleLogin"
      >
        登录
      </button>
    </view>
    <view class="flex login-footer">
      登录代表您已同意
      <view
        class="text-primary"
        @tap="handleAgreement('agreement')"
      >
        掌厨用户协议、
      </view>
      <view
        class="text-primary"
        @tap="handleAgreement('policy')"
      >
        隐私政策
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import pngLogo from '@/assets/logo.png';
import HOST from '@/api/api.config';
import Taro from '@tarojs/taro';
import { login } from '@/api';
import { Action } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'PwdLogin',
  onLoad (options) {

  }
})

export default class extends Vue {
  @Action('store/refresh') private refresh!: Function
  private pngLogo = pngLogo;
  private form = {
    type: 'pwd',
    phone: ''
  };
  private disabled = false;

  get isDisabled () {
    let { phone, pwd } = this.form;
    return !phone || !pwd;
  }
  private valid () {
    const { phone, pwd } = this.form;
    if (!/^\d{8,15}$/.test(phone) && (!/^\d{8,15}@\d{8,15}$/.test(phone))) {
      Taro.showToast({
        icon: 'none',
        title: '请输入正确的手机号码'
      });
      return false;
    }
    if (pwd.length < 6) {
      Taro.showToast({
        icon: 'none',
        title: '密码不能小于6位'
      });
      return false;
    }
    return true;
  }
  private handleLogin () {
    if (this.isDisabled || !this.valid()) return;
    this.disabled = true;
    Taro.showLoading({ title: '登录中' });
    login(this.form).then(async ({ token }) => {
      Taro.setStorageSync('token', token);
      await this.refresh(true);
      Taro.switchTab({
        url: '/pages/person/index'
      });
    }).catch(() => {
      Taro.hideLoading();
    });
  }
  private handleAgreement (v: string) {
    let urls = `${HOST}/#/login/privacyPolicy`;
    if (v === 'agreement') {
      urls = `${HOST}/#/login/agreement`;
    }
    Taro.navigateTo({
      url: `/pages/webview/index?src=${urls}`
    });
  }
}
</script>
