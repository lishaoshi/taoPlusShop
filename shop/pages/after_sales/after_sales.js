// pages/after_sales/after_sales.js
const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;
let _this;


Page({


  /**
   * 页面的初始数据
   */
  data: {
    sum:'00.00',
    orderId: '',
      detailVal:'买多了/买错了',
    items:[
        { name: '1', value: '买多了/买错了', checked: 'true'},
      { name: '2', value: '计划有变,没时间消费' },
      { name: '3', value: '后悔了,不想要' },
      { name: '4', value: '联系不上商家' },
      { name: '5', value: '评价不太好,不想消费' },
      { name: '6', value: '店铺活动更优惠' },
      { name: '7', value: '其他原因' },
    ]

  },
  radioChange: function(e){
      console.log(e)
      console.log(e.detail.value)
      let detailVal = e.detail.value;
      _this.setData({
          detailVal: detailVal
      })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      _this = this;
      _this.setData({
          sum: options.sum,
          orderId: options.orderId
      })
  },

   //申请退款按钮

  salesSubmitFn: function(e){
      let refund = _this.data.detailVal
      utils.uPost(`${api.HOST}/api/refund/user/${app.globalData.userId}/order/${_this.data.orderId}/refund`,{
          refundRemarks: _this.data.detailVal
      },true,true).then((res)=>{
          wx.showToast({
              title: '退款成功',
              duration: 2000
          })
         
          wx.redirectTo({
              url: '../after_sales_detail/after_sales_detail?orderId='+_this.data.orderId
         })

      })
    
    // wx.redirectTo({
    //   url: '../after_sales_detail/after_sales_detail'
    // })

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})