// pages/shopDetailInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: [
      {
        value: '线上',
        type: 1,
        checked: true
      },
      {
        value: '线下',
        type: 2
      }
    ],
    isMap: true,
    address: '请选择地址',
    addressInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击打开选择地图
  chooseMap() {
    // 这是选择地图页
      // 地图选择
      wx.chooseLocation({
        success:(res)=> {
          this.setData({
            addressInfo:res,
            address: res.name
          })
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
  },

  // 选择店铺地址 线上or线下
  radioChange(e) {
    // console.log(e)
    let type = e.detail.value
    if (type==1) {
      this.setData({
        isMap: true
      })
    } else {
      this.setData({
        isMap: false
      })
    }
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