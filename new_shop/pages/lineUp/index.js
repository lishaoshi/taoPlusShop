import serviceMng from '../../api/serviceMng.js'
let serviceMngModel = new serviceMng()
const app = getApp()
import { showToast } from '../../utils/util.js'
// pages/lineUp/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerList: ['正在排队', '已过号码'],
    currentIndex: 0,
    tableList: [],
    index: 0,
    floorId: '',
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._selectFloor()
  },

  // 选择类型号码类型  正在排队  已过号码
  chooseType(e) {
    let index = e.currentTarget.dataset.index
    if (index == this.data.currentIndex) {
      return
    }
    this.setData({
      currentIndex:index,
    })
    index == 0 && this.getList(1)
    index == 1 && this.getList(66)

  },

  // 获取桌台数据
  _selectFloor() {
    let data = {
      shopId: app.globalData.shopId
    }
    serviceMngModel.selectFloor(data).then(res => {
      if (res.code == 0) {
        this.setData({
          tableList: res.result,
          floorId: res.result[0].floor_id
        })
        this.getList(1)
      }
    })
  },

  // 获取排队列表
  getList(type) {
    let data = {
      shopId: app.globalData.shopId,
      type: type,
      floorId: this.data.floorId
    }
    serviceMngModel.takeNumberList(data).then(res=>{
      let data = [...res.result]
      data.forEach((item, index, arr)=>{
        arr[index].create_time = item.create_time.substr(11, 8)
      })
      this.setData({
        dataList: res.result
      })
    })
  },

  // 下一个
  next() {
    if(!this.data.dataList.length) {
      showToast('没有下一个啦')
      return
    }
    let data = {
      takeNumberId: this.data.dataList[0].take_number_id,
      shopId: app.globalData.shopId,
      type: 2,
    }
    serviceMngModel.editTakeNumber(data).then(res=>{
      if(res.code!=0) {
        showToast('操作失败，请稍后在试')
        return
      }
    })
  },

  // 选择桌台出发
  bindPickerChange(e) {
    // console.log(e)
    let value = e.detail.value
    if(this.data.index==value) return
    this.setData({
      index: value,
      floorId: this.data.tableList[value].floor_id
    })
    this.data.currentIndex==0&&this.getList(1)
     this.data.currentIndex == 1 && this.getList(66)
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