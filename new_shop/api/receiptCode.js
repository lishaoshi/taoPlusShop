// 收款码
import { http } from '../utils/http.js'

class receiptCode extends http {
  constructor() {
    super()
  }

  // 获取店铺收款码详情
  getCode(data) {
    let url = `/shop/secondPic`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default receiptCode