// 上传图片
import { http } from '../utils/http.js'

class uploadImg extends http {
  constructor() {
    super()
  }

  // 上传图片
  upload(data) {
    let url = `/file/upload`
    let params = {
      url,
      data,
      header: {
        'content-type': 'multipart/form-data'
      }
    }
    return this.request(params)
  }
}


export default uploadImg