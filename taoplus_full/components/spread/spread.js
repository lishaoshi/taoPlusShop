const app = getApp();
const utils = require("../../utils/util.js");
const api = require("../../utils/api.js").api;

let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrCode: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // _this = this;
    // let mobile = wx.getStorageSync('contact_phone') || '400-1314-199'
    // _this.setData({
    //   mobile: mobile
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getShopQr();
  },

  getShopQr: function() {
    let _this = this;
    wx.request({
      url: api.getQr,
      method: 'GET',
      data: {
        recommenderId: app.globalData.userId,
        type: 1
      },
      // dataType: 'json',
      responseType: 'arraybuffer', //将原本按文本解析修改为arraybuffer
      success: function(res) {
        // console.log(res);
        let qrUrl = 'data:image/png;base64,' + wx.arrayBufferToBase64(res.data);
        _this.setData({
          qrCode: qrUrl
        })
      }
    })
  },

  saveImg: function() {
    let _this = this;
    let saveObj = wx.getFileSystemManager();
    let timeStamp = new Date().getTime();
    saveObj.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/' + timeStamp+'.png',
      data: _this.data.qrCode.slice(22),
      encoding: 'base64',
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: wx.env.USER_DATA_PATH + '/' + timeStamp +'.png',
          success: function (res) {
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function (err) {
            console.log(err)
          }
        })
        console.log(res)
      }, fail: err => {
        console.log(err)
      }
    })
  },


  shareImg: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})