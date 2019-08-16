import goodsMng from '../../api/goodsMng.js'
let goodsMngModel = new goodsMng()
import banner from '../../api/banner.js'
let bannerModel = new banner()
const app = getApp()
import config from '../../config.js'
import { showToast } from '../../utils/util.js'
// pages/add_banner/add_banner.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],
    multiIndex: [0, 0],
    pageNo: 1,
    classId: '',
    onSale: 1,
    pageSize: 999,
    goodsTypeList: [],
    goodsList: [],
    flag: false,
    imgPath: '',
    inputValue: '',
    goodsId: '',
    isEdit: false,
    goodsName: '',
    goodsPicId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    console.log(id)
    // return
    if (id) {
      this.setData({
        isEdit: true,
        flag: true,
        goodsPicId: id
      })
      this.defaultGoods(id)
    }
    this._queryGoodsTypeList()
  },

  // 默认选择商品函数
  defaultGoods(id) {
    // if(goodsId) {
    //   let index = this.data.goodsList.findIndex((item)=>{
    //     return item.goods_id == this.data.goodsId
    //   })
    //   let arr = [...this.data.multiIndex]
    // }
    let params = {
      shopGoodsPicId: id
    }
    bannerModel.getShopGoodsPic(params).then(res=>{
      if(res.code==0) {
        let data = res.result
        this.setData({
          inputValue: data.name,
          goodsName: data.goods_name,
          imgPath: data.path,
          classId: data.class_id,
          goodsId: data.goods_id
        })
        console.log(this.data)
      }
      
    })
  },
  _queryGoodsTypeList() {
    let data = {
      shopId: app.globalData.shopId
    }
    goodsMngModel.queryGoodsTypeList(data).then(res => {
      this.setData({
        goodsTypeList: res.result,
        classId: res.result[0].class_id,
        multiArray: [[...res.result],[]]
      })
      this._queryGoodsList()
      // this._queryGoodsList()
    })
  },

  // 获取广告名称
  getInputValue(e) {
    let value = e.detail.value
    this.setData({
      inputValue: value
    })
  },

  //打开选择图片
  addImg() {
    wx.chooseImage({
      success: (res) => {
        let tempFilePaths = res.tempFilePaths[0]
        this._uploadFiled(tempFilePaths)
      }
    })
  },

  // 添加轮播图
  _addShopGoodsPic() {
    if (!this.data.inputValue) {
      showToast('广告名称不能为空')
      return
    }
    if (!this.data.imgPath) {
      showToast('请上传文件')
      return
    }
    if (!this.data.goodsId) {
      showToast('请绑定商品')
      return
    }
    let data = {
      shopId: app.globalData.shopId,
      goodsPicName: this.data.inputValue,
      goodsId: this.data.goodsId,
      picPath: this.data.imgPath,
      isType: 1
    }
    bannerModel.addShopGoodsPic(data).then(res=>{
      if(res.code==0) {
        showToast('添加成功')
        setTimeout(()=>{
          wx.navigateBack()
        },500)
      } else {
        showToast(res.message)
      }
    })
  },

  //封装上传图片函数
  _uploadFiled(data) {
    wx.uploadFile({
      url: `${config.base_url}/file/upload`,
      filePath: data,
      name: 'file',
      formData: {
        token: app.globalData.token
      },
      success: (res) => {
        let data = JSON.parse(res.data)
        var imgPath = data.result.path;
        this.setData({
          imgPath: imgPath
        })
      }
    })
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
    goodsMngModel.queryGoodsList(data).then(res => {
      res.result.forEach((item,index, arr)=>{
        arr[index].class_name = item.goods_name
      })
      this.setData({
        total: res.total,
        goodsList: res.result,
        multiArray: [[...this.data.multiArray[0]], [...res.result]]
      })
    })
  },

  // 修改banner
  editBanner() {
    if (!this.data.inputValue) {
      showToast('广告名称不能为空')
      return
    }
    if (!this.data.imgPath) {
      showToast('请上传文件')
      return
    }
    if (!this.data.goodsId) {
      showToast('请绑定商品')
      return
    }
    let data = {
      shopGoodsPicId: this.data.goodsPicId,
      shopId: app.globalData.shopId,
      goodsPicName:this.data.inputValue,
      goodsId: this.data.goodsId,
      picPath: this.data.imgPath,
      isType: 1
    }
    bannerModel.updateBanner(data).then(res=>{
      if(res.code==0) {
        showToast('修改成功')
        setTimeout(()=>{
          wx.navigateBack()
        },1000)
      } else {
        showToast(res.message)
      }
    })
  },

  // 删除banner
  _delBanner() {
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success:(res)=>{
        if(res.confirm) {
          let data = {
            shopGoodsPicId: this.data.goodsPicId
          }
          bannerModel.delBanner(data).then(res=>{
            showToast('删除成功')
          })
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
    let pages = getCurrentPages()
    let perPage = pages[pages.length-2]

    perPage._getBannerList()
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

  },

  bindMultiPickerChange: function (e) {
    let targetArr = e.detail.value
    this.setData({
      multiIndex: targetArr,
      flag: true,
      goodsId: this.data.goodsList[targetArr[1]].goods_id,
      goodsName: this.data.goodsList[targetArr[1]].goods_name
    })
  },
  bindMultiPickerColumnChange: function (e) {
    let column = e.detail.column
    let value = e.detail.value
    if (column==1) {
      return
    }
    this.setData({
      classId: this.data.goodsTypeList[value].class_id
    })
    console.log(this.data, value)
    this._queryGoodsList()
  },


})