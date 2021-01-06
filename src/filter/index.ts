import Vue from 'vue';
import * as filters from './filters';
// 初始化
export default function () {
  for (let key in filters) {
    Vue.filter(key, filters[key]);
  };
}