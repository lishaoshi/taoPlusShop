import {showToast} from '../../utils/util.js'
import config from '../../config.js'
const app = getApp()
import serviceMng from '../../api/serviceMng.js'
let serviceMngModel = new serviceMng()
// pages/addServer/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    floorList: [],
    index: 0,
    currentIndex:1,
    qrCode: '',
    inputValue: '',
    floorSeatId:''
    // roomInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = wx.getStorageSync('floor')
    let isEdit = options.isEdit?true:false
    this.setData({
      floorList: data,
      index: options.index,
      isEdit: isEdit
    })
    isEdit && this.getRoomInfo()
  },
  getRoomInfo() {
    if (this.data.isEdit) {
      let roomInfo = wx.getStorageSync('roomInfo')
      let qrCode
      if (roomInfo.print_link.includes('http')) {
          qrCode= roomInfo.print_link
      } else {
          qrCode= conifg.base_url+roomInfo.print_link
      }
      this.setData({
        inputValue: roomInfo.seat_name,
        currentIndex: roomInfo.seat,
        qrCode: qrCode,
        floorSeatId: roomInfo.floor_seat_id
      })
    }
   
    
  },
  // 修改桌台
  editRoom() {
    if (!this.data.qrCode) {
      showToast('请生成二维码后，再操作')
      return
    }
    let data = {
      shopId: app.globalData.shopId,
      seatName:this.data.inputValue,
      floorId: this.data.floorList[this.data.index].floor_id,
      seatNum: this.data.currentIndex,
      path: this.data.qrCode,
      floorSeatId: this.data.floorSeatId
    }
    serviceMngModel.editSeat(data).then(res=>{
      if (res.code == 0) {
        showToast('修改成功')
        let page = getCurrentPages()
        let perPage = page[page.length - 2]
        setTimeout(() => {
          perPage._selectFloor()
          wx.navigateBack()
        }, 1000)
        return
      }
      showToast(res.message)
    })
  },

  // 减
  del() {
    if (this.data.currentIndex<=1) {
      showToast('不能再减啦')
      return
    }
    this.setData({
      currentIndex: --this.data.currentIndex
    })
  },

  // 获取input值
  getInputValue(e) {
    let value = e.detail.value
    this.setData({
      inputValue: value
    })
  },
  // 加
  add() {
    this.setData({
      currentIndex: ++this.data.currentIndex
    })
  },

  // 生成二维码链接
  genereateQrcode() {
    // !this.data.qrCode && this.getQrcode()
    if (!this.data.qrCode) {
      this.getQrcode()
    } else {
      this.saveQrcode(this.data.qrCode)
    }
    // this.data.qrCode && this.saveQrcode(this.data.qrCode)
  },

  // 添加桌台
  addTale() {
    if(this.data.isEdit) {
      this.editRoom()
      return
    }
    if (!this.data.floorList[this.data.index].floor_id) {
      showToast('请完善资料')
      return
    } else if(!this.data.qrCode) {
      showToast('请生成二维码后，再操作')
      return
    }
    let data = {
      shopId: app.globalData.shopId,
      seatName:this.data.inputValue,
      floorId: this.data.floorList[this.data.index].floor_id,
      seatNum: this.data.currentIndex,
      path: this.data.qrCode
    }
    serviceMngModel.addSeat(data).then(res=>{
      if(res.code==0) {
        showToast('添加成功')
        let page = getCurrentPages()
        let perPage = page[page.length-2]
        setTimeout(()=>{
          perPage._selectFloor()
          wx.navigateBack()
        },1000)
        return
      }
      showToast(res.message)
    })
  },

  bindPickerChange(e) {
    let index = e.detail.value
    this.setData({
      index:index
    })
  },

  // 封装二维码函数
  getQrcode() {
    console.log('get')
    let seatName = this.data.inputValue
    let shopId = app.globalData.shopId
    let floorId = this.data.floorList[this.data.index].floor_id
    if (!seatName || !floorId) {
      showToast('请完善资料')
      return
    }
    let imagUrl = `${config.base_url}/bcdshop/booking/shop/floor/seat/code?shopId=${shopId}&seatName=${seatName}&floorId=${floorId}&token=${config.token}`
    this.setData({
      qrCode: imagUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  // 封装保存二维码函数
  saveQrcode(url) {
    console.log('save', this.data.qrCode)
    if (url) {
      console.log('save', this.data.qrCode)
      wx.saveImageToPhotosAlbum({
        filePath: url,
        success: res=>{
          // console.log(res)
          showToast('保存成功')
        }
      })
    }
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