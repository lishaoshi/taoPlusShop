import config from '../config.js'
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
  // console.log(title, duration,icon )
  wx.showToast({
    title: title,
    duration: duration ? duration: 1500,
    icon:icon?icon:'none'
  })
}

// 保存图片
const saveImg = (url)=>{
  // console.log(config.base_url + url)
  // wx.saveImageToPhotosAlbum({
  //   filePath: config.base_url+url,
  //   success:(res)=> {
  //     console.log(res,'111')
  //     showToast('保存成功')
  //   },
  //   fail:()=>{
  //     console.log('fail')
  //   },
  //   complete:()=>{
  //     console.log('complete')
  //   }
  // })
  // console.log(url.includes(config.base_url))
  let confromUrl = url.includes(config.base_url) ? url : config.base_url+url
  wx.downloadFile({
    url: confromUrl, //仅为示例，并非真实的资源
    success(res) {
      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
      if (res.statusCode === 200) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:()=>{
            showToast('保存成功')
          },
          fail:()=>{
            showToast('保存失败')
          }
        })
        
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  showToast,
  saveImg
}
