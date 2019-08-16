import serviceMng from '../../api/serviceMng.js'
let serviceMngModel = new serviceMng()
const app = getApp()
import config from '../../config.js'
import { showToast } from '../../utils/util.js'
// pages/makeAppoint/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerList: ['待使用','历史记录'],
    currentIndex: 0,
    createTime: '',
    pageNo: 1,
    pageSize: 9,
    type: 1,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  // 点击头部选择类型
  chooseType(e) {
    let type
    let index = e.currentTarget.dataset.index
    index==0&&(type=1)
    index == 1 && (type = 66)
    this.setData({
      currentIndex:index,
      type: type
    })
    this.getList()
  },

  // 获取订座列表
  getList() {
    let data = {
      shopId: app.globalData.shopId,
      type: this.data.type,
      pageNum: this.data.pageNo,
      pageSize: this.data.pageSize,
      createTime: this.data.createTime
    }
    serviceMngModel.reserveTablesList(data).then(res=>{
      let list = [...res.result]
      list.forEach((item,index,arr)=>{
        if (item.portrait_url != "") {
          var rep = /^(http|https)/g;
          var matches = rep.exec(item.portrait_url);
          if (matches) {
            arr[index].img = item.portrait_url;
          } else {
            arr[index].img = config.IMG + item.portrait_url+'.th';
          }
        } else {
          arr[index].img= config.IMG + '/template/15233642765accb1b481d89.png'+'.th'
        }
        arr[index].arrive_time = arr[index].arrive_time.substr(5, 5)
        arr[index].seat_name = item.floorSeatList[0] ? item.floorSeatList[0].seat_name : '';
      })
      this.setData({
        dataList: list
      })
    })
  },

  // 修改订座状态
  _updateTableType(type, id) {
    let data = {
      shopId: app.globalData.shopId,
      type: type,
      reserveTablesId: id
    }
    serviceMngModel.updateTableType(data).then(res=>{
      if(res.code==0) {
        showToast('修改成功', '', 'success')
        return
      }
      showToast('操作失败')
    })
  },

  // 点击取消按钮
  handleCancel(e) {
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定完成吗？',
      success: res => {
        if (res.confirm) {
          this._updateTableType(3, id)
          if(this.data.type!=1) {
            this.setData({
              type: 1
            })
          }
          this.getList()
        }
      }
    })
    
  },

  // 点击完成按钮
  handleSuccess(e) {
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定完成吗？',
      success: res=>{
        if(res.confirm) {
          this._updateTableType(4, id)
          if (this.data.type != 1) {
            this.setData({
              type: 1
            })
          }
          this.getList()
        }
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