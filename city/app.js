//app.js

let env = "prod";

let config = {}

switch (env) {
  case "dev":
    config = {
      HOST: 'http://192.168.3.150:9082',
      IMG: 'http://192.168.3.150:9082',
      // HOST: 'http://192.168.3.156:9082',
      // IMG: 'http://192.168.3.156:9082',
      env: 'dev',
      openid: '',
      sessionKey: '',
      accessToken: '',
      expiresTime: '',
      expiresIn: '',
      clientId: 'city_miniapp',
      clientSecret: 'city_miniapp',
      userId: '', //测试用的userId b874258b1d8b4e6ba6179f3532cb929c
      agencyId: 'bc2e3fab774e4797a3987371c20553c8', //测试用的商圈id f29c019a22b3404f8d6c3ad2e7d04129
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
    }
    break;


  case "test":
    config = {
      HOST: 'https://api.test.olb8.com',
      IMG: 'https://api.test.olb8.com',
      env: 'test',
      openid: '',
      sessionKey: '',
      accessToken: '',
      expiresTime: '',
      expiresIn: '',
      clientId: 'city_miniapp',//city_miniapp
      clientSecret: 'city_miniapp',
      userId: '', //测试用的userId b874258b1d8b4e6ba6179f3532cb929c
      agencyId: wx.getStorageSync('plus_agencyId') || '41f7b36a712c4bd4b636f1064c4a7846', //测试用的商圈id 41f7b36a712c4bd4b636f1064c4a7846 4ae44a42428f4d56b6d80b2826f997a5
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
      userInfo: null
    }
    break;

  case "test2":
    config = {
        HOST: 'http://192.168.3.192:9082',
        IMG: 'http://192.168.3.192:9082',
      env: 'test',
      openid: '',
      sessionKey: '',
      accessToken: '',
      expiresTime: '',
      expiresIn: '',
      clientId: '1',
      clientSecret: '1',
      userId: '', //测试用的userId b874258b1d8b4e6ba6179f3532cb929c
      agencyId: 'bc2e3fab774e4797a3987371c20553c8', //测试用的商圈id 41f7b36a712c4bd4b636f1064c4a7846
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
      isIphoneX: false,
      userInfo: null

    }

    break;

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
      clientId: 'city_miniapp',//41f7b36a712c4bd4b636f1064c4a7846
      clientSecret: 'city_miniapp',
      userId: '',
      agencyId: wx.getStorageSync('plus_agencyId') || 'ec4984a201e84e33936306ca8155c24d',
      mobile: '', //测试用的手机号
      portraitUrl: '',
      appId: 'wx463b5a1c2c851de8',
      shippingAddress: "", //收货地址
      shippingName: "", //收货人名称
      shippingPhone: "", //收货人号码
      checked: "", //选中的地址index
      userAddressId: "", //收货地址id
      positionName: '',
      content: '',
      isIphoneX: false,
      userInfo: null,
      longitude:'',
      latitude:'',
      provinceName:'',
      cityName:''
    }
    break;
}

App({
  onLaunch: function() {

  },
  onError: function(err) {
    /**
     * 监测错误并上报
     */
  },
  globalData: config,

})