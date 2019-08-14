import { http } from '../utils/http.js'

class timePeriod extends http {
  constructor() {
    super()
  }

  // 获取时段列表
  // /bcdshop/selectTimeIntervalList
  selectTimeIntervalList(data) {
    let url =  `/bcdshop/selectTimeIntervalList`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 添加时段
  addTimePeviod(data) {
    let url = `/bcdshop/addOrUpdateTimeInterval`
    let params = {
      url,
      data
    }
    return this.request(params)
  }
}

export default timePeriod