<style lang="less">
@import '~@/style/var';
.pay-container {
  margin-top: 2 * @space;
  .icon-box{
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .icon-box-ctn{
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .button-group{
    flex-direction: row;
    align-items: center;
  }
  .btn-back{
    color: @primary;
    background-color:transparent;
    border: 1px solid @primary;
  }

  .default {
    padding: 20px 30px;
    border-radius: 15px;
  }
  .btn-retry{
    background-color: @primary;
    border: 1px solid @primary;
    color: white;
  }

  .mt {
    margin-top: @space;
  }
}
</style>
<template>
  <view
    class="pay-container"
    :hidden="hidden"
  >
    <view
      class="icon-box flex"
    >
      <icon
        class="icon-box-img"
        :type="status"
        size="80"
      />
      <view class="icon-box-ctn">
        <view class="icon-box-title">
          {{ title }}
        </view>
        <view
          v-if="tips"
          class="icon-box-desc"
        >
          {{ tips }}
        </view>
      </view>
    </view>
    <view class="button-group flex mt">
      <button
        plain="true"
        class="default btn-back"
        app-parameter="wechat"
        open-type="launchApp"
        @error="launchAppError"
      >
        返回商城
      </button>
      <button
        v-if="btnRetry"
        class="default btn-retry"
        @tap="doPay"
        @error="launchAppError"
      >
        重新支付
      </button>
    </view>
  </view>
</template>
<script>
import { Logger } from '@/util/logger';
import Taro from '@tarojs/taro';
import { paymentsPayInfo } from '@/api/lib/payment';
import { Common } from '@/util/common';
import { Pay } from '@/util/pay';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Pay',
  onLoad(options) {
    const data = Taro.getLaunchOptionsSync();
    if (data.scene !== 1069) {
      Logger.info('非APP调用，重定向到index-->', data.scene);
      Taro.redirectTo({ url: '/pages/index/index' });
    } else {
      this.hidden = false;
    }
    const { paymentId } = options;
    if (!Number.isInteger(+paymentId) || +paymentId <= 0) {
      Taro.showToast({
        icon: 'none',
        title: '参数异常',
        duration: 3000
      });
      return Logger.error(`参数异常,详情：${paymentId}`);
    } else {
      this.paymentId = +paymentId;
    }
    this.doPay(this);
  }
})

export default class extends Vue {
  private hidden = true;
  private btnRetry = false;
  private tips = '';
  private title = '正在提交订单';
  private status = 'warn';
  private btnTxt = '';
  private payStatus = 'unpaid';
  private paymentId = 0;
  private payInfo: any;

  private launchAppError(e) {
    Logger.error('launchAppError------------->', JSON.stringify(e));
  }
  private async doPay () {
    const status = this.payStatus;
    // 已支付
    if (status === 'success') {
      return;
    }

    if (!this.payInfo) {
      // 初始化payInfo
      Taro.showLoading({ title: '加载中' });
      try {
        this.payInfo = await this.getPayInfo();
      } catch (e) {
        Logger.error('---------->获取支付信息失败', JSON.stringify(e));
        this.title = '发起支付失败';
        this.btnRetry = true;
        this.tips = e.message;
        return;
      } finally {
        Taro.hideLoading();
      }
    }

    this.payment();
  }
  private async getPayInfo() {
    let pay = Taro.getStorageSync('PAY_INFO');
    if (pay) {
      pay = JSON.parse(pay);
      if (pay.id === this.paymentId) {
        return pay.data;
      } else {
        Taro.setStorageSync('PAY_INFO', null);
      }
    }

    const session = await Common.getSession();
    const body = {
      openid: session.openid,
      payment_id: this.paymentId
    };

    const data = await paymentsPayInfo(body);
    Taro.setStorageSync('PAY_INFO', JSON.stringify({ id: this.paymentId, data }));
    return data;
  }
  private payment() {
    Pay.payment(this.payInfo).then(res => {
      switch (res.errMsg) {
        case 'requestPayment:ok':
          this.status = 'success';
          this.title = '支付成功';
          this.btnRetry = false;
          this.tips = '';
          this.payStatus = "success";
          break;
        case 'requestPayment:fail cancel':
          this.btnRetry = true;
          this.title = '支付取消';
          this.tips = '';
          this.payStatus = "cancel";
          Logger.info('支付取消', res);
          break;
        default:
          this.btnRetry = true;
          this.title = '支付失败';
          this.tips = '请您稍后重试。';
          Logger.error('支付失败', res);
          break;
      }
    });
  }
}
</script>
