// 商家信息
import { http } from '../utils/http.js'

class shopInfo extends http {
  constructor() {
    super()
  }

  // 修改商家图片
  changeShopImg(data) {
    let url = `/shop/updateUserMsg`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 退出登录
  loginOut(data) {
    let url = `/shop/logout`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 修改密码
  changePassword(data) {
    let url = `/shop/changePassword`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default shopInfo