//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    userBullInfo: {
      username: '',
      password: '',
      sid: '0'
    }
  },

  initUserBullInfo: function (cb) {
    var that=this
    wx.getStorageInfo({
      success: function (res) {
        // success
        if (!('username' in res.keys)) {
          wx.setStorage({
            key: 'username',
            data: ''
          })
        }else{
          that.globalData.userBullInfo.username = res.keys[username];
        }

        if (!('password' in res.keys)) {
          wx.setStorage({
            key: 'password',
            data: ''
          })
        }else{
          that.globalData.userBullInfo.password = res.keys[password];
        }

        if (!('sid' in res.keys)) {
          wx.setStorage({
            key: 'sid',
            data: '0'
          })
        }else{
          that.globalData.userBullInfo.sid = res.keys[sid];
        }

        typeof cb == "function" && cb(that.globalData.userBullInfo)
      }
    })
  }
})