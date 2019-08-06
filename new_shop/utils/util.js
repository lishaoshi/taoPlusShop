const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const showToast = function (title, duration, icon) {
  wx.showToast({
    title: title,
    duration: duration ? duration: 1500,
    icon:icon?icon:'none'
  })
}

module.exports = {
  formatTime: formatTime,
  showToast
}
