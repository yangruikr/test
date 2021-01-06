<style lang="less">
@import '~@/style/var';
.order-container {
  .order-list {
    margin: @space @space 0;
  }
  .order-title {
    border-radius: @boRadius @boRadius 0 0;
    padding: @space;
    background: #fff;
    position: sticky;
    top: 0;
    .date-icon {
      width: 38px;
      height: 38px;
      margin-right: 20px;
    }
    .date {
      font-size: 28px;
      color: #000;
    }
  }
  .order-info {
    background: #fff;
    border-top: 1px solid #F2F2F2;
    border-bottom: 1px solid #F2F2F2;
  }
  .padd-x {
    padding-left: @space;
    padding-right: @space;
  }
  .no-order {
    width: 100vw;
    height: 100vh;
    text-align: center;
    .no-img {
      width: 242px;
      height: 242px;
      margin-top: 10vh;
    }
    .no-msg {
      padding: 20px 0;
      text-align: center;
      color: #cacacc;
    }
  }
  .btn-group {
    justify-content: flex-end;
    background: #fff;
    border-radius: 0 0 @boRadius @boRadius;
    padding: 20px 0;
    overflow: hidden;
    text-align: center;
    .pay-btn {
      display: inline-block;
      border-radius: 30px;
      width: 158px;
      height: 60px;
      font-size: 26px;
      line-height: 60px;
      background: @primary;
      color: #fff;
      margin-right: 20px;
    }
  }
  .load-all {
    text-align: center;
    color: #999;
    padding: 20px;
    margin-top: 10px;
  }
  .go-login {
    background: @primary;
    color: #fff;
    padding: 10px 20px;
  }
}
</style>
<template>
  <view class="order-container">
    <slot v-if="!token">
      <view class="no-order">
        <image
          :src="pngNoOrder"
          class="no-img"
        />
        <view class="no-msg">
          您还没有登录，请登录后查看订单
        </view>
        <button
          class="go-login"
          @tap="handleLogin"
        >
          登录
        </button>
      </view>
    </slot>
    <slot v-else-if="data.length">
      <view
        v-for="(item, index) in data"
        :key="index"
        class="order-list"
      >
        <view class="order-title flex">
          <image
            :src="pngDate"
            class="date-icon"
          />
          <view class="date">
            下单时间：{{ item[0].createdAt | date('YYYY-MM-DD') }}
          </view>
        </view>
        <view class="order-info padd-x">
          <order-item
            v-for="order in item"
            :key="order.id"
            :data="order"
          />
        </view>
        <view class="btn-group flex">
          <view
            v-if="item[0].status === '-1'"
            class="pay-btn"
            @tap="handlePay(item)"
          >
            去支付
          </view>
        </view>
      </view>
    </slot>
    <slot v-else>
      <view class="no-order">
        <image
          :src="pngNoOrder"
          class="no-img"
        />
        <view class="no-msg">
          没有相关订单
        </view>
      </view>
    </slot>
    <view
      class="load-all"
    >
      {{ loaded && data.length ? '已加载全部~' : '' }}
    </view>
  </view>
</template>

<script lang="ts">
import * as orders from '@/api/lib/order';
import OrderItem from './item.vue';
import pngDate from './assets/date.png';
import pngNoOrder from '@/assets/no_order.png';
import Taro from '@tarojs/taro';
import { Common } from '@/util/common';
import { Pay } from '@/util/pay';
import { Logger } from '@/util/logger';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Order',
  components: {
    OrderItem
  },
  onReachBottom () {
    this.list();
  },
  onShow () {
    this.token = Taro.getStorageSync('token');
    if (this.token) {
      this.query.offset = 0;
      this.loaded = false;
      this.data = [];
      this.list();
    }
  }
})

export default class extends Vue {
  private pngDate = pngDate;
  private pngNoOrder = pngNoOrder;
  private loading = false;
  private loaded = false;
  private data = [];
  private paymentId = 0;
  private query = {
    offset: 0,
    limit: 10
  }
  private token = Taro.getStorageSync('token');
  private handleLogin () {
    Taro.navigateTo({
      url: '/pages/login/index'
    });
  }
  private async handlePay (data) {
    let payments: any[] = [];
    data.forEach(item => {
      const { id, money } = item;
      payments.push({order_id: id, money});
    });
    const { openid } = await Common.getSession();
    const payInfo = await orders.payment({
      openid,
      payments,
      pay_mode: 'balance',
      channel: 'WX_MINI_PAY'
    });
    Pay.payment(payInfo).then(res => {
      switch (res.errMsg) {
        case 'requestPayment:ok':
          Taro.showToast({
            icon: 'success',
            title: '支付成功'
          });
          this.query.offset = 0;
          this.loaded = false;
          this.data = [];
          this.list();
          break;
        case 'requestPayment:fail cancel':
          Taro.showToast({
            icon: 'none',
            title: '支付取消'
          });
          Logger.info('支付取消', res);
          break;
        default:
          Taro.showToast({
            icon: 'none',
            title: '支付失败'
          });
          Logger.error('支付失败', res);
          break;
      }
    });
  }
  list () {
    if (this.loading || this.loaded) return;
    this.loading = true;
    Taro.showNavigationBarLoading();
    const { limit, offset } = this.query;
    orders.list(this.query).then(({ meta }) => {
      this.loading = false;
      this.data.splice(offset, limit, ...meta);
      this.loaded = meta.length < limit || !meta.length;
      this.query.offset += limit;
      Taro.hideNavigationBarLoading();
    }).catch(() => {
      this.loading = false;
      Taro.hideNavigationBarLoading();
    });
  }
}
</script>
