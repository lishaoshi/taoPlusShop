import goodsMng from '../../api/goodsMng.js'
import unit from '../../api/unit.js'
import { showToast } from '../../utils/util.js'
import config from '../../config.js'
let unitModel = new unit()
let goodsMngModel = new goodsMng()
const app = getApp()

// pages/addGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsTypeList: [],
    index: 0,
    unitList: [],
    unitIndex: 0,
    imgList: [],
    imgUrl: '',
    goodsName:'',
    marketPrice: '',   //原价
    shopPrice: '',     //现价
    goodsNumber: '',   //库存
    goodsSort:'',      //排序
    introduce: '',      //介绍
    imgPath: '',
    isEdit: false,
    delImg: '',
    goodsId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let isEdit = options.isEdit?true:false
    this._getUnitList()
    this._queryGoodsTypeList()
    this.setData({
      isEdit:isEdit
    })
  },

  // 获取商品详情
  getGoodsInfo() {
    let info = wx.getStorageSync('goodsInfo')
    let classIndex =  this.data.goodsTypeList.findIndex(item=>{
      return item.class_id == info.class_id || 0
    })
    let unitIndex = this.data.unitList.findIndex(item=>{
      return item.goods_unit_id == info.goods_unit_id || 0
    })
    console.log(unitIndex)
    this.setData({
      goodsName: info.goods_name,
      imgList: info.banner,
      marketPrice: info.market_price,
      shopPrice: info.shop_price,
      goodsNumber: info.inventory,
      goodsSort: info.sort,
      introduce: info.described,
      index: classIndex,
      unitIndex: unitIndex,
      goodsId: info.goods_id
    })
    console.log(this.data)
  },

  // 点击选择图片
  upLoadGoodsImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.uploadFile(tempFilePaths[0])
      }
    })
  },

  // 封装微信上传文件
  uploadFile(value) {
    wx.uploadFile({
      url: config.base_url+'/file/upload',
      filePath: value,
      name: 'file',
      success:(res)=> {
        // console.log(typeof res.data)
        const data = JSON.parse(res.data)
        let banner = [...this.data.imgList]
        
        banner.push({ "fileId": data.result.file_id, "path": data.result.path, "sort": "0" });
        //do something
        this.setData({
          imgList: banner
        })
      }
    })
  },

  // 删除图片按钮
  delImg(e) {
    let index = e.currentTarget.dataset.index
    let delImg = this.data.delImg
    if (this.data.imgList[index].goods_pic_id) {
      delImg = this.data.imgList[index].goods_pic_id + ',';
    }
    this.data.imgList.splice(index,1)
    this.setData({
      imgList: this.data.imgList,
      delImg: delImg
    })
  },

  // 保存商品
  saveGoods() {
    if (this.data.imgList.length < 1) {
      showToast('请上传商品图片')
      // alert('请上传商品图片');
      return;
    }
    if (!this.data.goodsName) {
      // alert('商品名称不能为空');
      showToast('商品名称不能为空')
      return;
    }
    if (!this.data.goodsNumber) {
      // alert('库存不能为空');
      showToast('库存不能为空')
      return;
    }
    if (!this.data.marketPrice) {
      // alert('商品价格不能为空');
      showToast('商品价格不能为空')
      return;
    }
    if (this.data.shopPrice < 0.02) {
      // alert('商品单价不能小于0.02元');
      showToast('商品单价不能小于0.02元')
      return;
    }
    // banner[0].sort = "1";
    
    if(!this.data.isEdit) {
      this.addGoods()
      return
    }
    this.editGoods()
    
  },

  // 新增商品
  addGoods() {
    let key = `imgList[0].sort`
    this.setData({
      [key]: 1
    })
    let data = {
      shopId: app.globalData.shopId,
      goodsName: this.data.goodsName,
      classId: this.data.goodsTypeList[this.data.index].class_id,
      inventory: this.data.goodsNumber,
      described: this.data.introduce,
      banner: JSON.stringify(this.data.imgList),
      goodsUnitId: this.data.unitList[this.data.unitIndex].goods_unit_id,
      marketPrice: this.data.marketPrice || 0,
      shopPrice: this.data.shopPrice,
      sort: this.data.goodsSort|| 0
    }
    goodsMngModel.addGoods(data).then(res=>{
      showToast('新增成功', '', 'success')
      setTimeout(()=>{
        wx.navigateBack()
      }, 1000)
    })
  },

  // 修改商品editGoods
  editGoods() {
    let key = `imgList${[this.data.imgList.length-1]}.sort`
    this.setData({
      [key]: 1
    })
    let data = {
      shopId: app.globalData.shopId,
      goodsName: this.data.goodsName,
      classId: this.data.goodsTypeList[this.data.index].class_id,
      inventory: this.data.goodsNumber,
      described: this.data.introduce,
      banner: JSON.stringify(this.data.imgList),
      goodsUnitId: this.data.unitList[this.data.unitIndex].goods_unit_id,
      marketPrice: this.data.marketPrice || 0,
      shopPrice: this.data.shopPrice,
      sort: this.data.goodsSort || 0,
      delBanner: this.data.delImg,
      goodsId: this.data.goodsId
    }
    goodsMngModel.editGoods(data).then(res => {
      if(res.code==0) {
        showToast('修改成功', '', 'success')
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      } else {
        showToast('编辑失败')
      }
    })
  },

  // 选择单位出发
  bindGoodsUnitId(e) {
    // console.log(e)
    let index = e.detail.value
    this.setData({
      unitIndex: index
    })
  },

  //选择分类
  chooseClass(e) {
    let index = e.detail.value
    this.setData({
      index: index
    })
  },

  // 查询商品分类列表
  _queryGoodsTypeList() {
    let data = {
      shopId: app.globalData.shopId
    }
    goodsMngModel.queryGoodsTypeList(data).then(res => {
      this.setData({
        goodsTypeList: res.result
      })
      if(this.data.isEdit) {
        this.getGoodsInfo()
      }
    })
  },

  // 查询商品单位列表
  _getUnitList() {
    unitModel.getUnitList().then(res=>{
      this.setData({
        unitList: res.result
      })
    })
  },

  // 获取商品名称
  getGoodsName(e) {
    let value = e.detail.value
    this.setData({
      goodsName: value
    })
  },

  // 获取商品原价
  getGoodsOriginPrice(e) {
    let value = e.detail.value
    this.setData({
      marketPrice: value
    })
  },
  // 获取商品现价
  getGoodsNowPrice(e) {
    let value = e.detail.value
    this.setData({
      shopPrice: value
    })
  },
  // 获取商品库存
  getGoodsNumber(e) {
    let value = e.detail.value
    this.setData({
      goodsNumber: value
    })
  },
  // 获取商品排序
  getGoodSort(e) {
    let value = e.detail.value
    this.setData({
      goodsSort: value
    })
  },
  // 获取商品介绍
  getGoodsIntroduce(e) {
    let value = e.detail.value
    this.setData({
      introduce: value
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
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage._queryGoodsTypeList()
    // prevPage._queryGoodsList()
    // console.log(prevPage)
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