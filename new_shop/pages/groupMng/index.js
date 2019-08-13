import customeMng from '../../api/customerMng.js'
let customeMngModel = new customeMng()
const app = getApp()
// pages/groupMng/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    show: false,
    value: '',
    isEdit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getGroupList()
  },

  // 获取分组列表
  _getGroupList() {
    customeMngModel.getGroupList({},app.globalData.shopId).then(res=>{
      this.setData({
        dataList: res
      })
    })
  },

  // 获取输出框内容
  getInputValue(e) {
    let value = e.detail.value
    this.setData({
      value: value
    })
  },

  //点击确认按钮
  confirm() {
    if(!this.data.value) {
      wx.showToast({
        title: '分组名称不能为空！',
        icon: 'none'
      })
      truen
    }
    this.data.isEdit && this._editGroup()
    !this.data.isEdit && this._addGroup()
  },

  // 新增分组函数
  _addGroup(value) {
    let data = {
      name:value
    }
    customeMngModel.addGroup(data, app.globalData.shopId).then(res => {
      this.setData({
        show: false,
        value: ''
      })
      this._getGroupList()
      wx.showToast({
        title: '新增成功',
      })
    })
  },

  //编辑分组
  _editGroup(id) {
    let data = {
      id: this.data.groupId,
      name: this.data.value
    }
    customeMngModel.editGroup(data, app.globalData.shopId).then(res => {
      this.setData({
        show: false,
        value: '',
        isEdit: false
      })
      this._getGroupList()
      wx.showToast({
        title: '编辑成功',
      })
    })
  },

  // 打开添加分组弹框
  showDialog() {
    this.setData({
      show: true
    })
  },

  // 关闭弹框
  cancel() {
    this.setData({
      show: false
    })
  },

  // 点击分组  编辑分组
  editGroup(e) {
    let id = e.currentTarget.dataset.id
    let value = e.currentTarget.dataset.name
    this.setData({
      groupId: id,
      show: true,
      isEdit: true,
      value: value
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