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
    let url = `/api/basic/mobile/vlidate-code`
    let data = {
      url,
      data: params,
      method: 'POST'
    }
    return this.request(data)
  }

// 注册
// /user/registerAPP
  registerAPP(data) {
    let url = `/user/registerAPP`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 验证找回密码
  validateMobileAndVocde(data) {
    let url = `/shop/validateMobileAndVocde`
    let params= {
      url,
      data
    }
    return this.request(params)
  }

  // 修改密码
  // shop/setNewPassword
  setNewPassword(data) {
    let url = `/shop/setNewPassword`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default login