// pages/bankCard/index.js
const app = getApp()
import financial from '../../api/financial.js'
let financialModel = new financial()
// const app = getApp()
import { showToast } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
    ],
    bankcardType: ['', '储蓄卡', '信用卡'],
    pageNo: 1,
    pageSize: 9,
    total: 0,
    pswText: '**** **** **** ',
    isChoose: null,
    pageNo: 1,
    pageSize: 9
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // let isChoose = options.chooseBank
    // this.setData({
    //   isChoose: isChoose
    // })
    this._getBankCardList()
  },

  // 获取银行卡列表
  _getBankCardList() {
    // let userId = app.gd.userId
    let data = {
      userId: app.globalData.shopId,
      pageNum: this.data.pageNo,
      pageSize: this.data.pageSize
    }
    financialModel.getBankCardList(data).then(res => {
      if (res.result) {
        res.result.forEach((item, index, arr) => {
          arr[index].bankcardNum = this.data.pswText + arr[index].bankcardNum.substr(-4, 4)
        })
      }
      this.setData({
        dataList: res.result,
        total: res.total
      })
    })
  },

  // 点击选择提现至银行卡
  chooseBankCard(e) {
    // console.log(e, '单次点击事件')
    let bankInfo = e.currentTarget.dataset.item
    var pages = getCurrentPages();//当前页面栈
    var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
    beforePage.setBankCardInfo(bankInfo);//触发父页面中的方法
    wx.navigateBack({
      delta: 1
    })
  },

  // 添加银行卡
  addBankCard() {
    wx.navigateTo({
      url: '/pages/addBankCard/index',
    })
  },

  // 解绑银行卡函数
  _delBankCard(id) {
    let data = {
      userId: app.globalData.shopId,
      bankCardId: id
    }
    financialModel.delBankCard(data).then(res => {
      this.setData({
        pageNo: 1
      })
      setTimeout(() => {
        this._getBankCardList()
      }, 500)
      wx.showToast({
        title: '解绑成功',
        icon: 'success'
      })
    })
  },

  // 长按提示
  tostDelBank(e) {
    // console.log(e, '长按点击事件')
    const bankCardId = e.currentTarget.dataset.bankcardid
    wx.showModal({
      title: '提示',
      content: '确定解绑该银行卡吗？',
      success: (res) => {
        if (res.confirm) {
          let data = {
            userId: app.globalData.userId,
            bankCardId: bankCardId
          }
          this._delBankCard(bankCardId)
        }
      },
      fail: () => {
        console.log('失败接口')
      }
    })
  },

  // 解绑银行卡


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
    if (this.data.total == this.data.dataList.length) {
      return
    }
    this.setData({
      pageNo: ++this.data.pageNo
    })
    this._getBankCardList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})