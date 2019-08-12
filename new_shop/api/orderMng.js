// 订单管理
import { http } from '../utils/http.js'

class orderMng extends http {
  constructor() {
    super()
  }
  getOrderList(data) {
    let url = `/order/orderList`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default orderMng