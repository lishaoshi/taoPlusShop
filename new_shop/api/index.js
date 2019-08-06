// 小程序首页

import {http} from '../utils/http.js'

class index extends http {
  constructor() {
    super()
  }

  //获取商家账户余额
  getShopBalance(params) {
    let url = `/shop/getShopBalance`
    let data = {
      url,
      data: params
    }
    return this.awaitToken(data).then(data=>{
      return this.request(data)
    })
  }
  
// 获取用户信息
  getUserInfo(params) {
    let url = `/user/getUserInfo`
    let data = {
      url,
      data: params
    }
    return this.awaitToken(data).then(data => {
      return this.request(data)
    })
  }

  // 获取商家营业数据（今日收益、浏览人数、订单数、点评数、收藏数）
  getBusinissInfo(params) {
    let url = `/shop/getBusinessInfo`
    let data = {
      url,
      data: params
    }
    return this.awaitToken(data).then(data => {
      return this.request(data)
    })
  }

  // 设置商家营业状态  1、营业中  2、休息中
  setShopWorkStatus(data) {
    let url = `/shop/setShopWorkStatus`
    let params = {
      url, 
      data
    }
    return this.request(params)
  }
}

export default index