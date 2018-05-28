var o = require("../../api.js"), t = getApp();

Page({
    data: {},
    onLoad: function(n) {
        t.pageOnLoad(this);
        var e = this;
        wx.showLoading({
            mask: !0
        }), t.request({
            url: o.default.coupon_list,
            success: function(o) {
                0 == o.code && (e.setData({
                    coupon_list: o.data.list
                }), console.log(o.data.list));
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    receive: function(n) {
        var e = this, a = n.target.dataset.index;
        wx.showLoading({
            mask: !0
        }), e.hideGetCoupon || (e.hideGetCoupon = function(o) {
            var t = o.currentTarget.dataset.url || !1;
            e.setData({
                get_coupon_list: null
            }), t && wx.navigateTo({
                url: t
            });
        }), t.request({
            url: o.coupon.receive,
            data: {
                id: a
            },
            success: function(o) {
                0 == o.code && e.setData({
                    get_coupon_list: o.data.list,
                    coupon_list: o.data.coupon_list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    closeCouponBox: function(o) {
        this.setData({
            get_coupon_list: ""
        });
    },
    goodsList: function(o) {
        var t = o.currentTarget.dataset.goods, n = [];
        for (var e in t) n.push(t[e].id);
        wx.navigateTo({
            url: "/pages/list/list?goods_id=" + n,
            success: function(o) {},
            fail: function(o) {}
        });
    }
});