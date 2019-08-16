import banner from '../../api/banner.js'
let bannerModel = new banner()
const app = getApp()
// pages/banner/banner.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"测试1",
    createtime:"2019-8-14",
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getBannerList()
  },

  // 获取店铺轮播图列表
  _getBannerList() {
    let data = {
      shopId: app.globalData.shopId
    }
    bannerModel.getBannerList(data).then(res=>{
      res.result.forEach((item,index,arr)=>{
        arr[index].create_time = item.create_time.substr(0,10)
      })
      console.log(res.result)
      this.setData({
        list: res.result
      })
    })
  },

  // 点击banner列表前往修改页面
  editBanner(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/add_banner/add_banner?id='+item.shop_goods_pic,
    })
  },

  // 前往添加banner页面
  goAddBanner() {
    wx.navigateTo({
      url: '/pages/add_banner/add_banner',
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