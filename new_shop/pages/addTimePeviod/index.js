
const app = getApp()
import timePeriod from '../../api/timePeriod.js'
let timePeriodModel = new timePeriod()
import { showToast } from '../../utils/util.js'
// pages/addTimePeviod/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '00:00',
    endTime: '00:00',
    nowTima: '',
    weekDate: [
      {
        name: '日',
        type: 0,
        flag: false
      },
      {
        name: '一',
        type: 1,
        flag: false
      },
      {
        name: '二',
        type: 2,
        flag: false
      },
      {
        name: '三',
        type: 3,
        flag: false
      },
      {
        name: '四',
        type: 4,
        flag: false
      },
      {
        name: '五',
        type: 5,
        flag: false
      },
      {
        name: '六',
        type: 6,
        flag: false
      },
    ],
    targetWeekArr: [],
    value: '',
    intervalId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNowDate()
    if (options.isEdit) {
      this.getTimeInfo()
    }
  },

  // 获取当前时间
  getNowDate() {
    let date = new Date()
    let h = date.getHours()
    let m = date.getMinutes()
    // console.log(h, m)
    this.setData({
      value: `${h}:${m}`
    })
    console.log(this.data)
  },

  // 点击选择日期
  chooseDate(e) {
    let index = e.currentTarget.dataset.index
    let key = `weekDate[${index}].flag`
    let arr = [...this.data.targetWeekArr]
    
    // let arr = this.data.targetWeekArr.filter(word=>{
    //   return word !== undefined && word !== null && word!==','
    // })
    // console.log( this.data.targetWeekArr)
    if (this.data.weekDate[index].flag) {
      // arr.splice(index,1)
      // console.log(index, arr)
      let key = arr.findIndex(item=>{
        return item == index
      })
      console.log(key)
      arr.splice(key, 1)
    } else {
      arr.push(index)
      console.log(arr)
    }
    // console.log(arr,index)
    this.setData({
      [key]: !this.data.weekDate[index].flag,
      targetWeekArr: arr
    })
  },

  // 添加时段
  addTime() {
    let data = {
      shopId: app.globalData.shopId,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
      intervalId: this.data.intervalId,
      week: this.data.targetWeekArr.join(',')
    }
    timePeriodModel.addTimePeviod(data).then(res=>{
      if(res.code==0) {
        showToast(`${this.data.intervalId ?'操作成功':'修改成功'}`, '', 'success')
        setTimeout(()=>{
          wx.navigateBack()
        }, 1000)
      }
    })
  },

  // 获取缓存中的时段数据
  getTimeInfo() {
    let data = wx.getStorageSync('timePer')
    let key 
    data.weeks.forEach((item,index,arr)=>{
      let keys = this.data.weekDate.findIndex((items)=>{
        return items.name==item
      })
      key = `weekDate[${keys}].flag`
      this.setData({
        [key]: true
      })
    })
    this.setData({
      startTime: data.start_time,
      endTime: data.end_time,
      intervalId: data.interval_id,
      targetWeekArr: [...data.week]
    })
  },

  //获取选择时间
  bindTimeChange(e) {
    let time = e.detail.value
    let flag = e.currentTarget.dataset.flag
    if(flag=='start') {
      this.setData( {
        startTime: time
      })
    } else {
      this.setData({
        endTime: time
      })
    }
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
    let page = getCurrentPages()
    let perPage = page[page.length-2]
    perPage._selectTimeIntervalList()
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