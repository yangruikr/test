import Vue from 'vue'
import store from './store';
import filters from '@/filter/index';
import './app.less';
import 'taro-ui/dist/style/index.scss';

// Vue.config.productionTip = false

const App = new Vue({
  store,
  beforeCreate () {
    filters();
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
})

export default App
