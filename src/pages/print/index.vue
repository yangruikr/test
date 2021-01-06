<style lang="less">
  .print-container {
    padding: 10px;
    .print-list {
      background: #fff;
      border: 1px solid #d1d1d1;
      border-radius: 10px;
      padding: 20px;
      .product {
        font-size: 40px;
        color: #000;
        height: 140px;
        font-weight: bold;
      }
      .print-info {
        display: flex;
        justify-content: space-between;
        padding-top: 10px;
        .date, .quantity {
          font-size: 20px;
        }
      }
    }
  }
</style>
<template>
  <view class="print-container">
    <button @tap="handlePrinter">立即打印2</button>
    <button @tap="printStatus">查询打印机状态</button>
    <view class="print-list">
      <view class="product">-<text class="car">12</text>-白千层肚（水发/宽）（5斤）白千层肚（水发/宽）（5斤）</view>
        <view class="print-info">
          <view class="date">2020-02-02 12:12</view>
          <view class="quantity">1袋</view>
        </view>
    </view>
  </view>
</template>
<script>
import { Component, Vue, Watch } from 'vue-property-decorator';
import Taro from '@tarojs/taro';
import { Print } from '@/util/print';
import Printer from '@/util/tsc';
import { format } from '@/util/date';

@Component({
  name: 'PrintIndex',
  onShow () {
  },
  onUnload: function() {
    Taro.closeBLEConnection({
      deviceId: Print.BLEInformation.deviceId,
      success: function(res) {
        console.log("关闭蓝牙成功");
      }
    });
  }
})

export default class extends Vue {
  private looptime = 0;
  private currentTime = 1;
  private lastData = 0;
  private oneTimeData = 20;
  private currentPrint = 1;
  private isLabelSend = false;
  private isReceiptSend = false;
  private printIndex = null;
  private printData = [];

  @Watch('printIndex')
  private watchPrintIndex(v, oldV) {
    if (v < this.printData.length) {
      this.prepareSend(v);
    }
  }

  private printStatus () {
    const command = Printer.Query();
    command.getRealtimeStatusTransmission(1);
  }
  private handlePrinter () {
    let printArr = [];
    let arr = [
      {name: '水果红薯（六鳌红蜜薯）', car: '3'},
      {name: '六和去皮去骨鸡腿肉（60-70g/片）约9.75kg/件）', car: '4'}
    ];
    arr.map((item, index) => {
      let date = format();
      const command = Printer.createNew();
      command.setSize(60, 40);
      command.setGap(2);
      command.setCls();
      const txt = `-${item.car}-${item.name}`;
      let txt1 = txt.substring(0, 10);
      let txt2 = txt.substring(10, 20);
      command.setText(30, 30, "TSS24.BF2", 2, 2, `${txt1}`);
      command.setText(30, 90, "TSS24.BF2", 2, 2, `${txt2}`);
      command.setText(30, 280, "TSS24.BF2", 1, 1, `${date}`);
      command.setText(350, 280, "TSS24.BF2", 1, 1, `${index + 1}袋`);
      command.setPagePrint();
      this.isReceiptSend = true;
      printArr.push({buff: command.getData()});
    })
    this.printData = printArr;
    this.printIndex = 0;
  }

  private prepareSend(startIndex = 0) {
    const buff = this.printData[startIndex].buff;
    const index = startIndex;
    let time = this.oneTimeData;
    let looptime = parseInt(buff.length / time);
    let lastData = parseInt(buff.length % time);
    this.looptime = looptime + 1;
    this.lastData = lastData;
    this.currentTime = 1;
    this.Send(buff, index);
  }

  /**
   * 向低功耗蓝牙设备特征值中写入二进制数据
   */
  private Send(buff, index) {
    return new Promise((resolve, reject) => {
      let currentTime = this.currentTime;
      let loopTime = this.looptime;
      let lastData = this.lastData;
      let onTimeData = this.oneTimeData; // 写入的字节数，每次写入不超过20
      let printNum = this.printerNum; // 打印的份数
      let currentPrint = this.currentPrint;
      let buf;
      let dataView;
      if (currentTime < loopTime) {
        buf = new ArrayBuffer(onTimeData);
        dataView = new DataView(buf);
        for (let i = 0; i < onTimeData; ++i) {
          dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i]);
        }
      } else {
        buf = new ArrayBuffer(lastData);
        dataView = new DataView(buf);
        for (let i = 0; i < lastData; ++i) {
          dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i]);
        }
      }
      const {deviceId, writeServiceId, writeCharaterId} = Print.BLEInformation || {};
      Taro.writeBLECharacteristicValue({
        deviceId: deviceId,
        serviceId: writeServiceId,
        characteristicId: writeCharaterId,
        value: buf,
        complete: (res) => {
          currentTime++;
          if (currentTime <= loopTime) {
            this.currentTime = currentTime;
            this.Send(buff, index);
          } else {
            this.looptime = 0;
            this.lastData = 0;
            this.currentTime = 1;
            this.currentPrint++;
            this.isReceiptSend = false;
            this.isLabelSend = false;
            this.printIndex ++ ;
          }
        }
      });
    });
  }
}
</script>
