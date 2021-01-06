import Taro from '@tarojs/taro';
const log = Taro.getRealtimeLogManager ? Taro.getRealtimeLogManager() : null

export class Logger {
  static info() {
    if (!log) return;
    let params: any = arguments;
    log.info.apply(log, params);
  }
  static warn() {
    if (!log) return;
    let params: any = arguments;
    log.warn.apply(log, params);
  }
  static error() {
    if (!log) return;
    let params: any = arguments;
    log.error.apply(log, params);
  }
  static in () {
    if (!log) return;
    let params: any = arguments;
    log.in.apply(log, params);
  }
  static setFilterMsg(msg: string) { // 从基础库2.7.3开始支持
    if (!log || !log.setFilterMsg) return;
    if (typeof msg !== 'string') return;
    log.setFilterMsg(msg);
  }
  static addFilterMsg(msg: string) { // 从基础库2.8.1开始支持
    if (!log || !log.addFilterMsg) return;
    if (typeof msg !== 'string') return;
    log.addFilterMsg(msg);
  }
}
