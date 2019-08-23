// 入驻支付
import { http } from '../utils/http.js'

class shopPayBalance extends http {
  constructor() {
    super()
  }

  // 获取商家入驻支付金额
  getShopPayAmount(data) {
    let url = `/settled/shop/fee`
    let params = {
      url,
      data,
      method: 'get'
    }
    return this.request(params)
  }

  // 确定支付
  confirmPay(data) {
    let url = `/settled/shop/payment`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default shopPayBalance

