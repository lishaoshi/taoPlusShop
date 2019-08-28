// pages/pay/pay.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        timer: '', //定时器的名称
        hhh: '00',
        mmm: '00',
        sss: '00',
        countDownTime: '00:00:10',
        phoneShow: false,
        Interval: null,
        money: '',
        goodsName: '',
        orderId: '',
        shopId: '',
        grouponJson: '',
        type: [],
        shopName:'',//店铺名字
        carMoney:'', //购物车选择的商品总价
        sum: 0,
        combine_pay_flag: '3',//支付类型，1、组合支付 2、余额支付 3、微信支付
        combineType: '8', //所在平台，8、商家小程序  9 商圈小程序   10 平台小程序    
        balancePrice:''
    }, 


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        // _this.countDownFn();
        let money;
        if (options.carMoney){
            money = options.carMoney
           
        }else{
            money = options.money;
        }
        _this.setData({
            money: money,
            goodsName: options.goodsName,
            orderId: options.orderId,
            shopId: options.shopId,
            grouponJson: options.grouponJson,
            type: options.type,
            shopName: options.shopName,
        });
        console.log('money', _this.data.money)
        
        if (!app.globalData.userId || app.globalData.userId == '') {
            _this.setData({
                phoneShow: true
            });
        } else {
            _this.bindPhoneCbFn()
          _this.getBalanceFn();
        }

    },

    bindPhoneCbFn: () => {
         _this.getCountDownFn();
    },
   
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        clearInterval(_this.data.Interval);
    },
    getCountDownFn: () => {
        utils.uGet(`${api.HOST}/api/order/${app.globalData.userId}/order-count-down/${_this.data.orderId}`).then((res) => {
            console.log(res);
            _this.setData({
                countDownTime: res.time
            });
            _this.countDownFn();
        })
    },
  
  //获取账户余额
  getBalanceFn: () => {
    utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/account/balance`, {
      userId: app.globalData.userId
    }, true, true).then((res) => {
      console.log(res);
      wx.stopPullDownRefresh();
      _this.setData({
        sum: parseFloat(res.balance).toFixed(3)
      })
      let shopPrice = _this.data.money;

      //组合支付可用条件
      if (res.balance == 0 || res.balance >= shopPrice) {
            _this.setData({
            isUser: true
            })
      } else {
            _this.setData({
            isUser: false
            })
      }
      //余额支付可用条件
      if (res.balance < shopPrice) {
            _this.setData({
            disabled: true
            })
      } else {
            _this.setData({
            disabled: false
            })
      }
    })

  },

  radioChange(e) {

    console.log(e)
    _this.setData({
      combine_pay_flag: e.detail.value
    })
    if (e.detail.value == 2) {
      _this.setData({
        balancePrice: _this.data.money
      })
    }
    if (e.detail.value == 1) {
      _this.setData({
        balancePrice: _this.data.sum
      })
    }



  },

    /**
     * 倒计时
     */
    countDownFn: () => {

        //设置截止时间  
        let end = _this.data.countDownTime;

        let Interval = setInterval(() => {
            //获取当前时间  
            let date = new Date();
            let now = date.getTime();
            //时间差  
            let leftTime = end - now;
            let hhh, mmm, sss; //定义变量 d,h,m,s保存倒计时的时间  
            if (leftTime >= 0) {
                hhh = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                mmm = Math.floor(leftTime / 1000 / 60 % 60);
                sss = Math.floor(leftTime / 1000 % 60);
                hhh = hhh < 10 ? '0' + hhh : hhh;
                mmm = mmm < 10 ? '0' + mmm : mmm;
                sss = sss < 10 ? '0' + sss : sss;
                _this.setData({
                    hhh: hhh,
                    mmm: mmm,
                    sss: sss
                })
            } else {
                clearInterval(Interval);
                wx.showModal({
                    title: '支付提示',
                    content: '是否继续支付?',
                    success: function(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            _this.countDownFn();
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                            wx.switchTab({
                                url: '/pages/index/index'
                            })
                        }
                    }
                })
            }
        }, 1000)
        _this.setData({
            Interval: Interval
        })



    },
    /**
     * 支付函数
     */
    payFn: () => {
        console.log('res', _this.data.orderId, _this.data.shopId, app.globalData.userId, _this.data.money, _this.data.shopName, app.globalData.openId)
        clearInterval(_this.data.Interval);
        utils.uPost(api.userAddOrder, {
            orderId: _this.data.orderId,
            shopId: _this.data.shopId,
            userId: app.globalData.userId,
            actualPrice: _this.data.money,
            combine_pay_flag: _this.data.combine_pay_flag,
            payType: 1, //支付类型：1、微信 2、支付宝
            shopName: _this.data.shopName,
            openId: app.globalData.openId,
            type: _this.data.combineType,
            balancePrice: _this.data.balancePrice
        }).then((res) => {
          if (res.combine_pay_flag === '1') {
                if (_this.data.type === 'normal') {
                setTimeout(() => {
                    wx.showToast({
                    title: '正在生成券码',
                    duration: 3000,
                    success: () => {
                        setTimeout(() => {
                        wx.redirectTo({
                            url: `../order_success/order_success?orderId=${_this.data.orderId}&goodsName=${_this.data.goodsName}&grouponJson=${_this.data.grouponJson}`
                        });
                        }, 3000)

                    }
                    })

                }, 0)
                } else {
                console.log('去付款', _this.data.orderId, _this.data.goodsName, _this.data.grouponJson)
                setTimeout(() => {
                    wx.showToast({
                    title: '邀请好友拼团',
                    duration: 3000,
                    success: () => {
                        setTimeout(() => {
                        wx.redirectTo({
                            url: `../invite_group/invite_group?orderId=${_this.data.orderId}&goodsName=${_this.data.goodsName}&grouponJson=${_this.data.grouponJson}`
                        });
                        }, 3000)

                    }
                    })

                }, 0)
                }
          }else{
            let pay_info = JSON.parse(res.pay_info);
            console.log(pay_info);
            wx.requestPayment({
              'timeStamp': pay_info.timeStamp,
              'nonceStr': pay_info.nonceStr,
              'package': pay_info.package,
              'signType': pay_info.signType,
              'paySign': pay_info.paySign,
              'appId': 'wxfed2470abe61685b',
              'success': function (res) {
                if (_this.data.type === 'normal') {
                  setTimeout(() => {
                    wx.showToast({
                      title: '正在生成券码',
                      duration: 3000,
                      success: () => {
                        setTimeout(() => {
                          wx.redirectTo({
                            url: `../order_success/order_success?orderId=${_this.data.orderId}&goodsName=${_this.data.goodsName}&grouponJson=${_this.data.grouponJson}`
                          });
                        }, 3000)

                      }
                    })

                  }, 0)
                } else {
                  console.log('去付款', _this.data.orderId, _this.data.goodsName, _this.data.grouponJson)
                  setTimeout(() => {
                    wx.showToast({
                      title: '邀请好友拼团',
                      duration: 3000,
                      success: () => {
                        setTimeout(() => {
                          wx.redirectTo({
                            url: `../invite_group/invite_group?orderId=${_this.data.orderId}&goodsName=${_this.data.goodsName}&grouponJson=${_this.data.grouponJson}`
                          });
                        }, 3000)

                      }
                    })

                  }, 0)
                }
              },
              'fail': function (res) {
                console.log('error');
                console.log(res);
                utils.errorShow('支付失败');
              }
            })
          }
            
        })
        // wx.redirectTo({
        //     url: '../order_success/order_success'
        // })
    },
})