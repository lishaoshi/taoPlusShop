// pages/redBag/index.js
import coupons from '../../api/coupons.js'
let couponsModel = new coupons()
import redBag from '../../api/redBag.js'
let redBagModel = new redBag()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 8,
    redRuleList: [],
    total: 0         //规则总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._queryredBagRule()
  },

  //查询商家创建红包规则
  _queryredBagRule(flag) {
    flag&&this.setData({ redRuleList: [], pageNo: 1})
    let data = {
      index: this.data.pageNo,
      pageSize: this.data.pageSize,
      alias: 'RED_PAPER_COUPON',
      // shopId: app.globalData.shopId
    }
    couponsModel.queryCouponRule(data).then(res => {
      // console.log(res)
      res.records.forEach((item, index, arr)=>{
        // console.log(arr[index])
        arr[index].couponStartTime = arr[index].couponStartTime.split(' ')[0]
        arr[index].couponEndTime = arr[index].couponStartTime.split(' ')[0]
      })
      this.setData({
        redRuleList: [...this.data.redRuleList,...res.records],
        total: res.total
      })
    })
  },

  // 添加红包按钮
  goAddRedBag(e) {
    wx.navigateTo({
      url: '/pages/addRedBag/index'
    })
  },

  // 修改红包
  _updateCoupon(e) {
    let item = e.currentTarget.dataset.item
    // console.log(item)
    let value = JSON.stringify(item)
    wx.navigateTo({
      url: '/pages/addRedBag/index?item=' + value,
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
    if(this.data.total <= this.data.redRuleList.length) {
      return
    }
    this.setData({
      pageNo: ++this.data.pageNo
    })
    this._queryredBagRule()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})