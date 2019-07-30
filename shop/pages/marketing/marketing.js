// pages/marketing/marketing.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let pageNum = 1,
    pageSize = 6;
let _this;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bar: ['全部', '进行中', '已成团', '未成团'],
        orderStatus: ['', 2, 5, 3],
        barIndex: 0,
        orderList: [], //订单列表
        noMore: '',
        grouponList: '',
        timeList: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
        _this.setData({
            barIndex: 0,
        })
        _this.getOrderlistFn();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        let orderList = _this.data.orderList;
        if (orderList) {
            orderList.forEach((item, i) => {
                clearInterval(item.Interval);
                item.Interval = null;
            });
        }
        _this.setData({
            orderList: orderList
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    /**
     * 团购列表
     */
    getOrderlistFn: function() {
        utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/items`, {
            shopId: app.globalData.shopId,
            type: _this.data.orderStatus[_this.data.barIndex],
            pageNum: pageNum,
            pageSize: pageSize,
        }, true, true).then((res) => {
            let result = res;
            let noMore;
            if (result.length === 0) {
                noMore = true;
            } else {
                noMore = false;
                let orderList = _this.data.orderList;
                result.forEach((item, i) => {
                    if (item.type === 1) {
                        item.type = '未开始'
                    } else if (item.type === 2) {
                        item.type = '进行中'
                    } else if (item.type === 3) {
                        item.type = '已结束'
                    } else if (item.type === 4) {
                        item.type = '已弃用'
                    } else if (item.type === 5) {
                        item.type = '已满员'
                    }
                })
                orderList = orderList.concat(result);
                _this.setData({
                    orderList: orderList,
                })
                console.log('进来2', _this.data.orderStatus[_this.data.barIndex])
                if (_this.data.orderStatus[_this.data.barIndex] === 2 || _this.data.orderStatus[_this.data.barIndex] === '') {
                    _this.startIntervalFn(orderList);
                }
            }
            _this.setData({
                noMore: noMore
            })
        })
    },
    /**
     * 拼团倒计时
     */
    startIntervalFn: (arr) => {
        arr.forEach((item, i) => {
            item.end_time = item.end_time.replace(/-/g, '/');
            let endTime = new Date(item.end_time).getTime();
            // let endTime = utils.parserDate(item.end_time).getTime();
            let timeStr = '';
            item.over = false;
            item.Interval = setInterval(() => {
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
                    item.timeStr = timeStr;
                    _this.setData({
                        timeList: arr
                    })
                } else {
                    clearInterval(item.Interval);
                    item.Interval = null;
                    item.timeStr = '00:00:00';
                    item.over = true;
                    _this.setData({
                        timeList: arr
                    })
                }

            }, 1000);

        })
    },
    bindPhoneCbFn: () => {
        _this.getOrderlistFn();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (!_this.data.noMore) {
            pageNum++;
            _this.getOrderlistFn();
        }
    },
    /**
     * 切换
     */
    changeBarFn: (e) => {
        let index = e.currentTarget.dataset.index;
        pageNum = 1;
        _this.setData({
            barIndex: index,
            orderList: []
        });
        _this.getOrderlistFn();
    },
})