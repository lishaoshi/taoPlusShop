import customeMng from '../../api/customerMng.js'
let customeMngModel = new customeMng()
const app = getApp()
import config from '../../config.js'

// pages/customerMng/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeArr:[
      {
        name: '全部',
        type: 1
      },
      {
        name: '推广员',
        type: 2
      },
      {
        name: '锁客',
        type: 3
      }
    ],
    currentIndex: 0,
    pageSize: 9,
    pageNo: 1,
    name : '',
    keyword : '',
    isMe : '',
    notMe : '',
    promote : '',
    dataList: [],
    imgsrc: '/images/lock.png',
    flagModel: false,
    checkList: [
      {
        name: '我锁定的',
        type: 1,
        checked: false
      },
      {
        name: '非我锁定的',
        type: 2,
        checked: false
      },
      {
        name: '推广员',
        type: 3,
        checked: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getCustomerList()
    this._getGroupList()
  },

  // 点击头部选择客户类型
  chooseType(e) {
    let index = e.currentTarget.dataset.index
    let name = e.currentTarget.dataset.name
    switch(index) {
      case 0:
        this.setData({
          name : '',
          keyword : '',
          isMe : '',
          notMe : '',
          promote : ''
        })
        break;
      case 1:
        this.setData({
          name: '',
          keyword: '',
          isMe: '',
          notMe: '',
          promote: '1'
        })
        break;
      case 2:
        this.setData({
          name: '',
          keyword: '',
          isMe: '1',
          notMe: '',
          promote: '0'
        })
        break;
      default:
        this.setData({
          name: name,
          keyword: '',
          isMe: '',
          notMe: '',
          promote: '0'
        })


    }
    this.setData({
      currentIndex: index
    })
    this._getCustomerList()
  },

  // 打电话
  goCall(e) {
    let phone = e.currentTarget.dataset.phone 
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  // 获取客户列表
  _getCustomerList() {
    let data = {
      id: '',
      memberId: '',
      shopId: app.globalData.shopId,
      pageNum: this.data.pageNo,
      pageSize: this.data.pageSize,
      name : this.data.name,
      keyword: this.data.keyword,
      isMe: this.data.isMe,
      notMe: this.data.notMe,
      promote: this.data.promote
    }
    customeMngModel.getShopCustomerList(data).then(res=>{
      res.shopUserMemberVoList.forEach((item, index, arr)=>{
        if (!item.portrait_url.includes('http')) {
          arr[index].portrait_url = config.IMG + item.portrait_url+'.th'
        } else {
          arr[index].portrait_url = item.portrait_url
        }
      })
      this.setData({
        dataList: res.shopUserMemberVoList
      })
    })
  },

  // 筛选
  checkboxChange(e) {
    console.log(e)
    let valueArr = e.detail.value
    if (valueArr.includes('1')) {
      this.setData({
        isMe: 1
      })
    }
    else if (valueArr.includes('2')) {
      this.setData({
        notMe: 2
      })
    }
    else if (valueArr.includes('3')) {
      this.setData({
        promote: 3
      })
    }
  },

  // 确认筛选按钮
  confirmChoose() {
    this.setData({
      flagModel: false
    })
    this._getCustomerList()
  },

  // 获取分组列表
  _getGroupList() {
    customeMngModel.getGroupList({},app.globalData.shopId).then(res=>{
      let arr = this.data.typeArr.slice(0, 3)
      this.setData({
        typeArr: [...arr, ...res]
      })
    })
  },

  // 打开选择
  openBtn() {
    wx.showActionSheet({
      itemList: ['分组管理', '筛选'],
      success:(res)=> {
        // console.log(res.tapIndex)
        if(res.tapIndex==0) {
          wx.navigateTo({
            url: '/pages/groupMng/index',
          })
        } else if (res.tapIndex==1) {
          this.setData({
            flagModel: true
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  //获取input value值
  getInputValue(e) {
    let value = e.detail.value
    this.setData({
      keyword: value
    })
    this._getCustomerList()
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