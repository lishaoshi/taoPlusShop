// 账户明细
import { http } from '../utils/http.js'

class account extends http {
  constructor() {
    super()
  }

  // 获取账户明细列表
  getAccountList(data) {
    let url =  `/shop/getShopAccountDetails`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default account