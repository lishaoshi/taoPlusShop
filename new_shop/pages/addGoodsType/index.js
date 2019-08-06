import goodsMng from '../../api/goodsMng.js'
import { showToast} from '../../utils/util.js'
let goodsMngModel = new goodsMng()
const app = getApp()
// pages/addGoodsType/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    isEdit: false,
    className: '',
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._queryGoodsTypeList()
  },
  // 查询商品分类列表
  _queryGoodsTypeList() {
    let data = {
      shopId: app.globalData.shopId
    }
    goodsMngModel.queryGoodsTypeList(data).then(res => {
      this.setData({
        dataList: res.result,
        classId: res.result[0].class_id,
      })
      // this._queryGoodsList()
    })
  },

  // 点击编辑按钮
  editgoodsType() {
    this.setData({
      isEdit: true
    })
  },

  // 获取新增分类input名称
  addGoodsTypeName(e) {
    console.log(e)
    let name = e.detail.value
    this.setData({
      className: name
    })
  },

  // 删除商品分类
  delType(e) {
    let index = e.currentTarget.dataset.index
    let classId = this.data.dataList[index].class_id
    wx.showModal({
      title: '提示',
      content: '要永久删除该分类吗？',
      success:res=>{
        // console.log(res)
        if (res.confirm) {
          let data = {
            shopId: app.globalData.shopId,
            classId: classId
          }
          goodsMngModel.delGoodsType(data).then(res=>{
            showToast('删除成功')
            this._queryGoodsTypeList()
          })
        }
      }
    })
  },

  // 点击完成按钮
  confirmGoodsType() {
    if(this.data.isEdit) {
      this.setData({
        isEdit: false
      })
      let data = {
        shopId: app.globalData.shopId,
        classJSON: JSON.stringify(this.data.dataList)
      }
      goodsMngModel.updataGoodsType(data).then(res => {
        showToast('修改成功')
        this._queryGoodsTypeList()
      })
    } else {
      if(!this.data.className) {
        showToast('请输入分类名称后确认！')
        return
      }
      let data = {
        className: this.data.className,
        shopId: app.globalData.shopId,
        classId:''
      }
      goodsMngModel.addGoodsType(data).then(res=>{
        showToast('添加成功')
        this._queryGoodsTypeList()
      })

    }
  },

  // 输出框失去焦点时触发
  inputBlur(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    let value = e.detail.value
    if(!value) {
      return
    }
    let key = `dataList[${index}].class_name`
    this.setData({
      [key]: value
    })
  },

  // 点击排序
  sortTypleList(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.index
    if(index==0) {
      let arr = this.data.dataList.splice(index, 1, this.data.dataList[index + 1])
      this.data.dataList.splice(index+1, 1, arr[0])
      this.data.dataList.forEach((item, key, arr)=>{
        arr[key].sort = key+1
      })
      console.log(this.data.dataList)
      // return
      this.setData({
        dataList: this.data.dataList
      })
      return
    }
    let arr = this.data.dataList.splice(index-1, 1, this.data.dataList[index])
    this.data.dataList.splice(index , 1, arr[0])
    this.setData({
      dataList: this.data.dataList
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