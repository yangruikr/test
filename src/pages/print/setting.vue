<style lang="less">
.print {
  margin: 0 auto;
  .btn {
    display: block;
    padding: 20px;
    font-size: 30px;
    margin: 50px 30px 0;
  }
  .item{
    display: block;
    margin: 10px 30px 0;
    background-color:#FFA850;
    border-radius: 5px;
    padding: 10px 0;
  }
  .block{
      font-size: 26px;
      display: block;
      color:#fff;
      padding: 5px;
  }
  .pt {
    padding-top: 10px;
  }
}
</style>
<template>
  <view class="print">
    <button class="btn" type="primary" @tap="startSearch" :loading='isScanning'>搜索打印设备</button>
    <view v-for="item in list" class="pt" :key="item.deviceId" @tap="handChecked(item)">
      <view class="item">
          <view class="deviceId block">{{item.deviceId}}</view>
          <view class="name block">{{item.name}}</view>
        </view>
    </view>
  </view>
</template>
<script>
import { Component, Vue } from 'vue-property-decorator';
import Taro from '@tarojs/taro';
import { Print } from '@/util/print';
@Component({
  name: 'PrintSetting',
  onLoad (options) {
    Print.BLEInformation.platform = Print.getPlatform();
  }
})
export default class extends Vue {
  private isScanning = false;
  private readCharacter = false;
  private writeCharacter = false;
  private notifyCharacter = false;
  private serviceId = 0;
  private list = [];
  private services = [];

/**
   * 初始化蓝牙模块
   */
  private startSearch () {
    const that = this;
    Taro.openBluetoothAdapter({
      success: (res) => {
        Taro.stopBluetoothDevicesDiscovery();
        this.checkPemission();
      },
      fail () {
        Taro.showModal({
          title: '提示',
          content: '蓝牙初始化失败，请打开蓝牙'
        })
      }
    });
  }
  private checkPemission () {  //android 6.0以上需授权地理位置权限
    const that = this;
    let platform = Print.BLEInformation.platform;
    if (platform == 'ios') {
      Print.globalData.platform = 'ios';
      that.getBluetoothDevices();
    } else if (platform == 'android') {
      Print.globalData.platform = 'android';
      console.log(Print.getSystem(), Print.getSystem().substring(Print.getSystem().length - (Print.getSystem().length - 8), Print.getSystem().length - (Print.getSystem().length - 8) + 1))
      if (Print.getSystem().substring(Print.getSystem().length - (Print.getSystem().length - 8), Print.getSystem().length - (Print.getSystem().length - 8) + 1) > 5) {
        Taro.getSetting({
          success: (res) =>  {
            if (!res.authSetting['scope.userLocation']) {
              Taro.authorize({
                scope: 'scope.userLocation',
                complete: (res) => {
                  this.getBluetoothDevices();
                }
              });
            } else {
              this.getBluetoothDevices();
            }
          }
        });
      }
    }
  }
  /**
   * 搜寻附近的蓝牙设备
   */
  getBluetoothDevices () {
    const that = this;
    Taro.showLoading({
      title: '搜索中...',
    });
    this.isScanning = true;
    Taro.startBluetoothDevicesDiscovery({
      success: (res) => {
        setTimeout(() => {
          Taro.getBluetoothDevices({
            success: (res) => {
              let list = [];
              let num = 0;
              const { devices } = res;
              devices.map(item => {
                if (item.name !== '未知设备') {
                  list.push(item);
                }
              })
              this.list = list;
              this.isScanning = false;
              Taro.hideLoading();
              Taro.stopPullDownRefresh();
            }
          });
        }, 3000);
      }
    })
  }
  /**
   * 连接低功耗蓝牙设备
   */
  private handChecked (item) {
    Taro.stopBluetoothDevicesDiscovery();
    this.serviceId = 0;
    this.writeCharacter = false;
    this.readCharacter = false;
    this.notifyCharacter = false;
    Taro.showLoading({
      title: '连接中...'
    });
    const { deviceId } = item;
    Taro.createBLEConnection({
      deviceId,
      success: (res) => {
        Print.BLEInformation.deviceId = deviceId;
        this.getSeviceId();
      }, fail (e) {
        Taro.showModal({
          title: '提示',
          content: '连接失败'
        })
        Taro.hideLoading();
      },
      complete (res) {
        console.log(res);
      }
    });
  }
  /**
   * 获取蓝牙设备服务
   */
  private getSeviceId () {
    const platform = Print.BLEInformation.platform;
    Taro.getBLEDeviceServices({
      deviceId: Print.BLEInformation.deviceId,
      success: (res) => {
        this.services = res.services;
        this.getCharacteristics();
      }, fail (e) {
        console.log(e);
      }
    });
  }
  /**
   * 获取蓝牙设备特征值
   */
  private getCharacteristics () {
    let list = this.services;
    let num = this.serviceId;
    let write = this.writeCharacter;
    let read = this.readCharacter;
    let notify = this.notifyCharacter;
    Taro.getBLEDeviceCharacteristics({
      deviceId: Print.BLEInformation.deviceId,
      serviceId: list[num].uuid,
      success: (res) => {
        const { characteristics } = res;
        characteristics.map(charact => {
          const { properties, uuid: item } = charact;
          if (!notify) {
            if (properties.notify) {
              Print.BLEInformation.notifyCharaterId = item;
              Print.BLEInformation.notifyServiceId = list[num].uuid;
              notify = true;
            }
          }
          if (!write) {
            if (properties.write) {
              Print.BLEInformation.writeCharaterId = item;
              Print.BLEInformation.writeServiceId = list[num].uuid;
              write = true;
            }
          }
          if (!read) {
            if (properties.read) {
              Print.BLEInformation.readCharaterId = item;
              Print.BLEInformation.readServiceId = list[num].uuid;
              read = true;
            }
          }
        });
        if (!write || !notify || !read) {
          num++;
          this.writeCharacter = write;
          this.readCharacter = read;
          this.notifyCharacter = notify;
          this.serviceId = num;
         if(num == list.length) {
           Taro.showModal({
             title: '提示',
             content: '找不到该读写的特征值'
           });
         } else {
           this.getCharacteristics();
         }
        } else {
          // Print.BLEInformation.printStatus = true;
          this.goPrint();
        }
      }, fail (e) {
        console.log(e);
      }
    })
  }
  private goPrint () {
    Taro.navigateTo({
      url: '/pages/print/index'
    });
  }
}
</script>
