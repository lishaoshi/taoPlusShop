class http {
  constructor() {
    this.baseUrl = globalConfig.api_blink_url;
  }
  request(params = {}, flag = false) {
    if (flag) {
      showLoading()
    }
    if (!params.data) {
      params.data = {};
    }
    params.data.access_token = globalConfig.access_token;
    params.method = params.method ? params.method : 'GET'
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
          hideLoading()
        }
      })
    })
    return promise
  }
}

export {
  http
}