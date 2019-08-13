import account from '../../api/account.js'
let accountModel = new account()
let app = getApp()
import config from '../../config.js'

// pages/account/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 6,
    date: '',
    dataList: [],
    type:'',
    flag: false,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type) {
      this.setData({
        type: options.type
      })
    }
    this.getCurrentDate()
    this._queryShopAccountList()
  },

  // 查询商家账户明细
  _queryShopAccountList() {
    let data = {
      shopId: app.globalData.shopId,
      pageNum: this.data.pageNo,
      pageSize: this.data.pageSize,
      date: !this.data.type?this.data.date:''
    }
    accountModel.getAccountList(data).then(res => {
      let type
      if (res.code==0) {
        res.result.forEach((item, index, arr) => {
          let income = item.income;
          let payment = item.payment;
          var rep = /^(http|https)/g;
          let matches = rep.exec(item.portraitUrl);
          if (matches) {
            arr[index].avatar = item.portraitUrl;
          } else {
            arr[index].avatar = config.IMG + item.portraitUrl+'.th';
          }
          switch (item.type) {
            case 10:
              type = '让利分润 ';
              break;
            case 11:
              type = '报单分润';
              break;
            case 20:
              type = '余额支付';
              break;
            case 21:
              type = '微信支付';
              break;
            case 22:
              type = '支付宝支付';
              break;
            case 30:
              type = '收款';
              break;
            case 40:
              type = '让利提现';
              break;
            case 41:
              type = '提现申请';
              break;
            case 43:
              type = '让利提现失败';
              break;
            case 42:
              type = '让利提现成功';
              break;
            case 50:
              type = '报单提现 ';
              break;
            case 60:
              type = '提现';
              break;
            case 61:
              type = '提现成功';
              break;
            case 62:
              type = '提现失败 ';
              break;
            case 70:
              type = '跨界让利';
              break;
            case 80:
              type = '支付手续费';
              break;
            case 90:
              type = '团购让利 ';
              break;
            case 91:
              type = '团购团长奖励';
              break;
            case 92:
              type = '商家推广员推广奖励';
              break;
            case 100:
              type = '推广员推广奖励';
              break;
          }
          arr[index].typeName = type
          let payTypeName
          switch (item.payType) {
            case 1:
              payTypeName = '微信公众号';
              break;
            case 2:
              payTypeName = '支付宝H5';
              break;
            case 3:
              payTypeName = '微信H5';
              break;
            case 4:
              payTypeName = '微信公众号';
              break;
            case 5:
              payTypeName = '微信扫码';
              break;
            case 6:
              payTypeName = '支付宝扫码';
              break;
            case 8:
              payTypeName = '商家小程序';
              break;
            case 9:
              payTypeName = '商圈小程序';
              break;
            case 10:
              payTypeName = '平台小程序';
              break;
          }
          arr[index].payTypeName = payTypeName
          
          if (item.income <= 0) {
            // this.setData({
            //   flag: false
            // })
            arr[index].flag=false
          } else {
            arr[index].flag = true
          }
        })
      }
      this.setData({
        dataList: [...this.data.dataList,...res.result],
        total: res.total
      })
    })
  },

  // 日期控件改变时出发
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
    this._queryShopAccountList()
  },

  // 获取当前时间
  getCurrentDate() {
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth()+1
    let d = date.getDate()
    let currentDate = `${y}-${m}-${d}`
    // console.log(currentDate)
    this.setData({
      date: currentDate
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
  onReachBottom: function (e) {
    // console.log(e)
    if(this.data.total==this.data.dataList.length) return
    this.setData({
      pageNo: ++this.data.pageNo
    })
    this._queryShopAccountList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})