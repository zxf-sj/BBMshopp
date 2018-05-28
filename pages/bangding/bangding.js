var n = getApp(), t = require("../../api.js");

Page({
    data: {
        second: 60
    },
    onLoad: function(e) {
        var a = this;
        n.request({
            url: t.user.sms_setting,
            method: "get",
            data: {
                page: 1
            },
            success: function(n) {
                0 == n.code ? a.setData({
                    status: !0
                }) : a.setData({
                    status: !1
                });
            }
        });
    },
    getPhoneNumber: function(e) {
        var a = this;
        "getPhoneNumber:fail user deny" == e.detail.errMsg ? wx.showModal({
            title: "提示",
            showCancel: !1,
            content: "未授权",
            success: function(n) {}
        }) : wx.login({
            success: function(i) {
                if (i.code) {
                    var o = i.code;
                    n.request({
                        url: t.user.user_binding,
                        method: "POST",
                        data: {
                            iv: e.detail.iv,
                            encryptedData: e.detail.encryptedData,
                            code: o
                        },
                        success: function(n) {
                            0 == n.code ? a.setData({
                                PhoneNumber: n.data.dataObj
                            }) : wx.showToast({
                                title: "授权失败"
                            });
                        }
                    });
                } else wx.showToast({
                    title: "授权失败",
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    gainPhone: function() {
        this.setData({
            gainPhone: !0,
            handPhone: !1
        });
    },
    handPhone: function() {
        this.setData({
            gainPhone: !1,
            handPhone: !0
        });
    },
    nextStep: function() {
        var e = this, a = this.data.handphone;
        /^1[3|5][0-9]\d{4,8}$/.test(a) && 11 == a.length ? n.request({
            url: t.user.user_hand_binding,
            method: "POST",
            data: {
                content: a
            },
            success: function(n) {
                0 == n.code ? (e.timer(), e.setData({
                    content: n.msg,
                    timer: !0
                })) : (n.code, wx.showToast({
                    title: n.msg,
                    image: "/images/icon-warning.png"
                }));
            }
        }) : wx.showToast({
            title: "手机号码错误",
            image: "/images/icon-warning.png"
        });
    },
    timer: function() {
        var n = this;
        new Promise(function(t, e) {
            var a = setInterval(function() {
                n.setData({
                    second: n.data.second - 1
                }), n.data.second <= 0 && (n.setData({
                    timer: !1
                }), t(a));
            }, 1e3);
        }).then(function(n) {
            clearInterval(n);
        });
    },
    HandPhoneInput: function(n) {
        this.setData({
            handphone: n.detail.value
        });
    },
    CodeInput: function(n) {
        this.setData({
            code: n.detail.value
        });
    },
    PhoneInput: function(n) {
        this.setData({
            phoneNum: n.detail.value
        });
    },
    onSubmit: function() {
        var e = this.data.gainPhone;
        this.data.handPhone;
        if (e) {
            var a = this.data.phoneNum;
            if (a) {
                if (11 != a.length) return void wx.showToast({
                    title: "手机号码错误",
                    image: "/images/icon-warning.png"
                });
                var i = a;
            } else if (!(i = this.data.PhoneNumber)) return void wx.showToast({
                title: "手机号码错误",
                image: "/images/icon-warning.png"
            });
        } else {
            if (11 != (i = this.data.handphone).length) return void wx.showToast({
                title: "手机号码错误",
                image: "/images/icon-warning.png"
            });
            var o = this.data.code;
            if (!o) return void wx.showToast({
                title: "请输入验证码",
                image: "/images/icon-warning.png"
            });
            if (o != this.data.content) return void wx.showToast({
                title: "验证码错误",
                image: "/images/icon-warning.png"
            });
        }
        var s = this;
        n.request({
            url: t.user.user_empower,
            method: "POST",
            data: {
                phone: i
            },
            success: function(n) {
                0 == n.code ? s.setData({
                    binding: !0,
                    binding_num: i
                }) : 1 == n.code && wx.showToast({
                    title: n.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    renewal: function() {
        this.setData({
            binding: !1,
            gainPhone: !0,
            handPhone: !1
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = this;
        n.request({
            url: t.user.index,
            method: "GET",
            success: function(n) {
                0 == n.code && (n.data.user_info.binding ? e.setData({
                    binding_num: n.data.user_info.binding,
                    binding: !0
                }) : e.setData({
                    gainPhone: !0,
                    handPhone: !1
                }));
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});