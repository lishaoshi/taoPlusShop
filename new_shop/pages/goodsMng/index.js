import goodsMng from '../../api/goodsMng.js'
let goodsMngModel = new goodsMng()
const app = getApp()
// pages/goodsMng/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId:'',
    goodsList: [],
    goodsTypeList: [],
    onSale: 1,
    pageNo: 1,
    pageSize: 9,
    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._queryGoodsTypeList()
    // this._queryGoodsList
  },

  // 点击商品类型
  tabGoodsType(e) {
    // console.log(e)
    let item = e.detail.item
    // console.log(item)
    this.setData({
      classId: item.class_id
    })
    this._queryGoodsList()
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
      this._queryGoodsList()
    })
  },
  // 获取商品列表
  _queryGoodsList() {
    let data = {
      shopId: app.globalData.shopId,
      isReal: 1,
      pageNum: this.data.pageNo,
      classId: this.data.classId,
      onSale: this.data.onSale,
      pageSize: this.data.pageSize
    }
    console.log()
    goodsMngModel.queryGoodsList(data).then(res=>{

    })
  },
  // 点击新增分类
  addGoodsType() {
    wx.navigateTo({
      url: '/pages/addGoodsType/index',
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