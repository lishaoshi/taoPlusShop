import goodsMng from '../../api/goodsMng.js'
let goodsMngModel = new goodsMng()
const app = getApp()
// pages/chooseGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsTypeList:[],
    goodsList: [],
    classId: '',
    pageNo: 1,
    pageSize: 9,
    onSale: 1
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
      this._queryGoodsList()
      // this._queryGoodsList()
    })
  },

  // 获取商品列表
  _queryGoodsList() {
    let data = {
      shopId: app.globalData.shopId,
      pageNum: this.data.pageNo,
      classId: this.data.classId,
      onSale: this.data.onSale,
      pageSize: this.data.pageSize
    }
    goodsMngModel.queryGoodsList(data).then(res => {
      this.setData({
        total: res.total,
        goodsList: res.result,
      })
    })
  },

  //点击侧边栏查询商品列表
  tabGoodsType(e) {
    console.log(e)
    let classId = e.detail.item.class_id
    this.setData({
      classId: classId
    })
    this._queryGoodsList()
  },

  // 选择商品
  chooseGoods(e) {
    let item = e.currentTarget.dataset.item
    // console.log(e)
    let page = getCurrentPages()
    let prevPage = page[page.length-2]
    prevPage.getGoodsInfo(item)
    wx.navigateBack()
    // console.log(page)
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
    if (this.data.goodsList.length <= this.data.total) {
      return
    }
    this.setData({
      pageNo: ++this.pageNo
    })
    this._queryGoodsList()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})