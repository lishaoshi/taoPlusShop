// 用户登录
import { http } from '../utils/http.js'

class login extends http {
  constructor() {
    super()
  }

// 用户登录
  signIn(params) {
    let url = `/shop/login`
    let data = {
      url,
      method: 'POST',
      data:params
    }
    return this.request(data)
  }

//发送验证码
  sendCode(params) {
    let url = `/user/sendVcode`
    let data = {
      url,
      method: `POST`,
      data: params
    }
  }
}

export default login