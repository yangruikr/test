<style lang="less">
@import '~@/style/var';
.login-container {
  position: relative;
  margin-top: 16vh;
  .login-footer {
    width: 100%;
    font-size: @small;
    color: #666;
    position: fixed;
    bottom: 50px;
    justify-content: center;
  }
  .btn-group {
    padding: 40px;
  }
  .title-container {
    text-align: center;
    .title {
      text-align: center;
      font-size: 38px;
      font-weight: bold;
    }
  }
  .login-btn {
    width: 100%;
    background: @primary;
    color: #fff;
    padding: 20px 0;
    font-size: 30px;
  }
  .login-phone {
    background: transparent;
    color: #666;
  }
  .login-logo {
    width: 128px;
    height: 128px;
    margin-bottom: 20px;
  }
  .text-primary {
    color: @primary;
  }
  .flex {
    display: flex;
  }
}
</style>
<template>
  <view class="login-container">
    <view class="title-container">
      <image
        :src="pngLogo"
        class="login-logo"
      />
      <view class="title">
        掌厨网
      </view>
    </view>
    <view class="btn-group">
      <button
        class="login-btn accredit-btn"
        open-type="getPhoneNumber"
        @getphonenumber="handleLogin"
      >
        微信账号一键登录
      </button>
      <button
        class="login-btn login-phone"
        @tap="handleLoginByPhone"
      >
        使用账号密码登录
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
import Taro from '@tarojs/taro';
import { Common } from '@/util/common';
import { wxLogin } from '@/api/lib/wx';
import HOST from '@/api/api.config';
import { Action } from 'vuex-class';
import pngLogo from '@/assets/logo.png';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Login'
})

export default class extends Vue {
  @Action('store/refresh') private refresh!: Function
  private pngLogo = pngLogo;
  private handleLoginByPhone () {
    Taro.navigateTo({
      url: '/pages/login/pwdLogin'
    });
  }
  private async handleLogin (e) {
    const session = await Common.getSession();
    Taro.showLoading({ title: '加载中' });
    let { errMsg, encryptedData, iv } = e.detail || {};
    if (errMsg === 'getPhoneNumber:ok') {
      let data = {
        iv,
        encryptedData,
        sessionKey: session.session_key
      };
      wxLogin(data).then(async ({ token }) => {
        Taro.setStorageSync('token', token);
        await this.refresh(true);
        Taro.switchTab({
          url: '/pages/person/index'
        });
      }).catch(() => {
        Taro.removeStorageSync('SESSION');
      });
    }
    if (errMsg === 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '取消授权',
        icon: 'none',
        duration: 2000
      });
    }
    Taro.hideLoading();
  }
  private handleAgreement (v) {
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
