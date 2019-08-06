// 核销订单

import {http} from '../utils/http.js'

class verify extends http {
  constructor() {
    super()
  }

  // 券码查询
  queryTicket(data, coupon_code, shopId) {
    let url = `/api/user/order/ticket/${coupon_code}/${shopId}`
    let params = {
      url, 
      data,
      method: 'get'
    }
    return this.request(params)
  }

// 核销订单
  verifyOrder(data, shopId, orderId) {
    let url = `/api/order/${shopId}/order/${orderId}`
    let params = {
      url, 
      data
    }
    return this.request(params)
  }
}

export default verify