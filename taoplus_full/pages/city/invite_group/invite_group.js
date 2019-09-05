// pages/invite_group/invite_group.js
const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;
let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: '',
        goodsName: '',
        info: {},
        groupUser: [],
        leaveMoney: '',
        commanderList: {},
        grouponJson: '',
        shareImg: '',
        timer: '', //定时器的名称
        hhh: '00',
        mmm: '00',
        sss: '00',
        countDownTime: '00:00:10',
        Interval: null,
        timeList: {},
        endTime:'',
        nowTime:'',
        phoneShow: false,
        // IMG: app.globalData.IMG,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        let grouponJson = '';
        if (options.grouponJson) {
            grouponJson = JSON.parse(options.grouponJson);
        }
        _this.setData({
            orderId: options.orderId,
            goodsName: options.goodsName,
            grouponJson: grouponJson
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        if (this.data.grouponJson) {
            this.getGoodsDetailFn();
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        clearInterval(_this.data.timeList.Interval);
        _this.data.timeList.Interval = null;
        wx.switchTab({
            url: '/pages/city/index/index'
        })
    },

    /**
     * 用户点击右上角分享
     * 
     */
    onShareAppMessage: function() {
        console.log('app.globalData.agencyId' + app.globalData.agencyId)
            return {
                title: '我发起了拼团购买' + _this.data.goodsName,
                path: `/pages/share_detail/share_detail?goodsId=${_this.data.grouponJson.goodsId}&grouponsId=${_this.data.grouponJson.grouponsId}&agencyId=${app.globalData.agencyId}&shopId=${_this.data.grouponJson.shopId}&type=${_this.data.grouponJson.type}&price=${_this.data.grouponJson.grouponPrice}&orderId=${_this.data.orderId}`,
                imageUrl: _this.data.shareImg
            }
    },

    // getCouponFn: () => {
    //     utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/order/${_this.data.orderId}/succeed`, {}).then((res) => {
    //         console.log(res);
    //         res.coupon_code = utils.bankCardStr(res.coupon_code);
    //         res.coupon_code_url = api.IMG + res.coupon_code_url;
    //         _this.setData({
    //             info: res
    //         })
    //     })
    // },

    /**
     * 获取商品详情
     */
    // getGoodsDetailFn: () => {
    //     utils.uGet(`${api.HOST}/api/shop/item/${_this.data.grouponJson.goodsId}`, {
    //         goodsId: _this.data.grouponJson.goodsId,
    //         userId: app.globalData.userId,
    //         type: 0 //类型:1-商家 0-商品
    //     }, true, true).then((res) => {
    //         console.log('获取商家详情',res);
    //         let imgAry = res.path.split(',');
    //         let banner = utils.getDefaultImg(imgAry, '');

    //         if (res) {
    //             _this.setData({
    //                 shareImg: banner[0]
    //             })
    //         }
    //     })
    // },
    getGoodsDetailFn: () => {
        utils.uGet(`${api.HOST}/api/groupons/${_this.data.orderId}/invite`, {}, true, true).then((res) => {
            _this.data.groupUser = [];
            _this.data.commanderList = {};
            if (!res.groupOrderInfo.described) {
                res.groupOrderInfo.described = '好'
            }
            res.groupOrderInfo.path = utils.getDefaultImg(res.groupOrderInfo.path, '')
            res.groupUser.forEach((item, index) => {
                item.portrait_url = utils.inspectPic(item.portrait_url)
                if (item.is_head === 1) {
                    _this.data.commanderList = item
                    
                } else {
                    _this.data.groupUser.push(item)
                }
            })
            let leaveMoney = utils.round((res.groupOrderInfo.shopPrice - res.groupOrderInfo.grouponPrice), 2)
            if (res) {
                _this.setData({
                    shareImg: res.groupOrderInfo.path
                })
            }
            // let endTime = new Date(res.groupOrderInfo.endTime).getTime();
            let endTime = utils.parserDate(res.groupOrderInfo.endTime).getTime();
            let date = new Date();
            let nowTime = date.getTime();
            _this.setData({
                info: res.groupOrderInfo,
                groupUser: _this.data.groupUser,
                leaveMoney: leaveMoney,
                commanderList: _this.data.commanderList,
                endTime: endTime,
                nowTime: nowTime,
            })
            _this.startIntervalFn(res.groupOrderInfo);  
        })
    },
    //拼团倒计时
    startIntervalFn: (arr) => {
        arr.endTime = arr.endTime.replace(/-/g, '/');
        let endTime = new Date(arr.endTime).getTime();
        let timeStr = '';
        arr.Interval = setInterval(() => {
            //获取当前时间  
            let date = new Date();
            let now = date.getTime();
            //时间差  
            let leftTime = endTime - now;
            let hhh, mmm, sss; //定义变量 d,h,m,s保存倒计时的时间  
            if (leftTime >= 0) {
                hhh = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                mmm = Math.floor(leftTime / 1000 / 60 % 60);
                sss = Math.floor(leftTime / 1000 % 60);
                hhh = hhh < 10 ? '0' + hhh : hhh;
                mmm = mmm < 10 ? '0' + mmm : mmm;
                sss = sss < 10 ? '0' + sss : sss;
                timeStr = `${hhh}:${mmm}:${sss}`;
                arr.timeStr = timeStr;
                _this.setData({
                    timeList: arr
                })
            } else {
                clearInterval(arr.Interval);
                arr.Interval = null;
                arr.timeStr = '00:00:00';
                arr.over = true;
                _this.setData({
                    timeList: arr
                })
            }

        }, 1000);
    },
    bindPhoneCbFn: () => {
        // _this.getCouponFn();
    },
    goIndex: function () {
        wx.switchTab({
            url: '../index/index'
        })
    },
})