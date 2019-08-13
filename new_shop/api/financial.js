// 财务管理
import { http } from '../utils/http.js'

class financial extends http {
  constructor() {
    super()
  }

  // 获取账户余额
  getBalance(data) {
    let url = `/shop/getAccountByDetails`

    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 获取用户银行卡
  getBankCard(data) {
    let url = `/api/user/bankcard/getMyBankCard`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 提现
  _shopWithdrawals(data) {
    let url = `/shop/shopWithdrawals`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 获取银行卡列表
  getBankCardList(data) {
    let url = `/shop/bankcard/getMyBankCard`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

  // 删除银行卡列表
  delBankCard(data) {
    let url = `/api/user/bankcard/deleteBankCard`
    let params = {
      url,
      data
    }
    return this.request(params)
  }

// 获取全部银行名称
  getAllBankName() {
    let url = '/api/bankcard/names'
    let data = {
      data: {},
      url: url,
      method: 'get'
    }
    return this.request(data)
  }

  // 获取验证码
  getcode(params) {
    let url = `/api/basic/mobile/vlidate-code`
    let data = {
      url,
      data: params,
      method: 'POST'
    }
    return this.request(data)
  }
}

export default financial