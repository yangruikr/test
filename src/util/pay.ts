import Taro from '@tarojs/taro';

export class Pay {
  static payment (info: { signType: any; package: any; paySign: any; nonceStr: any; timeStamp: { toString: () => any; }; }) {
    const options = {
      signType: info.signType,
      package: info.package,
      paySign: info.paySign,
      nonceStr: info.nonceStr,
      timeStamp: info.timeStamp.toString()
    };
    return new Promise((reslove) => {
      Taro.requestPayment({
        ...options,
        complete: (res: any) => {
          reslove(res);
        }
      })
    });
  }
}
