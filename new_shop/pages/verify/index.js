import { showToast } from '../../utils/util.js'
import verify from '../../api/verify.js'
let verifyModel = new verify()
const app = getApp()
// pages/verify/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 打开扫码
  openScanCode() {
    wx.scanCode({
      scanType: ['barCode', 'qrCode', 'datamatrix','pdf417'],
      success:res=>{
        // console.log(res)
        let value = this.base64_decode(res.rawData)
        this.setData({
          value: value
        })
      }
    })
  },
  // 获取输入框券码
  getCode(e) {
    // console.log(e)
    let val = e.detail.value
    this.setData({
      value:val
    })
  },

  // 解密base64
   base64_decode(input) { // 解码，配合decodeURIComponent使用
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while(i <input.length) {
      enc1 = base64EncodeChars.indexOf(input.charAt(i++));
      enc2 = base64EncodeChars.indexOf(input.charAt(i++));
      enc3 = base64EncodeChars.indexOf(input.charAt(i++));
      enc4 = base64EncodeChars.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    return this.utf8_decode(output);
  },
// utf-8解码
  utf8_decode(utftext) { 
    var string = '';
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    while(i <utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c1 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
        i += 2;
      } else {
        c1 = utftext.charCodeAt(i + 1);
        c2 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
        i += 3;
      }
    }
    return string;
  },

  // 查询要销毁的订单
  queryOrder() {
    if (!this.data.value) {
      showToast('券码不能为空！')
      return
    }
    wx.navigateTo({
      url: '/pages/verification_detail/index?code=' + this.data.value,
    })
    let data = {
      shopId: app.globalData.shopId
    }
    verifyModel.queryTicket(data, this.data.value, app.globalData.shopId).then(res=>{
      if (res.length > 0) {
        let orderId = res[0].orderId;
        
      } else {
        showToast('该商家没有此券码或已使用该券码');
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