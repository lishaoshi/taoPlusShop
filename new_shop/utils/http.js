import config from '../config.js'
// console.log(config.base_url)
const app = getApp()
// console.log(app)
var showLoading = function () {
  wx.showLoading({
    title: ''
  })
}
var hideLoading = function () {
  wx.hideLoading()
}

class http {
  constructor() {
    this.baseUrl = config.base_url;
  }
  request(params = {}, flag = false) {
    // if (flag) {
    //   showLoading()
    // }
    flag && showLoading()
    if (!params.data) {
      params.data = {};
    }
    params.data.token = app.globalData.token;
    params.method = params.method ? params.method : 'POST'
    const promise = new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + params.url,
        data: params.data,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: params.method,
        success: (res) => {
          if (res.statusCode == 200) {
            resolve(res.data);
          } else {
            errorShow(res.data.message || '服务器错误');
          }
        },
        fail: (err) => {
          errorShow(err.message);
          reject()
        },
        complete: function () {
          flag&&hideLoading()
        }
      })
    })
    return promise
  }

 awaitToken(params) {
  return new Promise((resolve, reject) => {
    // 等待token
    if (!app.globalData.token) {
      let awaitToken = setInterval(() => {
        if (this.token) {
          clearInterval(awaitToken);
          awaitToken = '';
          resolve(params);
        }
      }, 100);
      setTimeout(() => {
        if (awaitToken) {
          clearInterval(awaitToken);
          wx.showToast({
            title: '网络错误',
            icon: 'none',
          })
        }
        reject()
      }, 8000)
    } else {
      resolve(params)
    }
  })
}
}

export {
  http
}