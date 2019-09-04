import shopMng from '../../api/shopMng.js'
import config from '../../config.js'
let shopMngModel = new shopMng()
let app = getApp()
// let pic_list = {}
// pages/shopMng/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: {},
    shopImgUrl: '/images/confirm.png',
    shopImgUrl2: '/images/confirm.png',
    pic_list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getShopInfo()
    // this.showImg()
  },

  // 获取店铺信息
  _getShopInfo() {
    let data = {
      shopId: app.globalData.shopId
    }
    shopMngModel.getShopDetail(data).then(res=>{
      wx.setStorageSync('shopData', res.result)
      var shopPicList = res.result.shopPicList;
      this.setData({
        pic_list: {}
      })
      shopPicList.forEach((item, index)=> {
        this.pushImg(item.type, item.path);
      });
      this.setData({
        shopInfo: res.result
      })
      this.showImg()
    })
  },

  // 处理显示图片
  showImg() {
    // let IMG = `https://api.olb8.com`
    // console.log(this.data.pic_list)
    console.log(this.data.pic_list)
    if (this.data.pic_list[2] && this.data.pic_list[2][0]) {
      
      let url = `${config.IMG}${this.data.pic_list[2][0]}.th`
      // console.log(url)
      this.setData({
        shopImgUrl: url
      })
    }
    if (this.data.pic_list[3] && this.data.pic_list[3][0]) {
      let url = `${config.IMG}${this.data.pic_list[3][0]}.th`
      this.setData({
        shopImgUrl2: url
      })
    }
  },

  // 点击编辑按钮
  goShopInfo() {
    wx.navigateTo({
      url: '/pages/shopDetailInfo/index',
    })
  },

  // 处理显示店铺图片
  pushImg(type, path) {
    // console.log(type, path)
    if(this.data.pic_list[type]) {
      let key = `pic_list${type}`
      let data = this.data.pic_list[type].push(path);
      this.setData({
        [key]: data
      })
    }else{
      let key = `pic_list[${type}]`
      this.data.pic_list[type] = []
      this.data.pic_list[type].push(path)
      this.setData({
        [key]: this.data.pic_list[type]
      })
    }
    // console.log(this.data.pic_list)
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