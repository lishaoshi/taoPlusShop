//app.js
let env = "prod";
let config = {};
switch (env) {
  case "prod":
    config = {
      HOST: 'https://api2.olb8.com',
      IMG: 'http://cdn.img.olb8.com',
      shopId: wx.getStorageSync('olb_shopId') || 'f114ba6f95374124ae7bf4054841ca3d', // '54a54ed8db3c45a98658b3f452d283c1' ,
      userId: '',
      clientId: '677b0c6d6cfb46a2b0be48613ab9e14c',
      clientSecret: '677b0c6d6cfb46a2b0be48613ab9e14c',
      env: 'prod',
      toMiniProgramEnvVersion: 'release'
    };
    break;
  case "test":
    config = {
      HOST: 'https://api.test.olb8.com',
      IMG: 'https://api.test.olb8.com',
      shopId: wx.getStorageSync('plus_shopId') || '7cd2d98763844a9b8ac874093adc66f6',
      userId: '',
      clientId: 'shop_miniapp',
      clientSecret: 'shop_miniapp',
      env: 'test',
      toMiniProgramEnvVersion: 'trial'
    };
    break;
  case "dev":
    config = {
      // HOST: 'http://192.168.1.6:9082',
      // IMG: 'http://192.168.1.6:9082',
      HOST: 'http://192.168.3.150:9082',
      IMG: 'http://192.168.3.150:9082',
      shopId: '7cd2d98763844a9b8ac874093adc66f6',
      userId: '',
      clientId: 'shop_miniapp',
      clientSecret: 'shop_miniapp',
      env: 'test',
      toMiniProgramEnvVersion: 'develop'
    };
    break;
}
App({
  onLaunch: function() {},
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

  globalData: {
    HOST: config.HOST,
    IMG: config.IMG,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    env: config.env,
    userInfo: null,
    shippingAddress: "", //收货地址
    shippingName: "", //收货人名称
    shippingPhone: "", //收货人号码
    checked: "", //选中的地址index
    userAddressId: "", //收货地址id
    latitude: "",
    longitude: "",
    openId: "",
    session_key: "",
    shopName: "", //商家名称
    shopImg: "",
    shopId: config.shopId, //测试用的商家id    2ec82d1efbbb4b5683a11696b3b1f3ae   86bc09283db440029113f92048e2aafa  203240e17acb47779132aed66ce271bd d9324cfe8581478da666dc26ea76533a

    //   userId: "17fec57943324c8090bec812bc2840b9", //测试用的用户id
    userId: config.userId, //测试用的用户id
    mobile: '',
    nickName: '',
    portraitUrl: '',
    orderId: "", //订单id
    remind: "", //备注
    receipt: "", //发票
    seatName: "",
    positionName: "",
    carList: [], //购物车
    content: '',
    isGeneralizer: false,
  }
})