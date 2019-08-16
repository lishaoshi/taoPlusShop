import config from '../../config.js'
import shopInfo from '../../api/shopInfo.js'
let shopInfoModel = new shopInfo()
const app = getApp()
import { showToast } from '../../utils/util.js'
// pages/shopInfo/shopInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopImg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = wx.getStorageSync('shopInfo')
    this.setData({
      shopImg: config.IMG+data.portrait_url+'.th',
    })
  },

  // 修改商家图片
  changeShopImg() {
    //打开选择图片
      wx.chooseImage({
        success: (res) => {
          let tempFilePaths = res.tempFilePaths[0]
          this._uploadFiled(tempFilePaths)
        }
      })
  },

  //封装上传图片函数
  _uploadFiled(data) {
    wx.uploadFile({
      url: `${config.base_url}/file/upload`,
      filePath: data,
      name: 'file',
      formData: {
        token: app.globalData.token
      },
      success: (res) => {
        let data = JSON.parse(res.data)
        var shopImg = data.result.path;
        this._changeShopImg(shopImg)
        this.setData({
          shopImg: shopImg
        })
      }
    })
  },

  // 封装修改商家图片函数
  _changeShopImg(url) {
    let data = {
      shopId: app.globalData.shopId,
      portraitUrl: url
    }
    shopInfoModel.changeShopImg(data).then(res=>{
      if(res.data.length>0) {
        showToast('该商家没有此券码或已使用该券码')
      }
    })
  },

  // 推出登录
  _loginOut() {
    wx.showModal({
      title: '提示',
      content: '确定退出登陆吗?',
      success: res=>{
        if(res.confirm) {
          let data = {
            userId: app.globalData.userId,
            shopId: app.globalData.shopId
          }
          shopInfoModel.loginOut(data).then(res=>{
            if(res.code==0) {
              showToast('退出成功',1000, 'success')
              wx.clearStorageSync()
              setTimeout(()=>{
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              })
            } else {
              showToast(res.message)
            }
          })
        }
      }
    })
  },
  // 前往修改密码页面
  changePsw() {
    wx.navigateTo({
      url: '/pages/change_password/change_password',
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