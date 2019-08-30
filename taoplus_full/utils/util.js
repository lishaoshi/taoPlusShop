const api = require('./api.js').api;
var app = getApp();

/**
 * 时间格式化
 */
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

/**
 * 微信授权登录
 * successCb: 成功后的回调函数
 * register: 是否跳转到注册页面
 */
const wxLogin = function(register = false) {
    // 查看是否授权
    return new Promise((resolve, reject) => {

        wx.login({
            success: function(res) {
             
                if (res.code) {
                    //发起网络请求
                    let err = false;
                    Post(api.wxLogin, {
                        client_id: app.globalData.clientId, //41f7b36a712c4bd4b636f1064c4a7846
                        client_secret: app.globalData.clientSecret,
                        scope: 1,
                        grant_type: 'wx_code',
                        code: res.code
                    }).then((res) => {
                        app.globalData.openid = res.openid;
                        app.globalData.sessionKey = res.session_key;
                        app.globalData.accessToken = res.access_token;
                        app.globalData.expiresIn = res.expires_in * 1000;
                        app.globalData.expiresTime = new Date().getTime();

                        let result = res.result;

                        if (!res.userBind) {
                            resolve(result);
                            if (register) {
                                //  wx.navigateTo({
                                //      url: '../register/register',
                                //  });
                                return;
                            }

                        } else {
                            uGet(api.getUser, {}, true).then((res) => {
                                
                                if (res) {
                                    console.log('用户信息', res)
                                    wx.setStorage({
                                        key: 'userId',
                                        data: res.user_id,
                                    })
                                    app.globalData.userId = res.user_id;
                                    app.globalData.mobile = res.mobile;
                                    app.globalData.nickName = res.nickname;
                                    app.globalData.portraitUrl = res.portrait_url;
                                    // app.globalData.username = res.username;
                                    console.log('登录授权')
                                }
                              resolve(result);
                            });


                        }

                    });


                } else {
                    console.log('登录失败！' + res.data.message);
                    reject(res.data.message);
                }
            }
        })
    })

}

const ajax = (method, url, data = {}, bool = true, resolve, reject) => {
    if (bool) {
        wx.showLoading({
            title: ' ',
        });
    }
    data.access_token = app.globalData.accessToken || '';
    wx.request({
        url: url,
        method: method,
        header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: data,
        success: function(res) {
            if (res.statusCode == 200) {
                resolve(res.data);
            } else {
                errorShow(res.data.message || '服务器错误');
            }

        },
        fail: function(res) {
            errorShow(res.data.message || '服务器错误');
            reject(res);
        },
        complete: function() {
            wx.hideLoading();

        }

    })
}

/**
 * 普通get请求
 * @params url 请求地址
 * @params data 请求数据
 * @params bool 是否显示加载框
 */
const Get = (url, data = {}, bool = true) => {
    return new Promise((resolve, reject) => {
        ajax('GET', url, data, bool, resolve, reject);
    })

};

/**
 * 需要授权后的get请求
 * @params url 请求地址
 * @params data 请求数据
 * @params bool 是否显示加载框
 * @params register 是否跳转到注册页面
 */
const uGet = (url, data = {}, bool = true, register = false) => {
    return new Promise((resolve, reject) => {
        let newTime = new Date().getTime();
        let expiresTime = app.globalData.expiresTime;
        let expiresIn = app.globalData.expiresIn;

        if (newTime - expiresTime > expiresIn) {
            wxLogin(register).then(() => {

                return Get(url, data, bool);
            }).then((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            })
        } else {
            Get(url, data, bool).then((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            })
        }
    })




};



/**
 * 普通的post请求
 * @params url 请求地址
 * @params data 请求数据
 * @params bool 是否显示加载框
 */
const Post = (url, data, bool = true) => {
    return new Promise((resolve, reject) => {
        ajax('POST', url, data, bool, resolve, reject);
    })

};

/**
 * 需要授权后的post请求
 * @params url 请求地址
 * @params data 请求数据
 * @params bool 是否显示加载框
 * @params register 是否跳转到注册页面
 */
const uPost = (url, data, bool = true, register = false) => {
    return new Promise((resolve, reject) => {
        let newTime = new Date().getTime();
        let expiresTime = app.globalData.expiresTime;
        let expiresIn = app.globalData.expiresIn;
        if (newTime - expiresTime > expiresIn) {
            wxLogin(register).then(() => {
                return Post(url, data, bool)
            }).then((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            })
        } else {
            Post(url, data, bool).then((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            })
        }
    })
};



/**
 * 错误提示
 * @params 提示信息
 * @return promise
 */
const errorShow = (message) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            wx.showToast({
                title: message,
                icon: 'none',
                duration: 1000,
                complete: () => {
                    setTimeout(resolve, 1000);
                },
                fail: () => {
                    setTimeout(reject, 1000);
                }
            });
        }, 0)
    })
};

/**
 * 成功提示
 * @params 提示信息
 * @return promise
 */
const successShow = (message) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: message,
            duration: 1000,
            complete: () => {
                setTimeout(resolve, 1000);
            },
            fail: () => {
                setTimeout(reject, 1000);
            }
        });
    })

};

/**
 * 显示模态弹窗
 * @params title 标题
 * @params message 信息
 * @params showCancel 是否显示取消按钮
 * @return promise
 */
const showTip = (title = "提示", message, showCancel = true) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: title,
            content: message,
            showCancel: showCancel,
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    resolve();
                } else if (res.cancel) {
                    console.log('用户点击取消');
                    reject();
                }
            }
        })
    })

}

/**
 * 页面返回
 * @params index 返回的层数
 */
const back = (index = 1) => {
    wx.navigateBack(index);
}

/**
 * 选择图片上传
 */
const chooseImage = () => {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths;
                //上传文件
                wx.uploadFile({
                    url: api.upload,
                    filePath: tempFilePaths[0],
                    name: 'file',
                    success: function(res) {
                        let data = JSON.parse(res.data);
                        resolve(data);
                    },
                    fail: function(res) {
                        reject(res);
                    }
                })

            }
        })
    })

}

/**
 * 解析从二维码传过来的数据
 * @params query 地址？后面的参数
 * @params name 要获取的key值
 */
const getQueryString = function(query, name) {
    console.log("query = " + query)
    console.log("name = " + name)
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
    var r = query.substr(1).match(reg)
    if (r != null) {
        console.log("r = " + r)
        console.log("r[2] = " + r[2])
        return r[2]
    }
    return null;
}

/**
 * 获取自定义data
 * @params e 事件中的event对象
 * @params key 要获取自定义数据的key值
 */
const dataSet = (e, key) => {
    return e.currentTarget.dataset[key];
}

/**
 * 获取系统信息
 */
const getSystemInfo = () => {
    return wx.getSystemInfoSync();
}

/**
 * 处理手机号中间4位替换成*
 * @params phone 手机号
 */
const phoneStar = (phone) => {
    return phone && phone.replace(/^(\d{4})\d{4}(\d+)/, '$1****$2');
}

/**
 * 按指定长度分段字符串
 * @param str 传入的字符串(非空)
 * @param num 指定长度(正整数)
 * @returns Array(字符串数组)
 */
const fixedLengthFormatString = (str, num) => {
    if (str == null || str == undefined) return null;
    if (!(/^[0-9]*[1-9][0-9]*$/.test(num))) return null;
    let array = [];
    let len = str.length;
    for (let i = 0; i < (len / num); i++) {
        if ((i + 1) * num > len) {
            array.push(str.substring(i * num, len));
        } else {
            array.push(str.substring(i * num, (i + 1) * num));
        }
    }
    return array;
}

/**
 * 验证码倒计时获取
 * @param _this 全局上下文
 * @param codeTime 倒计时时间
 * @param showField 控制显示隐藏的字段
 * @param timeField 改变显示的字段
 */
const Interval = (() => {
    let timer;
    return (_this, codeTime, showField, timeField) => {
        if (timer) {
            return;
        }
        let time = codeTime;
        let show = true;
        timer = setInterval(() => {
            time--;

            if (time < 0) {
                clearInterval(timer);
                timer = null;
                show = false;
                _this.setData({
                    disabled: false
                })
            }
            _this.setData({
                [showField]: show,
                [timeField]: time,

            })
        }, 1000)
    }

})();

/**
 * 图片加载失败时返回默认图片
 * @params _this 全局上下文
 * @params e 事件对象
 * @params date 需要改变的数据来源
 * @params index 数组的下标(如果不是数组，则为-1)
 * @params field 需要改变的数据字段
 * eg: binderror="imgErrorFn" data-date="goodsList" data-index="{{index}}" data-field="path"
 */
const imgErrorFn = (_this, e) => {
    let date = dataSet(e, 'date');
    let index = dataSet(e, 'index');
    let field = dataSet(e, 'field');
    let dateSource = _this.data[date];
    if (index >= 0 && field) {
        dateSource[index][field] = '../../../images/default.png';
    } else {
        if (field) {
            dateSource[field] = '../../../images/default.png';
        } else if (index >= 0) {
            dateSource[index] = '../../../images/default.png';
        } else {
            dateSource = '../../../images/default.png';
        }

    }
    _this.setData({
        [date]: dateSource
    })
};

/**
 * 修改图片前缀及获取默认图片
 * @params date 需要改变的数据来源
 * @params field 需要改变的字段
 * @params IMG 是否添加前缀
 */
const getDefaultImg = (data, field, IMG = true) => {
    // if (Object.prototype.toString.call(data) === '[object Array]') {
    //     console.log(data);
    //     for (let i = 0; i < data.length; i++) {
    //         if (field) {
    //             if (IMG) {
    //                 data[i][field] = data[i][field] ? api.IMG + data[i][field] : '../../images/default.png';

    //             } else {
    //                 data[i][field] = data[i][field] ? data[i][field] : '../../images/default.png';

    //             }

    //         } else {
    //             if (IMG) {
    //                 data[i] = data[i] ? api.IMG + data[i] : '../../images/default.png';

    //             } else {
    //                 data[i] = data[i] ? data[i] : '../../images/default.png';
    //                 console.log(data[i]);
    //             }
    //         }
    //     }
    // } else if (field) {
    //     if (IMG) {
    //         data[field] = data[field] ? api.IMG + data[field] : '../../images/default.png';

    //     } else {
    //         data[field] = data[field] ? data[field] : '../../images/default.png';
    //     }
    // } else {
    //     if (IMG) {
    //         data = data ? api.IMG + data : '../../images/default.png';

    //     } else {
    //         data = data ? data : '../../images/default.png';
    //     }
    // }
    let hasArray = new HasArray();
    let hasField = new HasField();
    let hasImg = new HasImg();
    let noraml = new Normal();
    hasArray.next(hasField.exec.bind(hasField));
    hasField.next(hasImg.exec.bind(hasImg));
    hasImg.next(noraml.exec.bind(noraml));
    data = hasArray.exec(data, field, IMG);
    return data;
};

class HasArray {
    constructor() {
        this.nextFn = null;
    }
    next(nextFn) {
        this.nextFn = nextFn;
    }
    exec(data, field, IMG) {
        if (Object.prototype.toString.call(data) === '[object Array]') {
            for (let i = 0; i < data.length; i++) {
                data[i] = this.nextFn && this.nextFn(data[i], field, IMG);
            }

        } else {
            data = this.nextFn && this.nextFn(data, field, IMG);
        }
        return data;
    }
}

class HasField {
    constructor() {
        this.nextFn = null;
    }
    next(nextFn) {
        this.nextFn = nextFn;
    }
    exec(data, field, IMG) {
        if (field) {

            data[field] = this.nextFn && this.nextFn(data[field], field, IMG);
        } else {
            data = this.nextFn && this.nextFn(data, field, IMG);
        }
        return data;
    }
}

class HasImg {
    constructor() {
        this.nextFn = null;
    }
    next(nextFn) {
        this.nextFn = nextFn;
    }
    exec(data, field, IMG) {
        if (IMG) {
            data = data ? api.IMG + data : '../../../images/default.png';

        } else {
            data = this.nextFn && this.nextFn(data, field, IMG);
        }
        return data;
    }
}

class Normal {
    constructor() {
        this.nextFn = null;
    }
    next(nextFn) {
        this.nextFn = nextFn;
    }
    exec(data, field, IMG) {
        data = data ? data : '../../../images/default.png';
        return data;
    }
}


/**
 * 每隔4个字符加空格
 * @params str 字符串
 */
const bankCardStr = (str) => {
    return str.replace(/(.{4})/g, '$1 ');
}

const countDownFn = (endTime) => {
    let timeStr = '';
    let Interval = setInterval(() => {
        //获取当前时间  
        let date = new Date();
        let now = date.getTime();
        //时间差  
        let leftTime = endTime - now;
        let hhh, mmm, sss; //定义变量 d,h,m,s保存倒计时的时间  

        if (leftTime >= 0) {
            hhh = Math.floor(leftTime / 1000 / 60 / 60 % 24);
            mmm = Math.floor(leftTime / 1000 / 60 % 60);
            sss = Math.floor(leftTime / 1000 % 60);
            hhh = hhh < 10 ? '0' + hhh : hhh;
            mmm = mmm < 10 ? '0' + mmm : mmm;
            sss = sss < 10 ? '0' + sss : sss;
            timeStr = `${hhh}:${mmm}:${sss}`;
        } else {
            clearInterval(Interval);
            Interval = null;
        }

    }, 1000)
    return {
        Interval: Interval,
        time: timeStr
    }
}

const round = (number, precision) => {
    return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
    //same as:
    //return Number(Math.round(+number + 'e' + precision) + 'e-' + precision);
}
const inspectPic = (name) => {
     if (name.indexOf('https') === -1 || name.indexOf('http') === -1) {
        name = api.IMG + name;
    }
    return name;
}


//将时间字符串转为date对象
const parserDate = (date) => {
    let t = Date.parse(date);
    if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, "/")));
    } else {
        return new Date();
    }
    return e.currentTarget.dataset[key];
}

// 小程序获取当前页面路径及参数
const getCurrentPageUrlWithArgs = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const url = currentPage.route
  const options = currentPage.options
  let urlWithArgs = `/${url}?`
  for (let key in options) {
    const value = options[key]
    urlWithArgs += `${key}=${value}&`
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}


module.exports = {
    formatTime: formatTime,
    wxLogin: wxLogin,
    Post: Post,
    Get: Get,
    uGet: uGet,
    errorShow: errorShow,
    successShow: successShow,
    showTip: showTip,
    uPost: uPost,
    back: back,
    chooseImage: chooseImage,
    getQueryString: getQueryString,
    dataSet: dataSet,
    getSystemInfo: getSystemInfo,
    phoneStar: phoneStar,
    fixedLengthFormatString: fixedLengthFormatString,
    Interval: Interval,
    imgErrorFn: imgErrorFn,
    bankCardStr: bankCardStr,
    getDefaultImg: getDefaultImg,
    countDownFn: countDownFn,
    round: round,
    inspectPic: inspectPic,
    parserDate:parserDate,
    getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
}