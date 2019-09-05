//app.js
let config = {}

let env = "test";

switch (env) {
  case "prod":
    config = {
      HOST: 'https://api2.olb8.com',
      IMG: 'http://cdn.img.olb8.com',
      env: 'prod',
      openid: '',
      sessionKey: '',
      accessToken: '',
      expiresTime: '',
      expiresIn: '',
      clientId: 'city_miniapp', //41f7b36a712c4bd4b636f1064c4a7846
      clientSecret: 'city_miniapp',
      userId: '',
      agencyId: wx.getStorageSync('plus_agencyId') || 'ec4984a201e84e33936306ca8155c24d',
      mobile: '', //测试用的手机号
      portraitUrl: '',
      appId: 'wx2d3af38435132b06',
      shippingAddress: "", //收货地址
      shippingName: "", //收货人名称
      shippingPhone: "", //收货人号码
      checked: "", //选中的地址index
      userAddressId: "", //收货地址id
      positionName: '',
      content: '',
      isIphoneX: false,
      userInfo: null,
      longitude: '',
      latitude: '',
      provinceName: '',
      cityName: ''
    }
    break;

  case "test":
    config = {
      HOST: 'http://134.175.171.231:9082',
      IMG: 'http://134.175.171.231:9082',
      // city&district 选项参数:
      env: 'test',
      openid: '',
      sessionKey: '',
      accessToken: '',
      expiresTime: '',
      expiresIn: '',
      clientId: 'city_miniapp', //city_miniapp
      clientSecret: 'city_miniapp',
      userId: '18fbdda731154ab0a81f912268f7012a', //测试用的userId b874258b1d8b4e6ba6179f3532cb929c
      agencyId: wx.getStorageSync('plus_agencyId') || 'bc2e3fab774e4797a3987371c20553c8', //测试用的商圈id 41f7b36a712c4bd4b636f1064c4a7846 4ae44a42428f4d56b6d80b2826f997a5
      mobile: '', //测试用的手机号
      nickName: '',
      portraitUrl: '',
      username: '',
      appId: 'wx463b5a1c2c851de8',
      shippingAddress: "", //收货地址
      shippingName: "", //收货人名称
      shippingPhone: "", //收货人号码
      checked: "", //选中的地址index
      userAddressId: "", //收货地址id
      positionName: '',
      content: '',
      isIphoneX: false, //识别iphonex以上手机
      userInfo: null,

      // city 选项参数:
      provinceName: '',
      cityName: '',

      // shop商家选项参数:
      shopId: wx.getStorageSync('plus_shopId') || '5228909e313b499d8ce51f00d8fcf4e0',
      toMiniProgramEnvVersion: 'trial',
      latitude: "",
      longitude: "",
      session_key: "",
      shopName: "", //商家名称
      shopImg: "",
      orderId: "", //订单id
      remind: "", //备注
      receipt: "", //发票
      seatName: "",
      carList: [], //购物车
      isGeneralizer: false
    }
    break;
  case "dev":
    config = {
      HOST: 'http://192.168.3.181:9082', 
      IMG: 'http://192.168.3.181:9082',
      // city&district 选项参数:
      env: 'test',
      openid: '',
      sessionKey: '',
      accessToken: '',
      expiresTime: '',
      expiresIn: '',
      clientId: 'city_miniapp', //city_miniapp
      clientSecret: 'city_miniapp',
      userId: '18fbdda731154ab0a81f912268f7012a', //测试用的userId b874258b1d8b4e6ba6179f3532cb929c
      agencyId: wx.getStorageSync('plus_agencyId') || 'bc2e3fab774e4797a3987371c20553c8', //测试用的商圈id 41f7b36a712c4bd4b636f1064c4a7846 4ae44a42428f4d56b6d80b2826f997a5
      mobile: '', //测试用的手机号
      nickName: '',
      portraitUrl: '',
      username: '',
      appId: 'wx463b5a1c2c851de8',
      shippingAddress: "", //收货地址
      shippingName: "", //收货人名称
      shippingPhone: "", //收货人号码
      checked: "", //选中的地址index
      userAddressId: "", //收货地址id
      positionName: '',
      content: '',
      isIphoneX: false, //识别iphonex以上手机
      userInfo: null,

      // city 选项参数:
      provinceName: '',
      cityName: '',

      // shop商家选项参数:
      shopId: wx.getStorageSync('plus_shopId') || '7cd2d98763844a9b8ac874093adc66f6',
      toMiniProgramEnvVersion: 'trial',
      latitude: "",
      longitude: "",
      session_key: "",
      shopName: "", //商家名称
      shopImg: "",
      orderId: "", //订单id
      remind: "", //备注
      receipt: "", //发票
      seatName: "",
      carList: [], //购物车
      isGeneralizer: false
    }
    break;
  case "dev2":
    config = {
      HOST: 'http://192.168.3.132:9082',
      IMG: 'http://192.168.3.132:9082',
      // city&district 选项参数:
      env: 'test',
      openid: '',
      sessionKey: '',
      accessToken: '',
      expiresTime: '',
      expiresIn: '',
      clientId: 'city_miniapp', //city_miniapp
      clientSecret: 'city_miniapp',
      userId: '18fbdda731154ab0a81f912268f7012a', //测试用的userId b874258b1d8b4e6ba6179f3532cb929c
      agencyId: wx.getStorageSync('plus_agencyId') || 'bc2e3fab774e4797a3987371c20553c8', //测试用的商圈id 41f7b36a712c4bd4b636f1064c4a7846 4ae44a42428f4d56b6d80b2826f997a5
      mobile: '', //测试用的手机号
      nickName: '',
      portraitUrl: '',
      username: '',
      appId: 'wx463b5a1c2c851de8',
      shippingAddress: "", //收货地址
      shippingName: "", //收货人名称
      shippingPhone: "", //收货人号码
      checked: "", //选中的地址index
      userAddressId: "", //收货地址id
      positionName: '',
      content: '',
      isIphoneX: false, //识别iphonex以上手机
      userInfo: null,

      // city 选项参数:
      provinceName: '',
      cityName: '',

      // shop商家选项参数:
      shopId: wx.getStorageSync('plus_shopId') || '7cd2d98763844a9b8ac874093adc66f6',
      toMiniProgramEnvVersion: 'trial',
      latitude: "",
      longitude: "",
      session_key: "",
      shopName: "", //商家名称
      shopImg: "",
      orderId: "", //订单id
      remind: "", //备注
      receipt: "", //发票
      seatName: "",
      carList: [], //购物车
      isGeneralizer: false
    }
    break;
 }

App({
  onLaunch: function(options) {

  },

  onError: function(err) {
    /**
     * 监测错误并上报
     */
  },

  //渐入，渐出实现
  show: function(that, param, opacity) {
    let animation = wx.createAnimation({ //持续时间800ms 
      duration: 500,
      timingFunction: 'ease',
    });
    animation.opacity(opacity).step(); //将param转换为key 
    let json = '{"' + param + '":""}';
    json = JSON.parse(json);
    json[param] = animation.export(); //设置动画 
    that.setData(json)
  },

  onShow: function(options) {

  },
  globalData: config,

  // 自定义tabbar组件
  // 遍历tabbar items渲染ui
  editTabbar: function() {
    let tabbar = this.tabBarData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  // 自定义tabbar组件 切换改变图片文字颜色
  swichNav: function(e) {
    console.log(e);
    console.log('e.target.dataset.current:' + e.currentTarget.dataset.num);

    let that = this;

    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];

    if (this.tabBarData.tabBar.currentTab === e.currentTarget.dataset.num) {
      return false;
    } else {
      _this.setData({
        currentTab: e.currentTarget.dataset.num
      });
      this.tabBarData.tabBar.currentTab = e.currentTarget.dataset.num
    }
    console.log(this.tabBarData.tabBar.currentTab);
  },
  // 自定义组件数据  
  tabBarData: {
    tabBar: {
      "currentTab": 0,
      "backgroundColor": "#ffffff",
      "color": "#333333",
      "selectedColor": "#fe791d",
      "list": [{
          "pagePath": "/pages/district/index/index",
          "iconPath": "/images/home.png",
          "selectedIconPath": "/images/home-light.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/district/activity_area/activity_area",
          "iconPath": "/images/discount.png",
          "selectedIconPath": "/images/discount-light.png",
          "text": "活动专区"
        },
        {
          "pagePath": "/pages/district/order_list/order_list",
          "iconPath": "/images/order.png",
          "selectedIconPath": "/images/order-light.png",
          "text": "订单"
        },
        {
          "pagePath": "/pages/district/user/user",
          "iconPath": "/images/user.png",
          "selectedIconPath": "/images/user-light.png",
          "text": "我的"
        }
      ]
    }
  }



})