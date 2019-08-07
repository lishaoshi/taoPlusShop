import goodsMng from '../../api/goodsMng.js'
let goodsMngModel = new goodsMng()
const app = getApp()
// pages/chooseGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsTypeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._queryGoodsTypeList()
  },
  // 查询商品分类列表
  _queryGoodsTypeList() {
    let data = {
      shopId: app.globalData.shopId
    }
    goodsMngModel.queryGoodsTypeList(data).then(res => {
      this.setData({
        goodsTypeList: res.result,
        classId: res.result[0].class_id
      })
      // this._queryGoodsList()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})