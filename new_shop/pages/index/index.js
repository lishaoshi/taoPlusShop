//index.js
import index from '../../api/index.js'
let indexMedel = new index()
//获取应用实例
const app = getApp()
let userId = app.globalData.userId
let shopId = app.globalData.shopId

Page({
  data: {
    type: '休息中',
    price: '22.5',
    userAuth: true,
    iconList: [
      {
        img: '../../images/customer.svg',
        title:'足迹',
        count: 0
      },
      {
        img: '../../images/colle.svg',
        title: '收藏',
        count: 0
      },
      {
        img: '../../images/money.svg',
        title: '分红数',
        count: 0
      }
    ],
    businessList: [
      {
        img: '../../images/confirm.png',
        title: '核销',
        note: '核销订单',
        navigate_url: '/pages/verify/index'
      },
      {
        img: '../../images/confirm.png',
        title: '拼团',
        note: '添加拼团',
        navigate_url: '/pages/spellGroup/index'
      },
      {
        img: '../../images/confirm.png',
        title: '商品管理',
        note: '商品的编辑新增'
      },
      {
        img: '../../images/confirm.png',
        title: '店铺管理',
        note: '店铺资料已经完善'
      },
      {
        img: '../../images/confirm.png',
        title: '订单管理',
        note: '我的订单数'
      },
      {
        img: '../../images/confirm.png',
        title: '客户管理',
        note: '管理我的客户'
      },
      {
        img: '../../images/confirm.png',
        title: '财务管理',
        note: '我的财务管理'
      },
      {
        img: '../../images/confirm.png',
        title: '收款码',
        note: '扫码向我付钱'
      },
      {
        img: '../../images/confirm.png',
        title: '新手手册',
        note: '了解平台功能'
      },
      {
        img: '../../images/confirm.png',
        title: '预定管理',
        note: '客户预约管理'
      },
      {
        img: '../../images/confirm.png',
        title: '小程序',
        note: '小程序分享码'
      },
      {
        img: '../../images/confirm.png',
        title: '轮播图',
        note: '小程序轮播图'
      }
    ]
  },
  onLoad: function () {
    this.isUserAuth()
    // console.log(app)
    this.getUserLocaltion()
    this._getBusinissInfo()
    this._getShopBalance()
  },

  // 获取商家账户余额
  _getShopBalance() {
    let data = {
      shopId: shopId
    }
    indexMedel.getShopBalance(data).then(res=>{
      this.setData({
        price: res.result
      })
    })
  },

  // 点击跳转相应模块
  goTarget(e) {
    console.log(e)
    let url = e.currentTarget.dataset.url
    if(!url) {
      return
    }
    wx.navigateTo({
      url: url,
    })
  },

  // 获取商家营业数据（今日收益、浏览人数、订单数、点评数、收藏数）
  _getBusinissInfo() {
    let data = {
      shopId: shopId
    }
    indexMedel.getBusinissInfo(data).then(res=>{
      // this.data.iconList.forEach((item, index, arr)=>{
      for (let i = 0; i < this.data.iconList.length;i++) {
        let key = `iconList[${i}].count`
        // key =
        if(i==0) {
          this.setData({
            [key]: res.result.see_count
          })
        } else if(i==1) {
          this.setData({
            [key]: res.result.collect_count
          })
        } else {
          this.setData({
            [key]: res.result.evaluate_man
          })
        }
       }
      // console.log(this.data)
    })
   
  },
  // 设置商家营业状态
  _setShopWorkStatus(flag) {
    let data = {
      userId: userId,
      shopId: shopId,
      workStatus: flag?1:2
    }
    indexMedel.setShopWorkStatus(data)
  },
  // 用户授权获取地理位置
  getUserLocaltion() {
    wx.getLocation({
      type: 'wgs84',
      success:(res)=>{
        // console.log(res)
      }
    })
  },

  // 控制营业状态
  changSwitch(e) {
    console.log(e)
    const flag = e.detail.value
    let type = flag?'营业中':'休息中'
    this.setData({
      type
    })
    this._setShopWorkStatus(flag)
  },
// 判断用户是否授权获取用户信息
  isUserAuth() {
    wx.getSetting({
      success: res => {
        // 未授权
        if (!res.authSetting['scope.userInfo']) {
          // wx.hideTabBar()
          this.setData({
            userAuth: false
          })
        }
      }
    })
  },
  // 进入选择地图
  goChooseMap() {
    // 这是选择地图页
      // 地图选择
      wx.chooseLocation({
        success: function (res) {
          // success
          console.log(res, "location")
          console.log(res.name)
          console.log(res.latitude)
          console.log(res.longitude)
          wx.navigateBack()
        },
        // fail: function () {
        //   // fail
        // },
        complete: function () {
          // complete
        }
      })
  },
  // 用户授权回调
  callbackGetUserInfo(e) {
    // console.log(e)
    if (e.detail.iv) {
      // console.log('授权')
      // 获取用户微信信息
      app.getUserInfo();
      // wx.showTabBar();
      this.setData({
        userAuth: true,
      })
    }
  },

  // 前往商家详情
  queryShopDetail() {
    wx.navigateTo({
      url: '/pages/myInfo/index',
    })
  }
})