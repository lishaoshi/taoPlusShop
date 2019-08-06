import spellGroup from '../../api/spellGroup.js'
let spellGroupModel = new spellGroup()
const app = getApp()

// pages/spellGroup/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: ['全部','在售','停售'],
    goodsTypeList: [],   //商品分类列表
    index: -1,
    goodsList:[],    //团购商品列表
    type: '',
    class_id: '',
    pageNo: 1,
    pageSize: 9
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._queryGoodsTypeList()
    this._getGroupList()
  },

  // 查询商品分类列表
  _queryGoodsTypeList() {
    let data = {
      shopId: app.globalData.shopId
    }
    spellGroupModel.queryGoodsTypeList(data).then(res=>{
      this.setData({
        goodsTypeList: res.result
      })
    })
  },

  // 选择团购商品类型
  bindPickerChange(e) {
    console.log(e)
    let index = e.detail.value
    // if (!this.data.goodsList[index].class_id) {}
    this.setData({
      index,
      class_id: this.data.goodsList[index].class_id
    })
  },

  // 获取团购商品列表
  _getGroupList() {
    let data = {
      shopId: app.globalData.shopId,
      type: this.data.type,
      class_id: this.data.class_id,
      pageNum: this.data.pageNo,
      pageSize: this.data.pageSize
    }
    spellGroupModel.getGroupList(data, app.globalData.shopId).then(res=>{

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