//index.js
var bull = require('../../utils/fetch.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    mUsername: '',
    mPassword: '',
    mSID: '0',
    userInfo: {},
  },
  bindUsernameInput: function (e) {
    this.setData({
      mUsername: e.detail.value
    })
  },
  bindPasswordInput: function (e) {
    this.setData({
      mPassword: e.detail.value
    })
  },
  login: function (e) {
    if (this.data.mUsername != '' && this.data.mPassword != '') {
      console.log('username = ' + this.data.mUsername + ', password = ' + this.data.mPassword)

      wx.setStorage({
        key: 'username',
        data: this.data.mUsername
      })
      wx.setStorage({
        key: 'password',
        data: this.data.mPassword
      })
      wx.setStorage({
        key: 'sid',
        data: this.data.mSID
      })

      bull.login(this.data.mUsername, this.data.mPassword)
    } else {
      wx.showToast({
        title: '错误, 用户名或密码无效',
        duration: 2000
      })
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    wx.getStorage({
      key: 'username',
      success: function (res) {
        // success
        that.setData({
          mUsername: res.data
        })
      }
    })

    wx.getStorage({
      key: 'password',
      success: function (res) {
        // success
        that.setData({
          mPassword: res.data
        })
      }
    })
  }
})
