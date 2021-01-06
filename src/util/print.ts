import Taro from '@tarojs/taro';
console.log(Taro.getSystemInfoSync());
export class Print {
  static systemInfo = Taro.getSystemInfoSync();
  static globalData = {
    userInfo: null,
    platform: '',
    screenWidth: Taro.getSystemInfoSync().screenWidth,
    screenHeight: Taro.getSystemInfoSync().screenHeight
  }
  static BLEInformation = {
    platform: '',
    deviceId: '',
    writeCharaterId: '',
    writeServiceId: '',
    notifyCharaterId: '',
    notifyServiceId: '',
    readCharaterId: '',
    readServiceId: ''
    // printStatus: false
  }
  static getModel () { //获取手机型号
    return this.systemInfo.model;
  }
  static getVersion () { //获取微信版本号
    return this.systemInfo.version;
  }
  static getSystem () { //获取操作系统版本
    return this.systemInfo.system;
  }
  static getPlatform () { //获取客户端平台
    return this.systemInfo.platform;
  }
  static getSDKVersion () { //获取客户端基础库版本
    return this.systemInfo.SDKVersion;
  }
}
