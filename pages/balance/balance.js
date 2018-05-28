var api = require("../../api.js"), app = getApp(), is_more = !1, util = require("../../utils/utils.js");

Page({
  data: {
    show: !1,
    hiddenmodalput: true,
    detailValue: 0,
    token: ''
  },
  onLoad: function (t) {
    app.pageOnLoad(this);
  },
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
    let that = this;
    if (that.data.detailValue <= parseInt(that.data.user_info.money) && that.data.detailValue != 0) {
      that.integralPost();
    } else {
      that.wxPopup();
    }
  },
  //积分POST
  integralPost: function () {
    console.log("POST");
    this.setData({
      token: wx.getStorageSync("access_token")
    });
    let that = this;
    wx.request({
      url: "https://bbm.foooog.cn/platform-framework/api/transfer/pay",
      //url: "http://192.168.200.86:8080/platform-framework/api/transfer/pay",
      data: { token: that.data.token, takemoney: that.data.detailValue },
      // header: {
      //   'content-type': 'application/json' // 默认值
      // },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      success: function (res) {
        console.log(res);
        if (res.data.code == 1) {
          that.succPopup();
        } else if (res.data.code == 500) {
          that.failPopup();
        } else if (res.data.code == -1) {
          that.allFailPopup();
        } else if (res.data.code == '') {
          console.log("空")
        }
      }
    })
  },
  //成功弹窗
  succPopup: function () {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    this.onShow();
  },
  allFailPopup: function () {
    wx.showModal({
      title: '提示',
      content: '提现失败',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //积分小数弹窗
  failPopup: function () {
    wx.showModal({
      title: '提示',
      content: '不能输入小数',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //积分弹框
  wxPopup: function () {
    wx.showModal({
      title: '提示',
      content: '您的积分余额不足',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //积分输入值
  btntext: function (e) {
    this.setData({
      "detailValue": e.detail.value
    })
  },
  getData: function () {
    var a = this;
    wx.showLoading({
      title: "加载中"
    }), app.request({
      url: api.recharge.record,
      data: {
        date: a.data.date_1 || ""
      },
      success: function (t) {
        a.setData({
          list: t.data.list
        }), wx.hideLoading(), is_more = !1;
      }
    });
  },
  onReady: function () {
    app.pageOnReady(this);
  },
  onShow: function () {
    app.pageOnShow(this);
    var a = this;
    wx.showLoading({
      title: "加载中"
    });
    var e = wx.getStorageSync("user_info");
    app.request({
      url: api.recharge.index,
      success: function (t) {
        e.money = t.data.money, wx.setStorageSync("user_info", e), a.setData({
          user_info: e,
          list: t.data.list,
          setting: t.data.setting,
          date_1: t.data.date,
          date: t.data.date.replace("-", "年") + "月"
        }), wx.hideLoading();
      }
    });
  },
  onHide: function () {
    app.pageOnHide(this);
  },
  onUnload: function () {
    app.pageOnUnload(this);
  },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  dateChange: function (t) {
    if (!is_more) {
      is_more = !0;
      var a = t.detail.value, e = a.replace("-", "年") + "月";
      this.setData({
        date: e,
        date_1: a
      }), this.getData();
    }
  },
  dateUp: function () {
    var t = this;
    if (!is_more) {
      is_more = !0;
      var a = t.data.date_1, e = (t.data.date, new Date(a));
      e.setMonth(e.getMonth() + 1);
      var i = e.getMonth() + 1;
      i = (i = i.toString())[1] ? i : "0" + i, t.setData({
        date: e.getFullYear() + "年" + i + "月",
        date_1: e.getFullYear() + "-" + i
      }), t.getData();
    }
  },
  dateDown: function () {
    var t = this;
    if (!is_more) {
      is_more = !0;
      var a = t.data.date_1, e = (t.data.date, new Date(a));
      e.setMonth(e.getMonth() - 1);
      var i = e.getMonth() + 1;
      i = (i = i.toString())[1] ? i : "0" + i, t.setData({
        date: e.getFullYear() + "年" + i + "月",
        date_1: e.getFullYear() + "-" + i
      }), t.getData();
    }
  },
  click: function () {
    this.setData({
      show: !0
    });
  },
  close: function () {
    this.setData({
      show: !1
    });
  },
  GoToDetail: function (t) {
    var a = t.currentTarget.dataset.index, e = this.data.list[a];
    console.log(a), wx.navigateTo({
      url: "/pages/balance/detail?order_type=" + e.order_type + "&id=" + e.id
    });
  }
});