// 获取用户信息
import { http } from '../utils/http.js'

class user extends http {
  constructor() {
    super()
  }



// 更新用户信息
  editUserMsg(data) {
    let url = `/user/updateUserMsg`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}


export default user