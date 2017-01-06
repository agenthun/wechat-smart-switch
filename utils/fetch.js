var FUNCTION_SET = "DeviceSetReq"
var FUNCTION_GET = "DeviceGetReq"
var FUNCTION_SET_CID = 20031
var FUNCTION_GET_CID = 20021

var CMD_SET_STATUS_CLOSE = "FE000011010001FFFF1001FFFF2001FFFF3001FFFF"
var CMD_SET_STATUS_OPEN = "FE000011010002FFFF1002FFFF2002FFFF3002FFFF"

var CMD_GET_STATUS = "FD00000102"
var CMD_GET_INTERVAL = "FD00000105"

// 操作设备CMD返回码
var CODE_STATUS_CLOSE_MANUAL = "FD000011020002FFFF1002FFFF2002FFFF3001FFFF000000"
var CODE_STATUS_CLOSE_AUTO = "FD000011020001FFFF1001FFFF2001FFFF3001FFFF000000"
var CODE_STATUS_OPEN_MANUAL = "FD000011020001FFFF1001FFFF2001FFFF3002FFFF000000"
var CODE_STATUS_OPEN_AUTO = "FD000011020002FFFF1002FFFF2002FFFF3002FFFF000000"
var CODE_IS_INTERVAL_INITIAL = "FD00000205FF0000"
var CODE_IS_INTERVAL_FALSE = "FD00001805"
var CODE_IS_INTERVAL_TRUE = "FD00001705"
var CODE_IS_TIME_SLOT_INTERVAL_FALSE = "FD00002C05"
var CODE_IS_TIME_SLOT_INTERVAL_TRUE = "FD00002905"
var CODE_CONFIG_CLOSE = "0001FFFF1001FFFF2001FFFF3001FFFF"
var CODE_CONFIG_OPEN = "0002FFFF1002FFFF2002FFFF3002FFFF"

// 获取设备列表
function fetchDevices(sid) {
  var that = this
  if (that.data.hasMore) {
    wx.request({
      url: 'http://www.gn-smart.cn/usvc/',
      data: {
        SID: sid,
        SN: 17,
        subReqList: [{ "pageSize": 100, "deviceGroupId": -1, "pageNum": 1 }],
        timeout: 5000,
        NM: 'DeviceQueryByGroupReq',
        CID: 30081
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
          var map = res.data.subRspMap
          for (var key in map) {
            var devices = map[key].itemList
            if (devices == null || devices.length == 0) {
              that.setData({
                hasMore: false
              })
            } else {
              for (var i = 0; i < devices.length; i++) {
                console.log("device name: " + devices[i].name + ", mac: " + devices[i].mac)
                devices[i].status = false
                // updateDeviceObservable(that, sid, devices[i])
              }
              that.setData({
                devices: that.data.devices.concat(devices),
                showLoading: false
              })
              console.log("total device size: " + that.data.devices.length)
            }
          }
        }
        wx.stopPullDownRefresh()
      },
      fail: function () {
        console.log('网络开小差了')
        that.setData({
          showLoading: false
        })
        wx.showToast({
          title: '网络开小差了',
          icon: 'offline',
          duration: 2000
        })
        wx.stopPullDownRefresh()
      }
    })
  }
}

// 操作设备
function operateDevice(sid, input, NM, CID) {
  var that = this
  wx.request({
    url: 'http://www.gn-smart.cn/usvc/',
    data: {
      SID: sid,
      SN: 98,
      input: input,
      timeout: 5000,
      NM: NM,
      CID: CID
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
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 2000
        })
      }
    },
    fail: function () {
      console.log('网络开小差了')
      that.setData({
        showLoading: false
      })
      wx.showToast({
        title: '网络开小差了',
        icon: 'offline',
        duration: 2000
      })
    }
  })
}

// 设备开关操作
function toggleDevice(sid, mac, status) {
  var input = {}
  input[mac] = status ? CMD_SET_STATUS_OPEN : CMD_SET_STATUS_CLOSE
  operateDevice(sid, input, FUNCTION_SET, FUNCTION_SET_CID)
}

// 更新设备状态
function updateDeviceObservable(sid, device) {
  var that = this
  var input = {}
  input[device.mac] = CMD_GET_STATUS

  wx.request({
    url: 'http://www.gn-smart.cn/usvc/',
    data: {
      SID: sid,
      SN: 98,
      input: input,
      timeout: 5000,
      NM: FUNCTION_GET,
      CID: FUNCTION_GET_CID
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
        var codeStatus = res.data.output[device.mac]
        switch (codeStatus) {
          case CODE_STATUS_OPEN_MANUAL:
          case CODE_STATUS_OPEN_AUTO:
            device.status = true
            break;
          case CODE_STATUS_CLOSE_MANUAL:
          case CODE_STATUS_CLOSE_AUTO:
            device.status = false
            break;
          default:
            device.status = false
            break;
        }
        console.log("device name: " + device.name +
          ", mac: " + device.mac +
          ", status: " + device.status)

        // that.setData({
        //   devices: that.data.devices.concat(device),
        //   showLoading: false
        // })
      }
    },
    fail: function () {
      console.log('网络开小差了')
      // that.setData({
      //   showLoading: false
      // })
      // wx.showToast({
      //   title: '网络开小差了',
      //   icon: 'offline',
      //   duration: 2000
      // })
    }
  })
}

module.exports = {
  fetchDevices: fetchDevices,
  operateDevice: operateDevice,
  toggleDevice: toggleDevice,
  updateDeviceObservable: updateDeviceObservable,
}