var t = require("../../api.js"), e = getApp();

Page({
    data: {
        total_price: 0,
        price: 0,
        cash_price: 0,
        total_cash: 0,
        team_count: 0,
        order_money: 0
    },
    onLoad: function(t) {
        e.pageOnLoad(this);
        var o = this;
        wx.getStorageSync("user_info");
        o.setData({
            custom: wx.getStorageSync("custom")
        });
    },
    onReady: function() {},
    onShow: function() {
        var o = this, a = wx.getStorageSync("user_info");
        if (1 != a.is_distributor) wx.showModal({
            title: "您还不是分销商！",
            content: "请先前往“个人中心->成为分销商”处进行申请成为分销商",
            showCancel: !1,
            success: function(t) {
                t.confirm && wx.redirectTo({
                    url: "/pages/user/user"
                });
            }
        }); else {
            var n = wx.getStorageSync("share_setting");
            o.setData({
                user_info: a,
                share_setting: n
            }), wx.showLoading({
                title: "正在加载",
                mask: !0
            }), e.request({
                url: t.share.get_info,
                success: function(t) {
                    0 == t.code && (o.setData({
                        total_price: t.data.price.total_price,
                        price: t.data.price.price,
                        cash_price: t.data.price.cash_price,
                        total_cash: t.data.price.total_cash,
                        team_count: t.data.team_count,
                        order_money: t.data.order_money,
                        custom: t.data.custom,
                        order_money_un: t.data.order_money_un
                    }), wx.setStorageSync("custom", t.data.custom));
                },
                complete: function() {
                    wx.hideLoading();
                }
            });
        }
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});