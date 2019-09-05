import goodsMng from '../../api/goodsMng.js'

let goodsMngModel = new goodsMng()
const app = getApp()
// pages/goodsMng/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId:'',
    goodsList: [],
    goodsTypeList: [],
    onSale: 1,
    pageNo: 1,
    pageSize: 9,
    total: 0,
    currentIndex: 0,
    no_sale_num: 0,   //下架数
    on_sale_num: 0,  //上架数
    typeArr: [
      {
        name: '出售中',
        flag: 1
      },
      {
        name: '已下架',
        flag: -1
      }
    ],
    currentTypeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._queryGoodsTypeList()
    // this._queryGoodsList()
  },

  // 点击商品类型
  tabGoodsType(e) {
    // console.log(e)
    let item = e.detail.item
    // console.log(item)
    this.setData({
      classId: item.class_id
    })
    this._queryGoodsList()
  },

  // 编辑按钮
  goEdit(e) {
    let goodsId = e.currentTarget.dataset.goodsid
    this._queryGoodsDetail(goodsId)
    wx.navigateTo({
      url: '/pages/addGoods/index?isEdit=1',
    })
  },

  // 查询商品分类列表
  _queryGoodsTypeList() {
    let data = {
      shopId: app.globalData.shopId
    }
    goodsMngModel.queryGoodsTypeList(data).then(res => {
      this.setData({
        goodsTypeList: res.result,
        classId: res.result[0].class_id
      })
      this._queryGoodsList()
    })
  },

  // 查询商品详情
  queryDetail(e) {
    let goodsId = e.currentTarget.dataset.goodsid
    this._queryGoodsDetail(goodsId)
    wx.navigateTo({
      url: '/pages/goodsDetail/index',
    })
  },

  // 查询商品详情
  _queryGoodsDetail(goodsId) {
    let data = {
      goodsId: goodsId,
      userId: app.globalData.userId
    }
    goodsMngModel.queryGoodsDetail(data).then(res=>{
      wx.setStorageSync('goodsInfo', res.result)
    })
  },

  // 删除商品按钮
  delGoods(e) {
    console.log(e)
    let gonndsId = e.currentTarget.dataset.goodsid
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定删除该商品吗？',
      success:(res)=>{
        // consloe.log(res)
        if(res.confirm) {
          let data = {
            goodsId: gonndsId
          }
          goodsMngModel.delGoods(data).then(res=>{
            if(res.code==0) {
              let dataList = [...this.data.goodsList]
              dataList.splice(index, 1)
              console.log(dataList)
              this.setData({
                goodsList: dataList,
                on_sale_num: --this.data.on_sale_num
              })
              wx.showToast({
                title: '删除成功'
              })
            }
          })
        }
      }
    })
  },

  // 设置上下架
  setSale(e) {
    console.log(e)
    // return
    let saleFlag = e.currentTarget.dataset.saleflag
    let goodsId = e.currentTarget.dataset.goodsid
    wx.showModal({
      title: '提示',
      content: `确定设置该商品${saleFlag==1?'下架':'上架'}?`,
      success: res=>{
        if(res.confirm) {
          saleFlag == 1 && this._goodsOffSale(goodsId)
          saleFlag == -1 && this._goodsOnSale(goodsId)
        }
      }
    })
  },

  // 上架设置
  _goodsOnSale(goodsId) {
    let data = {
      goodsId
    }
    goodsMngModel.goodsOnSale(data).then(res=>{
      wx.showToast({
        title: '设置成功',
      })
      this._queryGoodsList()
    })
  },

  // 设置下架
  _goodsOffSale(goodsId) {
    let data = {
      goodsId
    }
    goodsMngModel.goodsOffSale(data).then(res => {
      wx.showToast({
        title: '设置成功',
      })
      this._queryGoodsList()
    })
  },

  // 点击选择出售中或者已下架
  chooseTape(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let flag = e.currentTarget.dataset.flag
    this.setData({
      currentTypeIndex: index,
      onSale: flag
    })
    this._queryGoodsList()
  },
  // 获取商品列表
  _queryGoodsList() {
    let data = {
      shopId: app.globalData.shopId,
      pageNum: this.data.pageNo,
      classId: this.data.classId,
      onSale: this.data.onSale,
      pageSize: this.data.pageSize
    }
    goodsMngModel.queryGoodsList(data).then(res=>{
      this.setData({
        total: res.total,
        goodsList: res.result,
        on_sale_num: res.on_sale_num,
        no_sale_num: res.no_sale_num
      })
    })
  },
  // 点击新增分类
  addGoodsType() {
    wx.navigateTo({
      url: '/pages/addGoodsType/index',
    })
  },
  // 点击底部添加商品按钮
  goAddGoods() {
    wx.navigateTo({
      url: '/pages/addGoods/index',
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
    if(this.data.goodsList.length <= this.data.total) {
      return
    }
    this.setData({
      pageNo: ++this.pageNo
    })
    this._queryGoodsList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})