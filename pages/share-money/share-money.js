var t = require("../../api.js"), a = getApp();

Page({
    data: {
        block: !1,
        active: "",
        total_price: 0,
        price: 0,
        cash_price: 0,
        un_pay: 0
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        var e = this, c = wx.getStorageSync("share_setting"), i = wx.getStorageSync("custom");
        e.setData({
            share_setting: c,
            custom: i
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.share.get_price,
            success: function(t) {
                0 == t.code && e.setData({
                    total_price: t.data.price.total_price,
                    price: t.data.price.price,
                    cash_price: t.data.price.cash_price,
                    un_pay: t.data.price.un_pay
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    tapName: function(t) {
        var a = this, e = "";
        a.data.block || (e = "active"), a.setData({
            block: !a.data.block,
            active: e
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});