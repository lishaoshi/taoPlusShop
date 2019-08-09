import spellGroup from '../../api/spellGroup.js'
let spellGroupModel = new spellGroup()
import { showToast } from '../../utils/util.js'
const app = getApp()
// pages/addGroupGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marketPrice: 0,   //原价格
    groupGoodsPrice: 0,   //团购价格,
    grouponSum: 0,      //成团人数
    headAward: 0,     //发起人奖励
    grouponTime: 0,     //限制多少小时内成团
    startDate:'',
    startTime: '',
    endDate: '',
    endTime: '',
    array: ['即时消费', '等待消费'],
    grouponGoodsType: 1,   //拼团类型
    index:0,
    goodsInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击前往选择商品
  chooseGoods() {
    wx.navigateTo({
      url: '/pages/chooseGoods/index',
    })
  },

  // 发起团购操作
  sendGroupGoods() {
    if (!this.data.grouponSum) {
      // alert('请填写成团人数');
      showToast('请填写成团人数')
      return;
    }
    if (this.data.grouponSum < 2) {
      // alert('成团人数不可以少于2人');
      showToast('成团人数不可以少于2人')
      return;
    }
    if (!this.data.groupGoodsPrice) {
      // alert('请填写拼团价格');
      showToast('请填写拼团价格')
      return;
    }
    if (this.data.groupGoodsPrice * 1 > this.data.goodsInfo.shop_price* 1) {
      // alert('团购价格不能大于商品价格');
      showToast('团购价格不能大于商品价格')
      return;
    }
    if (!this.data.headAward) {
      // alert('请填写发起人奖励');
      showToast('请填写发起人奖励')
      return;
    }
    if (this.data.headAward * 1 > this.data.grouponSum * 1 * this.data.groupGoodsPrice) {
      // alert('奖励不能大于团购价格与团购人数的积');
      showToast('奖励不能大于团购价格与团购人数的积')
      return;
    }

    if (!this.data.grouponTime) {
      // alert('请填写有效时间');
      showToast('请填写有效时间')
      return;
    }
    //			   	if(!finallyTime){
    //			   		alert('请填写截止使用时间');
    //			   		return;
    //			   	}
    if (!this.data.startDate || !this.data.startTime) {
      // alert('请填写抢购开始时间');
      showToast('请填写抢购开始时间')
      return;
    }
    if (!this.data.endDate || !this.data.endTime) {
      // alert('请填写抢购开始时间');
      showToast('请填写抢购结束时间')
      return;
    }
    let data = {
      goodsId: this.data.goodsInfo.goods_id,
      shopId: app.globalData.shopId,
      grouponPrice: this.data.groupGoodsPrice,
      headAward: this.data.headAward,
      grouponSum: this.data.grouponSum,
      grouponTime: this.data.grouponTime,//成团时限 1、一天 2、两天   以次类推,
      finallyTime: '',//最后使用时间,
      startTime: `${this.data.startDate} ${this.data.startTime}`,//startTime,
      endTime: `${this.data.endDate} ${this.data.endTime}`,//endTime,
      grouponGoodsType: this.data.grouponGoodsType//拼团商品类型：1、即时拼团  2、线上拼团,
    }
    spellGroupModel.addGroupGoods(data).then(res=>{
      setTimeout(()=>{
        showToast('请填写抢购开始时间', 'success')
      }, 1000)
      wx.navigateBack()
    })
  },

  // 拼团类型
  bindPickerChange(e) {
    // console.log(e)
    let type = e.detail.value+1
    this.setData({
      grouponGoodsType: type
    })
  },

  // 选择开始日期回调
  bindStartDateChange(e) {
    let startDate = e.detail.value
    this.setData({
      startDate
    })
  },
  // 选择开始时间回调
  bindStartTimeChange(e) {
    let startTime = e.detail.value
    this.setData({
      startTime
    })
  },
  // 选择结束日期回调
  bindEndDateChange(e) {
    let endDate = e.detail.value
    this.setData({
      endDate
    })
  },
  // 选择结束时间回调
  bindEndTimeChange(e) {
    let endTime = e.detail.value
    this.setData({
      endTime
    })
  },

  // 获取已选的商品信息
  getGoodsInfo(data) {
    console.log(data)
    this.setData({
      goodsInfo:data
    })
  },

  // 获取input内用
  getTargetValue(e) {
    console.log(e)
    let inputValue = e.detail.value
    let type = e.currentTarget.dataset.type
    let key
    switch(type) {
      case '1':
        key ='grouponSum';
        break;
      case '2':
        key = 'marketPrice';
        break;
      case '3':
        key = 'groupGoodsPrice';
        break;
      case '4':
        key = 'headAward';
        break;
      case '5':
        key = 'grouponTime';
        break;
    } 
    console.log(key)
    this.setData({
      [key]: inputValue
    })
    console.log(this.data)
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