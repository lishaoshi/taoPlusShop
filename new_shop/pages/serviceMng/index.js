import serviceMng from '../../api/serviceMng.js'
let serviceMngModel = new serviceMng()
const app = getApp()
import { showToast } from '../../utils/util.js'
// pages/serviceMng/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableList: [],
    currentTableIndex: 0,
    floorId: '',
    dataList: [],
    flagDel: false,
    targetArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._selectFloor()
  },

  // 获取桌台数据
  _selectFloor() {
    let data = {
      shopId: app.globalData.shopId
    }
    serviceMngModel.selectFloor(data).then(res=>{
      if(res.code==0) {
        this.setData({
          tableList:res.result
        })
        this._selectSeatList(res.result[0].floor_id)
      }
    })
  },

  // 删除按钮
  delTabel() {
    this.setData({
      flagDel: !this.data.flagDel
    })
  },

  // 多选chang事件
  checkboxChange(e) {
    let targetArr = e.detail.value
    this.setData({
      targetArr: targetArr
    })
  },

  // 确认删除
  del() {
    let data = {
      shopId: app.globalData.shopId,
      floorSeatId: this.data.targetArr.toString()
    }
    serviceMngModel.delSeat(data).then(res=>{
      if(res.code==0) {
        this.setData({
          flagDel: false
        })
        showToast('删除成功')
        this._selectSeatList(this.data.tableList[this.data.currentTableIndex].floor_id)
      } else {
        '操作失败' + data.message
        showToast(`操作失败${res.message}`)
      }
    })
  },

  // 获取桌台区域liebiao
  _selectSeatList(floorId) {
    let data = {
      shopId: app.globalData.shopId,
      floorId: floorId,
    }
    serviceMngModel.selectSeatList(data).then(res=>{
      if(res.code==0) {
        this.setData({
          dataList: res.result
        })
        console.log(this.data, 'hello')
      }
    })
  },

  // 选择桌台
  chooseTable(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    if(index==this.data.currentTableIndex) return
    let id = e.currentTarget.dataset.id
    this.setData({
      currentTableIndex: index
    })
    this._selectSeatList(id)
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