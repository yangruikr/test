export default {
  pages: [
    'pages/print/index',
    'pages/print/setting',
    'pages/order/index',
    'pages/login/pwdLogin',
    'pages/login/index',
    'pages/pay/pay',
    'pages/person/index',
    'pages/webview/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '掌厨小助手',
    navigationBarTextStyle: 'black'
  },
  "tabBar": {
    "color": "#555555",
    "selectedColor": "#fd7621",
    "borderStyle": "white",
    "list": [{
     "selectedIconPath": "assets/order_active.png",
     "iconPath": "assets/order_default.png",
      "pagePath": "pages/order/index",
      "text": "订单"
    }, {
      "selectedIconPath": "assets/person_active.png",
      "iconPath": "assets/person_default.png",
      "pagePath": "pages/person/index",
      "text": "个人"
    }
   ]
  }
}
