import spellGroup from '../../api/spellGroup.js'
let spellGroupModel = new spellGroup()
const app = getApp()

// pages/spellGroup/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: ['全部','在售','停售'],
    goodsTypeList: [],   //商品分类列表
    index: -1,
    goodsList:[],    //团购商品列表
    typeName: '',
    class_id: '',
    pageNo: 1,
    pageSize: 9,
    type:0,
    currentIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._queryGoodsTypeList()
    this._getGroupList()
  },

  // 查询商品分类列表
  _queryGoodsTypeList() {
    let data = {
      shopId: app.globalData.shopId
    }
    spellGroupModel.queryGoodsTypeList(data).then(res=>{
      this.setData({
        goodsTypeList: res.result
      })
    })
  },
  // 点击团购订单，查看团购用户
  queryDetail(e) {
    let goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '/pages/spellGroupDetail/index?goodsid='+goodsId,
    })
  },

  // 选择团购商品类型
  bindPickerChange(e) {
    let index = e.detail.value
    this.setData({
      type: '',
      index,
      class_id: this.data.goodsTypeList[index].class_id,
    })
    this._getGroupList()
  },

  // 点击拼购列表状态 默认全部 1、在售   -1、停售
  chooseType(e) {
    let index = e.currentTarget.dataset.index
    let type = 0
    // index == 0 && type =''
    // index == 1 && type = 1
    // index == 2 && type= -1
    if(index==0) {
      type = ''
    } else if (index == 1){
      type = 1
    } else {
      type = -1
    }
    console.log(type,index)
    this.setData({
      currentIndex: index,
      type: type
    })
    this._getGroupList()
  },

  // 前往发起团购页面
  goInsertGroupGoods() {
    wx.navigateTo({
      url: '/pages/addGroupGoods/index',
    })
  },

  // 获取团购商品列表
  _getGroupList() {
    let data = {
      type: this.data.type,
      class_id: this.data.class_id,
      pageNum: this.data.pageNo,
      pageSize: this.data.pageSize
    }
    spellGroupModel.getGroupList(data, app.globalData.shopId).then(res=>{
      let status
     
      res.forEach((item, index, arr)=>{
        arr[index].typeName = ''
        // console.log(item.type)
        switch (item.type) {
          case 1:
            status = '进行中';
            break;
          case -1:
            status = '已结束';
            break;
          case 0:
            status = '未开始';
            break;
          case 2:
            status = '已取消';
            break;
        }
        arr[index].typeName = status
      })
      // let key = `goodsList${index}.typeName`
      this.setData({
        goodsList: res,
      })
      
      // this.setData({
      //   [key]: status
      // })
    })
  },

  // 取消团购
  delGroupGoods(e) {
    let goodsId = e.currentTarget.dataset.goodsid
    wx.showModal({
      title: '提示',
      content: '确定取消团购吗？',
      success: res=>{
        if(res.confirm) {
          this._cancelGroupGoods(goodsId)
        }
      }
    })

  },

  // 取消团购接口函数
  _cancelGroupGoods(goodsId) {
    let data = {
      goodsId
    }
    spellGroupModel.cancelGroupGoods(data, goodsId).then(res=>{
      this._getGroupList()
      wx.showToast({
        title: '取消成功',
      })
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