//device.js
var bull = require('../../utils/fetch.js')
Page({
  data: {
    devices: [],
    hasMore: true,
    showLoading: true,
    sid: 0
  },
  triggerSwitch: function (e) {
    var that = this
    var device = e.currentTarget.dataset.device;
    console.log('triggerSwitch() ', device.mac)

    for (var i = 0; i < that.data.devices.length; i++) {
      if (that.data.devices[i].mac == device.mac
        && that.data.devices[i].id == device.id) {
        that.data.devices[i].status = !that.data.devices[i].status;
        that.setData({
          devices: that.data.devices
        })
        bull.toggleDevice(that.data.sid, device.mac, that.data.devices[i].status)
        console.log('setStatus: ', that.data.devices[i].status)
        break;
      }
    }
  },
  viewDeviceDetail: function (e) {
    var that = this
    var device = e.currentTarget.dataset.device;
    console.log('viewDeviceDetail() ', device.mac)

    bull.updateDeviceObservable(that.data.sid, device)
  },
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      devices: [],
      hasMore: true,
      showLoading: true,
      sid: parseInt(wx.getStorageSync('sid'))
    })
    bull.fetchDevices.call(that, that.data.sid)
  },
  onLoad: function () {
    var that = this
    that.setData({
      sid: parseInt(wx.getStorageSync('sid'))
    })
    console.log('sid = ', that.data.sid)
    bull.fetchDevices.call(that, that.data.sid)
  }
})
