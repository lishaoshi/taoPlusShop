import orderMng from '../../api/orderMng.js'
let orderMngModel = new orderMng()
const app = getApp()
import config from '../../config.js'
// pages/orderMng/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTypeArr: [
      '待支付',
      '待使用',
      '已完成',
      '已取消',
      '退款'
    ],
    currentIndex: 0,
    pageNo: 1,
    pageSize: 9,
    type: 1,
    orderList: [],
    total: 0,
    typeName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getOrderList()
  },


  // 点击选择订单类型
  chooseorderType(e) {
    let index = e.currentTarget.dataset.index
    let type
    switch(index) {
      case 0:
        type = 1
        break
      case 1:
        type = 3
        break
      case 2:
        type = 4
        break
      case 3:
        type = -1
        break
      case 4:
        type = 99
        break
    }
    this.setData({
      currentIndex: index,
      type: type,
      orderList: []
    })
    this._getOrderList()
  },

  // 获取订单列表
  _getOrderList() {
    let data = {
      shopId: app.globalData.shopId,
      pageNum: this.data.pageNo,
      pageSize: this.data.pageSize,
      type: this.data.type
    }
    orderMngModel.getOrderList(data).then(res=>{
      let type
      res.result.forEach((ele, index, arr)=> {
        if (ele.pay_type == 4) {
          if (ele.orderDetailsList.length > 0) {
            var rep = /^(http|https)/g;
            var matches = rep.exec(ele.orderDetailsList[0].path);
            if (matches) {
              arr[index].avatar = ele.orderDetailsList[0].path;
              // console.log(arr[index].avatar)
            } else {
              arr[index].avatar = config.IMG + ele.orderDetailsList[0].path;
              // console.log(arr[index].avatar)
            }
            //						avatar = IMG +ele.orderDetailsList[0].path;
          } else {
            arr[index].avatar = '';
          }
        } else {
          var rep = /^(http|https)/g;
          var matches = rep.exec(ele.portrait_url);
          if (matches) {
            arr[index].avatar = ele.portrait_url;
          } else {
            arr[index].avatar = config.IMG + ele.portrait_url;
          }
          //					avatar =IMG + ele.portrait_url;
        }
        switch (ele.pay_type) {
          case 1:
            type = '微信公众号';
            break;
          case 2:
            type = '支付宝H5';
            break;
          case 3:
            type = '微信H5';
            break;
          case 4:
            type = '小程序支付';
            break;
          case 5:
            type = '微信扫码';
            break;
          case 6:
            type = '支付宝扫码';
            break;
          case 8:
            type = '商家小程序';
            break;
          case 9:
            type = '商圈小程序';
            break;
          case 10:
            type = '平台小程序';
            break;
        }
        arr[index].typeName = type
        let status
        switch (ele.order_status) {
          case 1:
            status = '待支付';
            break;
          case 3:
            status = '待使用'
            break;
          case 4:
            status = '已使用';
            break;
          case 5:
            status = '退款中';
            break;
          case 6:
            status = '退款成功';
            break;
          case 7:
            status = '申请退款';
            break;
          case -1:
            status = '已取消';
            break;
        }
        arr[index].status = status
    })
      this.setData({
        orderList: [...this.data.orderList,...res.result],
        total: res.total
      })
  })},

  // 查看订单详情
  queryOrderDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.setStorageSync('orderInfo', item)
    wx.navigateTo({
      url: '/pages/orderDetail/index',
    })
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
    if(this.data.total==this.data.orderList.length) {
      return
    }
    this.setData({
      pageNo: ++this.data.pageNo
    })
    this._getOrderList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})