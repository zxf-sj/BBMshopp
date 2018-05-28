var t = require("../../api.js"), a = getApp(), e = 0, o = 0, s = !0, i = 1, n = "", r = !1;

Page({
    data: {
        x: wx.getSystemInfoSync().windowWidth,
        y: wx.getSystemInfoSync().windowHeight,
        left: 0,
        show_notice: !1,
        animationData: {},
        play: -1,
        time: 0,
        buy_user: "",
        buy_address: "",
        buy_time: 0,
        buy_type: ""
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.loadData(t);
        var e = 0, o = t.user_id, s = decodeURIComponent(t.scene);
        void 0 != o ? e = o : void 0 != s && (e = s), a.loginBindParent({
            parent_id: e
        });
    },
    suspension: function() {
        var e = this;
        o = setInterval(function() {
            a.request({
                url: t.default.buy_data,
                data: {
                    time: e.data.time
                },
                method: "POST",
                success: function(t) {
                    if (0 == t.code) {
                        var a = !1;
                        n == t.md5 && (a = !0);
                        var o = "", s = t.cha_time, i = Math.floor(s / 60 - 60 * Math.floor(s / 3600));
                        o = 0 == i ? s % 60 + "秒" : i + "分" + s % 60 + "秒";
                        var r = "购买了", d = "/pages/goods/goods?id=" + t.data.goods;
                        2 === t.data.type ? (r = "预约了", d = "/pages/book/details/details?id=" + t.data.goods) : 3 === t.data.type ? (r = "秒杀了", 
                        d = "/pages/miaosha/details/details?id=" + t.data.goods) : 4 === t.data.type && (r = "拼团了", 
                        d = "/pages/pt/details/details?gid=" + t.data.goods), !a && t.cha_time <= 300 ? (e.setData({
                            buy_time: o,
                            buy_type: r,
                            buy_url: d,
                            buy_user: t.data.user.length >= 5 ? t.data.user.slice(0, 4) + "..." : t.data.user,
                            buy_avatar_url: t.data.avatar_url,
                            buy_address: t.data.address.length >= 8 ? t.data.address.slice(0, 7) + "..." : t.data.address
                        }), n = t.md5) : e.setData({
                            buy_user: "",
                            buy_type: "",
                            buy_url: d,
                            buy_address: "",
                            buy_avatar_url: "",
                            buy_time: ""
                        });
                    }
                }
            });
        }, 1e4);
    },
    loadData: function(e) {
        var o = this, i = wx.getStorageSync("pages_index_index");
        i && (i.act_modal_list = [], o.setData(i)), a.request({
            url: t.default.index,
            success: function(t) {
                if (0 == t.code) {
                    s ? s = !1 : t.data.act_modal_list = [];
                    var a = t.data.topic_list, e = new Array();
                    if (a && 1 != t.data.update_list.topic.count) {
                        if (1 == a.length) e[0] = new Array(), e[0] = a; else for (var i = 0, n = 0; i < a.length; i += 2, 
                        n++) void 0 != a[i + 1] && (e[n] = new Array(), e[n][0] = a[i], e[n][1] = a[i + 1]);
                        t.data.topic_list = e;
                    }
                    o.setData(t.data), wx.setStorageSync("store", t.data.store), wx.setStorageSync("pages_index_index", t.data);
                    var r = wx.getStorageSync("user_info");
                    r && o.setData({
                        _user_info: r
                    }), o.miaoshaTimer();
                }
            },
            complete: function() {
                wx.stopPullDownRefresh();
            }
        });
    },
    onShow: function() {
        a.pageOnShow(this), e = 0;
        var t = wx.getStorageSync("store");
        t && t.name && wx.setNavigationBarTitle({
            title: t.name
        }), 1 === t.purchase_frame ? this.suspension(this.data.time) : this.setData({
            buy_user: ""
        }), clearInterval(1), this.notice();
    },
    onPullDownRefresh: function() {
        clearInterval(i), this.loadData();
    },
    onShareAppMessage: function(t) {
        var o = this;
        return {
            path: "/pages/index/index?user_id=" + wx.getStorageSync("user_info").id,
            success: function(t) {
                1 == ++e && a.shareSendCoupon(o);
            },
            title: o.data.store.name
        };
    },
    receive: function(e) {
        var o = this, s = e.currentTarget.dataset.index;
        wx.showLoading({
            title: "领取中",
            mask: !0
        }), o.hideGetCoupon || (o.hideGetCoupon = function(t) {
            var a = t.currentTarget.dataset.url || !1;
            o.setData({
                get_coupon_list: null
            }), a && wx.navigateTo({
                url: a
            });
        }), a.request({
            url: t.coupon.receive,
            data: {
                id: s
            },
            success: function(t) {
                wx.hideLoading(), 0 == t.code ? o.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                }) : (wx.showToast({
                    title: t.msg,
                    duration: 2e3
                }), o.setData({
                    coupon_list: t.data.coupon_list
                }));
            }
        });
    },
    navigatorClick: function(t) {
        var a = t.currentTarget.dataset.open_type, e = t.currentTarget.dataset.url;
        return "wxapp" != a || (e = function(t) {
            var a = /([^&=]+)=([\w\W]*?)(&|$|#)/g, e = /^[^\?]+\?([\w\W]+)$/.exec(t), o = {};
            if (e && e[1]) for (var s, i = e[1]; null != (s = a.exec(i)); ) o[s[1]] = s[2];
            return o;
        }(e), e.path = e.path ? decodeURIComponent(e.path) : "", console.log("Open New App"), 
        wx.navigateToMiniProgram({
            appId: e.appId,
            path: e.path,
            complete: function(t) {
                console.log(t);
            }
        }), !1);
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    notice: function() {
        var t = this.data.notice;
        if (void 0 != t) t.length;
    },
    miaoshaTimer: function() {
        var t = this;
        t.data.miaosha && t.data.miaosha.rest_time && (i = setInterval(function() {
            t.data.miaosha.rest_time > 0 ? (t.data.miaosha.rest_time = t.data.miaosha.rest_time - 1, 
            t.data.miaosha.times = t.getTimesBySecond(t.data.miaosha.rest_time), t.setData({
                miaosha: t.data.miaosha
            })) : clearInterval(i);
        }, 1e3));
    },
    onHide: function() {
        a.pageOnHide(this), this.setData({
            play: -1
        }), clearInterval(1), clearInterval(o), console.log("hide");
    },
    onUnload: function() {
        a.pageOnUnload(this), this.setData({
            play: -1
        }), clearInterval(i), clearInterval(1), clearInterval(o), console.log("unload");
    },
    showNotice: function() {
        this.setData({
            show_notice: !0
        });
    },
    closeNotice: function() {
        this.setData({
            show_notice: !1
        });
    },
    getTimesBySecond: function(t) {
        if (t = parseInt(t), isNaN(t)) return {
            h: "00",
            m: "00",
            s: "00"
        };
        var a = parseInt(t / 3600), e = parseInt(t % 3600 / 60), o = t % 60;
        return a >= 1 && (a -= 1), {
            h: a < 10 ? "0" + a : "" + a,
            m: e < 10 ? "0" + e : "" + e,
            s: o < 10 ? "0" + o : "" + o
        };
    },
    to_dial: function() {
        var t = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    closeActModal: function() {
        var t, a = this, e = a.data.act_modal_list, o = !0;
        for (var s in e) {
            var i = parseInt(s);
            e[i].show && (e[i].show = !1, void 0 !== e[t = i + 1] && o && (o = !1, setTimeout(function() {
                a.data.act_modal_list[t].show = !0, a.setData({
                    act_modal_list: a.data.act_modal_list
                });
            }, 500)));
        }
        a.setData({
            act_modal_list: e
        });
    },
    naveClick: function(t) {
        var e = this;
        a.navigatorClick(t, e);
    },
    play: function(t) {
        this.setData({
            play: t.currentTarget.dataset.index
        });
    },
    onPageScroll: function(t) {
        var a = this;
        r || -1 != a.data.play && wx.createSelectorQuery().select(".video").fields({
            rect: !0
        }, function(t) {
            console.log("page-scroll"), console.log(t.top);
            var e = wx.getSystemInfoSync().windowHeight;
            (t.top <= -200 || t.top >= e - 57) && a.setData({
                play: -1
            });
        }).exec();
    },
    fullscreenchange: function(t) {
        r = !!t.detail.fullScreen;
    }
});