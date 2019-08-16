import shopInfo from '../../api/shopInfo.js'
let shopInfoModel = new shopInfo()
// pages/change_password/change_password.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPsw: '',
    newPsw: '',
    confirmPsw: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 获取输出框
  getInputValue(e) {
    let value = e.detail.value
    let flag = e.currentTarget.dataset.flag
    switch (flag) {
      case 'old':
        key =  'oldPsw'
        break;
      case 'new':
        key = 'newPsw'
        break;
      case 'confirm':
        key = 'confirmPsw'
        break;
    }
    this.setData({
      [key]: value
    })
  },

  // 修改密码
  _changePassword() {
    if (!this.data.oldPsw || !this.data.newPsw || !this.data.confirmPsw) {
      showToast('表单不能为空')
      return
    }
    if (this.data.oldPsw ==this.data.newPsw) {
      showToast('旧密码与新密码不能一致')
      return
    }
    if (this.data.confirmPsw != this.data.newPsw) {
      showToast('新密码与确认密码不一致')
      return
    }
    shopInfoModel.changePassword(data).then(res=>{
      if (data.code === 0) {
        showToast('修改成功');
      } else {
        showToast(res.message);
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