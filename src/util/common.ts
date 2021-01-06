import { Logger } from '@/util/logger';
import Taro from '@tarojs/taro';
import { code2Session } from '@/api//lib/wx';

export class Common {
  static async getSession() {
    const SESSION = Taro.getStorageSync('SESSION');
    if (SESSION) {
      const result = await this.checkSession();
      if (result) {
        return JSON.parse(SESSION);
      }
    }

    return this.doLogin();
  }

  static async checkSession () {
    return new Promise((resolve) => {
      Taro.checkSession({
        success: () => resolve(true),
        fail() {
          Logger.error('session无效--------->', Taro.getStorageSync('SESSION'));
          Taro.setStorageSync('SESSION', null);
          resolve(false);
        }
      })
    });
  }
  static async doLogin() {
    return new Promise((resolve, reject) => {
      Taro.login({
        success: async (res) => {
          try {
            const data = await code2Session({ code: res.code });
            // 初始化session
            Taro.setStorageSync('SESSION', JSON.stringify(data));
            resolve(data);
          } catch (e) {
            reject(e);
          }
        },
        fail(err) {
          reject(err);
        }
      })
    });
  }
}
