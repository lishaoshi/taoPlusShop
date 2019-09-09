import config from '../../config.js'
import { showToast, saveImg } from '../../utils/util.js'
const app = getApp()
// pages/myProgram/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let imgUrl = `${config.IMG}/bcdshop/shop/${app.globalData.shopId}/miniprogram`
    this.setData({
      imgUrl
    })
   
  },
  // 保存图片
  _saveImg() {
    let url = this.data.imgUrl
    if (!url) {
      showToast('没有图片')
      return
    }
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: res => {
        if (res.tapIndex == 0) {
          saveImg(url)
        }
      }
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