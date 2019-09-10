// pages/pay/pay.js
const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;
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
        Interval: null,
        money: '',
        goodsName: '',
        orderId: '',
        shopId: '',
        grouponJson: '',
        type: [],
        shopName:'',//店铺名字
        phoneShow: false,
        isShow: true,
        sum:0,
        balancePrice:'',
        disabled:false,
        isUser: false,
        combine_pay_flag: '3',//支付类型，1、组合支付 2、余额支付 3、微信支付
        combineType: '9' //所在平台，8、商家小程序  9 商圈小程序   10 平台小程序    
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        console.log(options.type)
        // _this.countDownFn();
        _this.setData({
            money: options.money,
            goodsName: options.goodsName,
            orderId: options.orderId,
            shopId: options.shopId,
            grouponJson: options.grouponJson,
            type: options.type,
            shopName: options.shopName,
        });
        
    },

    bindPhoneCbFn: () => {
        _this.getCountDownFn();
        _this.getBalanceFn();
        _this.comparePriceFn();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        if (!app.globalData.userId || app.globalData.userId == '') {
            _this.setData({
                phoneShow: true
            });
        } else {
            _this.getCountDownFn();
            _this.getBalanceFn();
        }

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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
            if (res.balance == 0 || res.balance >= shopPrice  ){
                    _this.setData({
                        isUser: true
                    })
                }else{
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
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        _this.setData({
            combine_pay_flag: e.detail.value
        })
        if (e.detail.value == 2){            
                _this.setData({
                    balancePrice: _this.data.money
                })
            }                                       
        if (e.detail.value == 1){
            _this.setData({
                balancePrice: _this.data.sum
            })  
        }
        
        
        
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
                              url: '/pages/district/index/index'
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
        clearInterval(_this.data.Interval);
        utils.uPost(api.pay, {
            orderId: _this.data.orderId,
            shopId: _this.data.shopId,
            userId: app.globalData.userId,
            actualPrice: _this.data.money,
            payType: 1, //支付类型：1、微信 2、支付宝
            shopName: _this.data.shopName,
            openId: app.globalData.openid,
            combine_pay_flag: _this.data.combine_pay_flag,
            type: _this.data.combineType,
            balancePrice: _this.data.balancePrice
        }).then((res) => {
            
            if (res.combine_pay_flag === '1'){
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
                console.log();
                // let all_pay = JSON.parse(res.pay_info)  
                // let pay_info = JSON.parse(all_pay.payInfo);
                
                // wx.requestPayment({
                //     'timeStamp': pay_info.timeStamp,
                //     'nonceStr': pay_info.nonceStr,
                //   'package': pay_info.wxPackage, //wxPackage测试环境用
                //     'signType': pay_info.signType,
                //     'paySign': pay_info.paySign,
                //   'appId': 'wx2d3af38435132b06',
              let pay_info = JSON.parse(res.pay_info);
              console.log(pay_info);
              wx.requestPayment({
                'timeStamp': pay_info.timeStamp,
                'nonceStr': pay_info.nonceStr,
                'package': pay_info.package,
                'signType': pay_info.signType,
                'paySign': pay_info.paySign,
                'appId': 'wx2d3af38435132b06',
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
                        utils.errorShow('支付失败'+JSON.stringify(res));
                    }
                })

            }
            
           
        })
        // wx.redirectTo({
        //     url: '../order_success/order_success'
        // })
    }
})