//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    mUsername: '',
    mPassword: '',
    userInfo: {},
    userBullInfo: {}
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
      this.data.userBullInfo.username = this.data.mUsername
      this.data.userBullInfo.password = this.data.mPassword
      this.data.userBullInfo.sid = '0'

      wx.setStorage({
        key: 'username',
        data: this.data.userBullInfo.username
      })
      wx.setStorage({
        key: 'password',
        data: this.data.userBullInfo.password
      })
      wx.setStorage({
        key: 'sid',
        data: this.data.userBullInfo.sid
      })

      wx.request({
        url: 'http://www.gn-smart.cn/usvc/',
        data: {
          SID: 0,
          NM: 'LoginReq',
          clientName: 'GT-P3100',
          userName: this.data.userBullInfo.username,
          SN: 13,
          mac: '352123052298',
          agingTime: 86400000,
          password: this.data.userBullInfo.password,
          timeout: 5000,
          clientId: 'F0002C0004',
          CID: 10011
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/json',
          'accept': 'application/json'
        }, // 设置请求的 header
        success: function (res) {
          // success
          console.log(res.data)
          if (res.data.result == 1) {
            wx.setStorage({
              key: 'sid',
              data: res.data.SID.toString(),
              success: function (res) {
                console.log("save sid success: " + res)
              },
              complete: function () {
                console.log("jump device")
                wx.navigateTo({
                  url: '../device/device'
                })
              }
            })
          } else {
            wx.showToast({
              title: res.data.reason,
              duration: 2000
            })
          }
        },
        fail: function () {
          console.log('登录失败')
          wx.showToast({
            title: '网络故障',
            duration: 2000
          })
        }
      })
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

    // app.initUserBullInfo(function (userBullInfo) {
    //   //更新数据
    //   that.setData({
    //     userBullInfo: userBullInfo
    //   })
    //   console.log('userBullInfo' + userBullInfo.username)
    // })
  }
})
