// pages/user/user.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let systemInfo = wx.getSystemInfoSync();

let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sum: '', //账户余额
        userId: "",
        info: {},
        IMG: "",
        username: "",
        avatarUrl: "",
        tab_top: 480,
        showButton: false, //点击头像按钮
        portraitUrl1: '', //与用户app统一的头像
        nickName1: '', //与用户app统一的昵称
        isGeneralizer:'',
        screenHeight:'', //屏幕高度
        phoneShow: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.shopId) {
            wx.setStorage({
                key: 'olb_shopId',
                data: options.shopId,
            })
        }
        _this = this;
        this.setData({
            userId: app.globalData.userId,
            IMG: api.IMG,
            isGeneralizer:app.globalData.isGeneralizer
        })
        wx.getSystemInfo({
            success(res) {
              
                
                _this.setData({
                    // screenHeight: res.screenHeight,
                    tab_top: res.windowHeight - 100
                })
                console.log('res.windowHeight', _this.data.tab_top)

                // _this.data.tab_top = res.screenHeight-10
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      if (!app.globalData.userId || app.globalData.userId == '') {
        _this.setData({
          phoneShow: true
        });
      } else {
        _this.bindPhoneCbFn()
      }

    },

    /**
     * 账户余额
     */
    getBalanceFn: () => {   
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/account/balance`, {
            userId: app.globalData.userId
        }, true, true).then((res) => {
            _this.setData({
                sum: parseFloat(res.balance).toFixed(3)
            })
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let shopId = app.globalData.shopId;
        return {
            title: '淘上品',
            // path: '/pages/index/index? agencyId=f29c019a22b3404f8d6c3ad2e7d04129 '
            path: '/pages/shop/page/index/index?shopId=' + shopId
        }

    },

    bindPhoneCbFn: () => {
        _this.getBalanceFn();
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh()
    }
})