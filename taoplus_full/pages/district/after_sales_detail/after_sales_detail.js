// pages/after_sales_detail/after_sales_detail.js
const app = getApp();
const utils = require("../../../utils/util.js");
const api = require("../../../utils/api.js").api;
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:'',
    sum:"199.00",
    time: '2018-09-10',
    date: '2018-9-13',
    dateTime:'16：45：00',
    auditSum:'118',
    accountType:'',
    payTime: '2018-09-12',
    payDetail: '16：45：00',
    refundDetails:[],
    isBalance:false,
    actualPrice: '',
    orderStatus:'',
    isFinish:false,
    isDeal: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.orderId)
      _this = this;
      _this.setData({
          orderId: options.orderId
      })

      _this.getRefundDetailFn();

   


  },

  //获取订单详情
    getRefundDetailFn: () =>{
       let payType = '';
        utils.uGet(`${api.HOST}/api/refund/user/${app.globalData.userId}/order/${_this.data.orderId}/refund/details`,{},true,true).then((res) =>{           
            let refundDetails = res.refundDetails;
            console.log(res.orderStatus)           
            if (res.refundDetails.length === 2){
                _this.setData({
                    isBalance: true,
                    refundDetails: res.refundDetails
                })
            }else{              
                _this.setData({
                    isBalance: false,
                    refundDetails: res.refundDetails
                })
            } 
            if (res.orderStatus == 7) {
                _this.setData({
                    isFinish: true,
                    isDeal: true
                })
            }         
            
            if (res.orderStatus == 5) {
                _this.setData({
                    isFinish: true,
                    isDeal: false
                })
            }
            if (res.orderStatus == 6) {
                _this.setData({
                    isFinish: false,
                    isDeal: false
                })
            }                                
            _this.setData({
                sum: res.actualPrice,
                time: res.createTime,
                refundDetails: refundDetails,
                actualPrice: res.actualPrice,
                orderStatus: res.orderStatus
            })
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
      wx.reLaunch({
          url: '/pages/order_list/order_list'
      })

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})