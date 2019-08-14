import serviceMng from '../../api/serviceMng.js'
let serviceMngModel = new serviceMng()
import { showToast } from '../../utils/util.js'
const app = getApp()
// pages/areaEdit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    inputValue: '',
    isEdit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let data = wx.getStorageSync('floor')
    // this.setData({
    //   dataList: data
    // })
    this._selectFloor()
  },

  //获取添加区域内容
  getInputValue(e) {
    let value = e.detail.value
    value&&this.setData({
      inputValue: value
    })
  },

  // 编辑
  editArea() {
    this.setData({
      isEdit: true
    })
  },

  // 删除
  delArea(e) {
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: res=>{
        if(res.confirm) {
          let data = {
            shopId: app.globalData.shopId,
            floorId: id
          }
          serviceMngModel.delArea(data).then(res=>{
            if(res.code==0) {
              showToast('删除成功')
              this._selectFloor()
            } else {
              showToast('删除失败')
            }
          })
        }
      }
    })
  },
  // 获取桌台数据
  _selectFloor() {
    let data = {
      shopId: app.globalData.shopId
    }
    serviceMngModel.selectFloor(data).then(res => {
      if (res.code == 0) {
        this.setData({
          dataList: res.result
        })
      }
    })
  },

  // 排序
  sortArea(e) {
    let index = e.currentTarget.dataset.index
    let arr = [...this.data.dataList]
    if(index==0) {
      arr[1] = arr.splice(index, 1, arr[index+1])[0]
      arr.forEach((item, key, arr)=>{
        arr[key].sort = key+1
      })
      this.setData({
        dataList: arr
      })
    } else {
      arr[index - 1] = arr.splice(index, 1, arr[index - 1])[0]
      arr.forEach((item, key, arr) => {
        arr[key].sort = key + 1
      })
    }
    this.setData({
      dataList: arr
    })
    // this._editArea()
  },
  // 获取输出框内容
  getInputValueArea(e) {
    let value = e.detail.value
    let index = e.currentTarget.dataset.index
    let key = `dataList[${index}].position_name`
    this.setData({
      [key]:value
    })
    console.log(this.data)
    // this._editArea()
  },
  
  // 编辑区域
  _editArea() {
    let data = {
      shopId: app.globalData.shopId,
      floorJSON: JSON.stringify(this.data.dataList)
    }
    // console.log(arr)
    serviceMngModel.editArea(data).then(res => {
      if(res.code==0) {
        showToast('编辑成功','','success')
      }
    })
  },

  // 添加区域
  _addArea() {
    let data = {
      shopId: app.globalData.shopId,
      positionName: this.data.inputValue
    }
    serviceMngModel.addArea(data).then(res=>{
      if(res.code==0) {
        showToast('添加成功')
        this._selectFloor()
      }
    })
  },

  // 点击添加按钮
  addBtn() {
    if(!this.data.inputValue) {
      showToast('请输入区域名称')
      return
    }
    this._addArea()
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
    // this._editArea()
    let page = getCurrentPages()
    let perPage = page[page.length-2]
    perPage._selectFloor()
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