// pages/reservations_list/reservations_list.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loadMore: false,
        reservations_list: [],
        pageNum: 1,
        pageSize: 10,
        IMG: app.IMG
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        _this = this;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if(app.globalData.userId){
            _this.userTakeNumberListFn();
        }
        
        _this.setData({
            pageNum: 0,
            reservations_list: []
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        _this.userTakeNumberListFn();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 取号列表
     */
    userTakeNumberListFn: function () {
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/user-reserve-tables`, {
            userId: app.globalData.userId,
            pageNum: _this.data.pageNum,
            type: '',
            pageSize: _this.data.pageSize
        }).then((res) => {
            let result = res.records;
            console.log(result);
            let loadMore;
            let reservations_list = _this.data.reservations_list;
            if (result.length == 0) {
                loadMore = false;
            } else {
                loadMore = true;
            }
            result.forEach((item, i) => {
                item.shop_name = item.shop_name.length > 5 ? item.shop_name.substring(0, 5) + '...' : item.shop_name
                switch (item.type) {
                    case 1:
                        item.type_text = "预定成功";
                        break;
                    case 2:
                        item.type_text = "已入座";
                        break;
                    case 3:
                        item.type_text = "取消";
                        break;
                    case 4:
                        item.type_text = "已完成";
                        break;
                }
                // let seats = item.seat_name.split(',');
                // item.seats = '';
                // seats.forEach((seat, k)=>{
                //     item.seats += `餐桌${seat}`;
                // })
            });
            reservations_list = reservations_list.concat(result);
            _this.setData({
                reservations_list: reservations_list,
                loadMore: loadMore
            })
        })
    },
    bindPhoneCbFn: () => {
        // _this.userTakeNumberListFn();
    },
})