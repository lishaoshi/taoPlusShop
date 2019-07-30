// pages/order_list/order_list.js
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
    bar: ['全部', '待付款', '待使用', '退款', '扫码消费'],
    barIndex: 0,
    orderStatus: ['', '1', '3', '99', 'scanpay'],
    orderList: [],
    IMG: api.IMG,
    noMore: false,
    grouponPrice: '',
    grouponsId: '',
    shopName: '',
    phoneShow: false,
    orderType: 1
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        _this = this;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    bindPhoneCbFn: () => {
        console.log('进来')
        _this.getOrderlistFn();
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
        //   _this.setData({
        //       orderList: [],
        //       pageNum:1
        //   });

    },


    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },


    //获取团购信息
    getGrouponsDetailFn: () => {
        utils.uGet(`${api.HOST}/api/groupons/${_this.data.orderId}/invite`, {}, true, true).then((res) => {
            if (res.groupOrderInfo) {
                _this.setData({
                    grouponPrice: res.groupOrderInfo.grouponPrice,
                })
            }
        })
    },
    /**
     * 获取订单团购信息
     */
    getOrderGrouponsInfoFn: () => {
        utils.uGet(`${api.HOST}/api/groupons/info-with-order/${_this.data.orderId}`, {}).then((res) => {
            if (res) {
                _this.setData({
                    grouponsId: res.groupons_id,
                })
            }

        })

    },
    /**
     * 商家详情
     */
    getShopInfoFn: (shopId) => {
        utils.uGet(`${api.HOST}/api/shop/${shopId}/shop`).then((res) => {
            _this.setData({
                shopName: res.shop_name
            })
        })
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

  changeBarFn: (e) => {
    let index = utils.dataSet(e, 'index');
    let orderType = 1
    if (_this.data.orderStatus[index] == 'scanpay') {
      orderType = 2
    }
    _this.setData({
      barIndex: index,
      orderList: [],
      orderType: orderType
    });
    console.log(index)
    pageNum = 1;

    _this.getOrderlistFn();
  },

  getOrderlistFn: () => {
    var requestData = {
      userId: app.globalData.userId,
      order_status: _this.data.orderStatus[_this.data.barIndex],
      status: 1,
      type: _this.data.orderType,
      pageNum: pageNum,
      pageSize: pageSize,
    }

    if (_this.data.orderStatus[_this.data.barIndex] == 'scanpay') {
      requestData.order_status = 4
    }
    
    utils.uGet(`${api.HOST}/api/user/${app.globalData.userId}/orders-v3`, requestData , true, true).then((res) => {
      let result = res;
      let noMore;
      if (result.length == 0) {
        noMore = true;
      } else {
        noMore = false;
        let orderList = _this.data.orderList;
        result.forEach((item, i) => {
          let rep = /^(http|https)/g;
          let matches = rep.exec(item.path);
          let IMG = _this.data.IMG;
          //扫码支付订单
          if (item.payType === 5 || item.type == 2) {
            item.goodsName = '扫码支付订单'
            item.path = 'https://api.olb8.com/template/15233642765accb1b481d89.png';
          } else {
            if (matches) {
              item.path = item.path;
            } else {
              item.path = IMG + item.path;
            }
          }
          if (item.num === null) {
            item.num = 1
          }
          item.originalPrice = parseFloat(item.originalPrice).toFixed(2);
          item.path = item.path;
        })
        orderList = pageNum == 1 ? result : orderList.concat(result);
        for (let i in orderList) {
          if (orderList[i].path.indexOf('.th') === -1) {
            orderList[i].path = orderList[i].path + '.th'
          }
        }
        _this.setData({
          orderList: orderList,
        })
      }

      _this.setData({
        noMore: noMore
      })
    })
  },
  //去付款
  payfor: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      orderId: _this.data.orderList[index].orderId
    })
    Promise.all([
      _this.getOrderGrouponsInfoFn(),
      _this.getGrouponsDetailFn(),
      _this.getShopInfoFn(_this.data.orderList[index].shopId)
    ]).then(function(res) {
      let type;
      console.log('aaa', _this.data.orderList[index].order_type)
      if (_this.data.orderList[index].order_type === 2) {
        type = 'order'
      } else {
        type = 'normal'
      }
      let grouponJson = JSON.stringify({
        goodsId: _this.data.orderList[index].goodsId,
        shopId: _this.data.orderList[index].shopId,
        // type: type,
        grouponPrice: _this.data.grouponPrice || '',
        grouponsId: _this.data.grouponsId
      });
      wx.navigateTo({
        url: `../pay/pay?money=${_this.data.orderList[index].actualPrice}&goodsName=${_this.data.orderList[index].goodsName}&orderId=${_this.data.orderList[index].orderId}&shopId=${_this.data.orderList[index].shopId}&goodId=${_this.data.orderList[index].goodsId}&grouponJson=${grouponJson}&type=${type}&shopName=${_this.data.shopName}`
      })
    })
  },
  imgErrorFn: (e) => {
    utils.imgErrorFn(_this, e);
  }
})