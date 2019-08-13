import financial from '../../api/financial.js'
let financialModel = new financial()
const app = getApp()
import { showToast } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: null,
    inputValue: '',
    val: '',
    bankCardInfo: null,
    text: null,
    flag: false    //监控离开当前页面是否已经绑定银行卡
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let total = +options.total
    console.log(typeof total, total)
    this.setData({
      total: total.toFixed(2)
    })
    this._getBankCardList()
  },

  // 全部提现
  allTx(e) {
    if (!this.data.total) {
      wx.showToast({
        title: '暂无余额',
        icon: 'none'
      })
      return
    }
    const total =  +this.data.total
    this.setData({
      inputValue: total.toFixed(2)
    })
  },


  // 获取银行卡列表
  _getBankCardList() {
    let userId = app.globalData.shopId
    let data = {
      userId: userId,
      pageNum: 1,
      pageSize: 1
    }
    financialModel.getBankCard(data).then(res => {
      this.setData({
        bankCardInfo: res.result[0],
      })
      this.setShowBankInfo()
    })
  },

  // 显示银行开信息设置
  setShowBankInfo() {
    if (this.data.bankCardInfo) {
      let num = this.data.bankCardInfo.bankcardNum
      let name = this.data.bankCardInfo.bankcardName
      let text = `${name}(${num.substr(-4, 4)})`
      this.setData({
        text: text
      })
      console.log(this.data)
    }
  },

  // // 修改bankCardInfo信息
  setBankCardInfo(data) {
    this.setData({
      bankCardInfo: data
    })
  },

  // 提现按钮
  tapBtn() {
    // console.log(this.data.bankCardInfo)
    console.log(this.data.inputValue)
    if (!this.data.inputValue) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return
    }
    console.log(this.data)

    if (this.data.val > this.data.total) {
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      })
      return
    }
    if (!this.data.bankCardInfo) {
      showToast('请选择银行卡')
      return false;
    }
    let data = {
      shopId: app.globalData.userId,
      userBankcardId: this.data.bankCardInfo.bankcardId,
      money: this.data.inputValue
    }
    financialModel._shopWithdrawals(data).then(res=>{
      showToast('提现成功')
    }).catch(err=>{
      showToast('提现失败')
    })

    // takeAwayModel.withdrawals(data).then(res => {
    //   wx.showToast({
    //     title: '提现成功',
    //   })
    // })
  },
  // 选择提现银行卡
  chooseBankCard() {
    wx.navigateTo({
      url: '/pages/bankCard/index?chooseBank=1',
    })
  },


  // 输入框失去焦点出发
  bindblur(e) {
    // console.log(e)
    const value = e.detail.value
    this.setData({
      inputValue: value
    })
  },

  // 点击绑定银行卡
  bindBankCar() {
    wx.navigateTo({
      url: '/pages/addBankCard/index',
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
    console.log(this.data)
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