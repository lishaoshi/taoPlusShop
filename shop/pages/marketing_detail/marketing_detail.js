// pages/order_detail/order_detail.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // orderId: '',
        groupons_id: '',
        // goodsId: '',
        shopId: '',
        goodsInfo: {},
        shopInfo: {},
        couponInfo: {},
        groupons: undefined,
        grouponPrice: '',
        show_button: false, //判断是否显示团购按钮
        orderStatus: '',
        groupUser: '',
        info: '',
        commanderList: '',
        timeList: '',
        IMG: app.globalData.IMG,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        _this.setData({
            shopId: app.globalData.shopId,
            groupons_id: options.groupons_id,
            // goodsId: options.goodsId,
            // orderStatus: options.orderStatus
        });
        console.log('groupons_id', _this.data.groupons_id)
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        clearInterval(_this.data.timeList.Interval);
        _this.data.timeList.Interval = null;
    },
    bindPhoneCbFn: () => {
        _this.show_button = false;
        _this.getShopInfoFn();
        _this.getGrouponsDetailFn();
    },

    /**
     * 用户点击分享
     */
    onShareAppMessage: function() {
        return {
            title: '我发起了拼团购买' + _this.data.goodsInfo.goodsName,
            path: `/pages/share_detail/share_detail?goodsId=${_this.data.goodsInfo.goodsId}&grouponsId=${_this.data.groupons_id}&shopId=${app.globalData.shopId}&type=order&price=${_this.data.goodsInfo.grouponPrice}`,
            imageUrl: _this.data.goodsInfo.path
        }
    },

    getGrouponsDetailFn: () => {
        utils.uGet(`${api.HOST}/api/groupons/${_this.data.groupons_id}/invite/promoter`, {}, true, true).then((res) => {
            _this.data.groupUser = [];
            _this.data.commanderList = {};
            if (!res.groupOrderInfo.described) {
                res.groupOrderInfo.described = '好'
            }
            res.groupOrderInfo.path = utils.getDefaultImg(res.groupOrderInfo.path, '')
            if (res.groupUser) {
                res.groupUser.forEach((item,i)=>{
                    item.portrait_url = utils.inspectPic(item.portrait_url)
                })
            }
            _this.data.groupUser = res.groupUser;
            res.groupUserList.portrait_url = utils.inspectPic(res.groupUserList.portrait_src)
            _this.data.commanderList = res.groupUserList;
            let leaveMoney = utils.round((res.groupOrderInfo.shopPrice - res.groupOrderInfo.grouponPrice), 2)
            if (res) {
                _this.setData({
                    shareImg: res.groupOrderInfo.path
                })
            }
            let endTime = utils.parserDate(res.groupOrderInfo.endTime).getTime();
            // let endTime = new Date(res.groupOrderInfo.endTime).getTime();
            let date = new Date();
            let nowTime = date.getTime();
            _this.setData({
                goodsInfo: res.groupOrderInfo,
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
        // let endTime = utils.parserDate(arr.endTime).getTime();
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
    /**
     * 商家详情
     */
    getShopInfoFn: () => {
        utils.uGet(`${api.HOST}/api/shop/${app.globalData.shopId}/shop`).then((res) => {
            if ((!res.address || res.address == 'undefined') && (!res.map_flag || res.map_flag == 'undefined')) {
                res.address = "该商家暂未提供地址";
            } else {
                res.address = res.address == null ? '' : res.province_name + res.city_name + res.area_name + res.address;
                res.map_flag = res.map_flag == null ? '' : res.map_flag;
                res.map_flag += res.address;
            }
            _this.setData({
                shopInfo: res
            })
        })
    },

    imgErrorFn: (e) => {
        utils.imgErrorFn(_this, e);
    },
    callPhoneFn: () => {
        if (_this.data.shopInfo.mobile) {
            wx.makePhoneCall({
                phoneNumber: _this.data.shopInfo.mobile
            })
        } else {
            utils.errorShow('该商家没有电话');
        }
    },

    showPicFn: () => {
        wx.previewImage({
            urls: [_this.data.couponInfo.coupon_code_url]
        })
    },
})