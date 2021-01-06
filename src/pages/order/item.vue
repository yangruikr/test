<style lang="less">
@import '~@/style/var';
.order-item-wrap {
  .order-msg {
    justify-content: space-between;
    font-size: 26px;
    padding-top: 26px;
    margin-bottom: 43px;
    .order-no {
      color: #999;
    }
    .order-status {
      color: @primary;
    }
  }
  .delivery-time {
    height: 95px;
    font-size: 26px;
    line-height: 95px;
  }
  .order-item {
    justify-content: space-between;
  }
  .order-money {
    align-items: center;
  }
  .money {
    text-align: right;
  }
  .text-primary {
    color: @primary;
  }
  .right-icon {
    width: 14px;
    height: 24px;
    margin-left: @space;
  }
  .more {
    width: 68px;
    height: 16px;
  }
}
</style>
<template>
  <view class="order-item-wrap">
    <view class="order-msg flex">
      <view class="order-no">
        订单号：{{ data.id }}
      </view>
      <view class="order-status">
        {{ Status[data.status] }}
      </view>
    </view>
    <view class="order-item flex">
      <view class="order-money flex">
        <slot
          v-for="(item, index) in images"
        >
          <image-box
            :key="index"
            :src="item.image"
          />
        </slot>
        <image
          v-if="data.products.length > 3"
          :src="pngShenglue"
          class="more"
        />
      </view>
      <view class="order-money flex">
        <view class="money">
          <view class="text-primary">
            {{ data.money | money }}
          </view>
          <view>共{{ data.item_count }}种商品</view>
        </view>
        <image
          :src="pngArrowRight"
          class="right-icon"
        />
      </view>
    </view>
    <view class="delivery-time">
      配送时间: {{ data.delivery_time | date('YYYY-MM-DD HH:mm') }}
    </view>
  </view>
</template>
<script>
import ImageBox from '@/components/ImageBox';
import pngArrowRight from './assets/arrow_right.png';
import pngShenglue from './assets/shenglue.png';
import { Component, Vue, Prop } from 'vue-property-decorator';

const Status: { [key: number | string]: string} = {
  0: '已锁定',
  1: '已确认',
  2: '待分拣',
  3: '已出库',
  4: '待配送',
  5: '配送中',
  6: '已收货',
  7: '已入账',
  '-1': '待付款',
  '-2': '已过期',
  '-3': '已取消'
};

@Component({
  name: 'OrderItem',
  components: {
    ImageBox
  }
})

export default class extends Vue {
  @Prop({ required: true }) private data!: Object;
  private Status = Status;
  private pngArrowRight = pngArrowRight;
  private pngShenglue = pngShenglue;

  get images () {
    return this.data.products.slice(0, 3);
  }
}
</script>
