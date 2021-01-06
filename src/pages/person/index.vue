<style lang="less">
  @import '~@/style/var';
  @import '~@/style/mixin';
  .person-container {
    .mt {
      margin-top: @space;
    }
    .person-header {
      height: 220px;
      width: 100%;
      background-image: url('./assets/person_bg.png');
      background-size: 100%;
      background-repeat: no-repeat;
    }
    .header-wrap {
      padding: 30px 40px 0;
      align-items: center;
      .avatar {
        width: 112px;
        height: 112px;
        margin-right: 30px;
      }
      .users {
        font-size: @normal;
        color: #fff;
      }
      .register {
        font-weight: bold;
        font-size: 40px;
        margin-bottom: 15px;
      }
    }
    .padd-wrap {
      margin: @space @space 0;
      border-radius: @boRadius;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);
    }
    .store-account {
      background: #fff;
      padding: 30px 0;
      text-align: center;
      align-items: center;
      .account-info {
        flex: 1;
        height: 80px;
        border-right: 1px solid #f0f0f0;
        &:last-child {
          border-right: none;
        }
      }
      .account-num {
        color: @color;
        font-size: 32px;
        font-weight: bold;
      }
      .account-title {
        margin-top: 13px;
        font-size: @small;
        color: #666;
      }
      .account-quota {
        color: #666;
      }
    }
    .store-wrap {
      background: #fff;
      padding: 20px;
      margin: -45px 20px 20px;
      border-radius: @boRadius;
      .name {
        font-size: 32px;
        color: #222;
      }
      .address {
        font-size: @small;
        color: #666;
        margin-top: 15px;
      }
    }
    .flex {
      display: flex;
    }
    .h-22 {
      height: 220px;
    }
    .h-17 {
      height: 170px;
    }
    .login-out {
      position: fixed;
      bottom: 50px;
      left: 0;
      right: 0;
      margin: @space @space 0;
      border-radius: @boRadius;
    }
    .login-out-btn {
      background: #fff;
      width: 100%;
      padding: 20px 0;
      font-size: 26px;
      .text-mixin(@primary);
    }
  }
</style>
<template>
  <view class="person-container">
    <view
      class="person-header"
      :class="token ? 'h-22' : 'h-17'"
    >
      <view class="header-wrap flex">
        <slot v-if="!token">
          <image
            :src="pngUnRegistered"
            class="avatar"
            @tap="handleLogin"
          />
          <view
            class="users"
            @tap="handleLogin"
          >
            <view class="register">
              登录/注册
            </view>
            <view class="msg">
              登录后即可查看更多优惠信息~
            </view>
          </view>
        </slot>
        <slot v-if="token">
          <image
            :src="pngHeadImg"
            class="avatar"
          />
          <view
            class="users"
          >
            <view class="register">
              {{ user.name }}
            </view>
            <view class="msg">
              {{ phoneNum }}
            </view>
          </view>
        </slot>
      </view>
    </view>
    <view
      v-if="token"
      class="store-wrap padd-wrap"
    >
      <view class="name text-overflow">
        {{ data.store.name }}
      </view>
      <view class="address text-overflow">
        {{ data.store.address }}
      </view>
    </view>
    <view class="store-account padd-wrap flex">
      <view class="account-info">
        <view
          v-if="!token"
          class="account-num"
        >
          ---
        </view>
        <view
          v-if="token"
          class="account-num"
        >
          {{ (data.account.balance - data.account.occupy_money ) || 0 | money }}
        </view>
        <view class="account-title">
          可用余额
        </view>
      </view>
      <view class="account-info">
        <view
          v-if="!token"
          class="account-num"
        >
          ---
        </view>
        <view
          v-if="token"
          class="account-num"
        >
          {{ data.coupons || 0 }}
        </view>
        <view class="account-title">
          优惠券
        </view>
      </view>
      <view class="account-info">
        <view
          v-if="!token"
          class="account-num account-quota"
        >
          ---
        </view>
        <view
          v-if="token"
          class="account-num account-quota"
        >
          {{ data.account.credit || 0 | money }}
        </view>
        <view class="account-title">
          信用额度
        </view>
      </view>
    </view>
    <view class="login-out">
      <button
        v-if="token"
        class="login-out-btn"
        @tap="handleSignOut"
      >
        退出登录
      </button>
    </view>
  </view>
</template>
<script lang="ts">
import { logout } from '@/api';
import Taro from '@tarojs/taro';
import { Getter, Action } from 'vuex-class';
import pngHeadImg from './assets/head_img.png';
import pngUnRegistered from './assets/unregistered.png';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Person',
  onShow () {
    this.token = Taro.getStorageSync('token');
    this.refresh();
  }
})

export default class extends Vue {
  @Action('store/refresh') private refresh!: Function;
  @Getter('store/user') private user!: object;
  @Getter('store/data') private data!: object;
  get phoneNum () {
    if (!this.user.phone) return;
    let phone = this.user.phone;
    return phone.substr(0, 3) + '****' + phone.substr(7);
  }
  private pngHeadImg = pngHeadImg;
  private pngUnRegistered = pngUnRegistered;
  private token = Taro.getStorageSync('token');

  private handleSignOut () {
    let _this = this;
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录？',
      success (res) {
        if (res.confirm) {
          logout().then(() => {
            Taro.removeStorageSync('token');
            Taro.removeStorageSync('SESSION');
            _this.token = null;
          });
        }
      }
    });
  }
  private handleLogin () {
    Taro.navigateTo({
      url: '/pages/login/index'
    });
  }
}
</script>
