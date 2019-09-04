//index.js
import index from '../../api/index.js'
let indexMedel = new index()
import { showToast } from '../../utils/util.js'
import config from '../../config.js'
import shopPayBalance from '../../api/shopPayBalance.js'
let shopPayBalanceModel = new shopPayBalance()
//获取应用实例
const app = getApp()
// let userId = app.globalData.userId
// let shopId = app.globalData.shopId

Page({
  data: {
    type: '休息中',
    price: null,
    userAuth: true,
    shopInPrice: 0,
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
        navigate_url: '/pages/verify/index',
        left: false,
        top:false,
        right: true,
        bottom: true
      },
      {
        img: '../../images/confirm.png',
        title: '拼团',
        note: '添加拼团',
        navigate_url: '/pages/spellGroup/index',
        left: true,
        top: false,
        right: true,
        bottom: true
      },
      {
        img: '../../images/confirm.png',
        title: '商品管理',
        note: '商品的编辑新增',
        navigate_url: '/pages/goodsMng/index',
        left: true,
        top: false,
        right: false,
        bottom: true
      },
      {
        img: '../../images/confirm.png',
        title: '店铺管理',
        navigate_url: '/pages/shopMng/index',
        note: '店铺资料已经完善',
        left: false,
        top: true,
        right: true,
        bottom: true
      },
      {
        img: '../../images/confirm.png',
        title: '订单管理',
        note: '我的订单数',
        navigate_url: '/pages/orderMng/index',
        left: true,
        top: true,
        right: true,
        bottom: true
      },
      {
        img: '../../images/confirm.png',
        title: '客户管理',
        note: '管理我的客户',
        navigate_url: '/pages/customerMng/index',
        left: true,
        top: true,
        right: false,
        bottom: true
      },
      {
        img: '../../images/confirm.png',
        title: '财务管理',
        note: '我的财务管理',
        navigate_url: '/pages/financial/index',
        left: false,
        top: true,
        right: true,
        bottom: true
      },
      {
        img: '../../images/confirm.png',
        title: '收款码', 
        note: '扫码向我付钱',
        navigate_url: '/pages/receiptCode/index',
        left: true,
        top: true,
        right: true,
        bottom: true
      },
      {
        img: '../../images/confirm.png',
        title: '新手手册',
        note: '了解平台功能',
        navigate_url: '/pages/newProple/index',
        left: true,
        top: true,
        right: false, 
        bottom: true
      },
      {
        img: '../../images/confirm.png',
        title: '预定管理',
        note: '客户预约管理',
        navigate_url: '/pages/appointment/index',
        left: false,
        top: true,
        right: true,
        bottom: false
      },
      {
        img: '../../images/confirm.png',
        title: '小程序',
        note: '小程序分享码', 
        navigate_url: '/pages/myProgram/index',
        left: true,
        top: true,
        right: true,
        bottom: false
      },
      {
        img: '../../images/confirm.png',
        title: '轮播图',
        note: '小程序轮播图',
        navigate_url: '/pages/banner/banner',
        left: true,
        top: true,
        right: false,
        bottom: true
      },
      {
        img: '../../images/confirm.png',
        title: '优惠券管理',
        note: '商品优惠券',
        navigate_url: '/pages/coupon/index',
        left: false,
        top: true,
        right: true,
        bottom: false
      },
      {
        img: '../../images/confirm.png',
        title: '红包管理',
        note: '设置红包',
        navigate_url: '/pages/redBag/index',
        left: true,
        top: true,
        right: true,
        bottom: false
      },
      
    ],
    shopName: '',
    imgSrc: '',
    isHidden: false,
    status: false,
    examineStatus: 1
  },
  onLoad: function () {
    // console.log(app)
    app.getStorage()
    this.isUserAuth()
    // this._getBusinissInfo()
    this._getShopInfo()
    // this._getShopPayAmount()
  },

  // 前往账户明细
  queryAccount() {
    if (!app.globalData.isPay) {
      wx.showModal({
        title: '提示',
        content: '请先支付入驻金额',
        success: (res) => {
          if (res.confirm) {
            this.confirmPay()
          }
        }
      })
      return
    }
    wx.navigateTo({
      url: '/pages/account/index',
    })
  },

  // // 获取商家账户余额
  // _getShopBalance() {
  //   let data = {
  //     shopId: shopId
  //   }
  //   indexMedel.getShopBalance(data).then(res=>{
  //     this.setData({
  //       price: res.result
  //     })
  //   })
  // },

  // 点击跳转相应模块
  goTarget(e) {
    // console.log(e)
    let url = e.currentTarget.dataset.url
    if(!url) {
      return
    }
    if(!app.globalData.isPay) {
      wx.showModal({
        title: '提示',
        content: '请先支付入驻金额',
        success:(res)=>{
          if(res.confirm) {
            this.confirmPay()
          }
        }
      })
      return
    }
    // if(!app.globalData.isPay)
    if (this.data.examineStatus != 2 && url !='/pages/shopMng/index') {
      showToast('请到店铺管理完善信息并等候审核')
      return
    }
    wx.navigateTo({
      url: url,
    })
  },

  // 获取商家营业数据（今日收益、浏览人数、订单数、点评数、收藏数）
  // _getBusinissInfo() {
  //   let data = {
  //     shopId: app.globalData.shopId
  //   }
  //   indexMedel.getBusinissInfo(data).then(res=>{
  //     // this.data.iconList.forEach((item, index, arr)=>{
  //       if(res.code==1000) {
  //         wx.reLaunch({
  //           url: '/pages/login/login',
  //         })
  //         return
  //       }
  //     let key = `iconList[0].count`
  //       this.setData({
  //         price: res.result.balance,
  //         [key]: res.result.see_count
  //       })
  //     // for (let i = 0; i < this.data.iconList.length;i++) {
  //     //   let key = `iconList[${i}].count`
  //     //   // key =
  //     //   if(i==0) {
  //     //     this.setData({
  //     //       [key]: res.result.see_count
  //     //     })
  //     //   } else if(i==1) {
  //     //     this.setData({
  //     //       [key]: res.result.collect_count
  //     //     })
  //     //   } else {
  //     //     this.setData({
  //     //       [key]: res.result.evaluate_man
  //     //     })
  //     //   }
  //     //  }
  //   })
  // },
  // 设置商家营业状态
  _setShopWorkStatus(flag) {
    let data = {
      userId: app.globalData.userId,
      shopId: app.globalData.shopId,
      workStatus: flag?1:2
    }
    // console.log(data)
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

  // 获取商家入驻价格
  _getShopPayAmount() {
    console.log('get')
    shopPayBalanceModel.getShopPayAmount({}).then(res => {
      this.setData({
        shopInPrice: res.value
      })
    })
  },

  // 确认支付
  confirmPay() {
    // console.log('comfrimPay')
    // return
    let data = {
      shopId: app.globalData.shopId,
      price: this.data.shopInPrice,
      openId: app.globalData.openId
    }
    shopPayBalanceModel.confirmPay(data).then(res=>{
      let data = JSON.parse(res.pay_info)
      console.log(data)
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success:(res)=>{
          // console.log(res)
          showToast('支付成功')
          app.globalData.isPay = true
          this._getShopInfo()
        },
        fail:(err)=>{
          showToast('取消支付')
        }
      })
    })
  },

  // 隐藏今日收益
  priceHidden() {
    console.log('隐藏')
      this.setData({
        isHidden:!this.data.isHidden
      })
  },

  // 获取商家信息
  _getShopInfo() {
    let data = {
      shopId: app.globalData.shopId
    }
    indexMedel.getShopInfo(data).then(res=>{
      if (res.code == 1000) {
        wx.reLaunch({
          url: '/pages/login/login',
        })
        return
      }
      this.setData({
        examineStatus: res.result.examine_status
      })
      wx.setStorageSync('shopInfo', res.result)
      if (res.result.examine_status!=2 ) {   //未支付
        this._getShopPayAmount()
        app.globalData.isPay = false
        // console.log(app)
      }
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
            [key]: res.result.bonus_count
          })
        }
       }
      this.setData({
        shopName: res.result.shop_name,
        imgSrc: `${config.IMG}${res.result.portrait_url}`,
        status: res.result.work_status==1?true:false,
        type: res.result.work_status == 1 ? '营业中' : '休息中',
        price: res.result.newTime
      })
    })
  },

  // 控制营业状态
  changSwitch(e) {
    console.log(e)
    if (!app.globalData.isPay) {
      wx.showModal({
        title: '提示',
        content: '请先支付入驻金额',
        success: (res) => {
          if (res.confirm) {
            this.confirmPay()
          }
        }
      })
      return
    }
    // console.log(e)
    const flag = e.detail.value
    let type = flag?'营业中':'休息中'
    this.setData({
      type
    })
    this._setShopWorkStatus(flag)
  },
  tabSwitch() { 
    console.log('tab')
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
    if (!app.globalData.isPay) {
      wx.showModal({
        title: '提示',
        content: '请先支付入驻金额',
        success: (res) => {
          if (res.confirm) {
            this.confirmPay()
          }
        }
      })
      return
    }
    wx.navigateTo({
      url: '/pages/shopInfo/shopInfo',
    })
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function (e) {
    // console.log(e)
    this.isUserAuth()
    // console.log(app)
    // this.getUserLocaltion()
    // this._getBusinissInfo()
    this._getShopInfo()
  },
})
