import spellGroup from '../../api/spellGroup.js'
let spellGroupModel = new spellGroup()
const app = getApp()
// pages/spellGroupDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerList: [
      {
        name: '全部',
        type: ''
      },
      {
        name: '进行中',
        type: 2
      },
      {
        name: '已成团',
        type: 5
      },
      {
        name: '未成团',
        type: 4
      },
      {
        name: '未开始',
        type: 1
      }
    ],
    currentIndex: 0,
    dataList: [
    ],
    type: '',
    pageNo: 1,
    pageSize: 9
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsId: options.goodsid
    })
    this.getGroupUserList()
  },

  // 获取团购用户列表
  getGroupUserList() {
    let data = {
      index: this.data.pageNo,
      pageSize: this.data.pageSize,
      type: this.data.type
    }
    spellGroupModel.queryGroupList(data, app.globalData.shopId,this.data.goodsId ).then(res=>{
      let status
      res.records.forEach((item,index, arr)=>{
        arr[index].typeName = ''
        switch (item.type) {
          case 1:
            status = '未开始';
            break;
          case 2:
            status = '进行中 ';
            break;
          case 3:
            status = '已结束  ';
            break;
          case 4:
            status = '已失效 ';
            break;
          case 5:
            status = '已满员 ';
            break;
        }
        arr[index].typeName = status
      })
     
      this.setData({
        dataList: res.records,
        total: res.size
      })
    })
  },

  // 点击查看拼团状态
  chooseStatus(e) {
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    this.setData({
      currentIndex: index,
      type:type
    })
    this.getGroupUserList()
  },

  // 查看性情
  goDetail(e) {
    console.log(e)
    let grouponsId = e.currentTarget.dataset.item.groupons_id
    wx.navigateTo({
      url: '/pages/spellGroupComplete/index?grouponsId=' + grouponsId,
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
    if(this.data.dataList == total) {
      truen
    }
    this.setData({
      pageNo: ++this.data.pageNo
    })
    this.getGroupUserList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})