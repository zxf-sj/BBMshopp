
var api = require("../../api.js"), app = getApp();

Page({
  data: {
    couponNum: '',
    fal: false,
    token: ''
  },
  destnum: function (event) {
    let that = this;
    console.log(event);
    that.setData({
      'couponNum': event.detail.value
    })

  },
  couponBtn: function () {
    let that = this;
    that.setData({
      token: wx.getStorageSync("access_token")
    });
    app.request({
        url: "https://bbm.foooog.cn/platform-framework/api/user/activeGiftcard",
      //url: "http://192.168.200.86:8080/platform-framework/api/user/activeGiftcard", 
      data: {
        "token": that.data.token,
        "cardNum": that.data.couponNum
      },
      success: function (res) {
        console.log(res);
        if(res.key == 200) {
          that.succYes();
        } else {
          that.succNo();
        }
      }
    });
  },
  succYes: function() {
    wx.showToast({
      title: '激活成功',
      icon: 'fall',
      duration: 1000,
      mask: true
    })
  },
  succNo: function () {
    wx.showToast({
      title: '激活失败',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
  },
  onLoad: function (options) {
    let that = this;
   
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})