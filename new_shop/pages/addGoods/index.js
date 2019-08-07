import goodsMng from '../../api/goodsMng.js'
import unit from '../../api/unit.js'
let unitModel = new unit()
let goodsMngModel = new goodsMng()
const app = getApp()

// pages/addGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsTypeList: [],
    index: 0,
    unitList: [],
    unitIndex: 0,
    imgList: [],
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._queryGoodsTypeList()
    this._getUnitList()
  },

  // 点击选择图片
  upLoadGoodsImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        let arr = this.data.imgList
        arr.push(tempFilePaths[0])
        this.setData({
          imgList: arr
        })
      }
    })
  },

  // 删除图片按钮
  delImg(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    this.data.imgList.splice(index,1)
    this.setData({
      imgList: this.data.imgList
    })
  },

  // 上传图片换取服务器的

  // 查询商品分类列表
  _queryGoodsTypeList() {
    let data = {
      shopId: app.globalData.shopId
    }
    goodsMngModel.queryGoodsTypeList(data).then(res => {
      this.setData({
        goodsTypeList: res.result
      })
    })
  },

  // 查询商品单位列表
  _getUnitList() {
    unitModel.getUnitList().then(res=>{
      this.setData({
        unitList: res.result
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