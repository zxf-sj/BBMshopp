var t = require("../../../api.js"), e = getApp(), a = !1, o = !1, s = 2;

Page({
    data: {
        status: -1,
        order_list: [],
        show_no_data_tip: !1,
        hide: 1,
        qrcode: ""
    },
    onLoad: function(t) {
        e.pageOnLoad(this);
        var i = this;
        a = !1, o = !1, s = 2, i.loadOrderList(t.status || -1), getCurrentPages().length < 2 && i.setData({
            show_index: !0
        });
    },
    loadOrderList: function(a) {
        void 0 == a && (a = -1);
        var o = this;
        o.setData({
            status: a
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.miaosha.order_list,
            data: {
                status: o.data.status
            },
            success: function(t) {
                0 == t.code && o.setData({
                    order_list: t.data.list
                }), o.setData({
                    show_no_data_tip: 0 == o.data.order_list.length
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReachBottom: function() {
        var i = this;
        o || a || (o = !0, e.request({
            url: t.miaosha.order_list,
            data: {
                status: i.data.status,
                page: s
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = i.data.order_list.concat(t.data.list);
                    i.setData({
                        order_list: e
                    }), 0 == t.data.list.length && (a = !0);
                }
                s++;
            },
            complete: function() {
                o = !1;
            }
        }));
    },
    orderPay_1: function(t) {
        var e = this, a = t.currentTarget.dataset.index, o = e.data.order_list[a], s = o.pay_type_list;
        1 == s.length ? (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), 0 == s[0].payment && e.WechatPay(o.order_id), 3 == s[0].payment && e.BalancePay(o.order_id)) : wx.showModal({
            title: "提示",
            content: "选择支付方式",
            cancelText: "余额支付",
            confirmText: "微信支付",
            success: function(t) {
                wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), t.confirm ? e.WechatPay(o.order_id) : t.cancel && e.BalancePay(o.order_id);
            }
        });
    },
    WechatPay: function(a) {
        e.request({
            url: t.miaosha.pay_data,
            data: {
                order_id: a,
                pay_type: "WECHAT_PAY"
            },
            complete: function() {
                wx.hideLoading();
            },
            success: function(t) {
                console.log(t), 0 == t.code && wx.requestPayment({
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    success: function(t) {
                        console.log("success"), console.log(t);
                    },
                    fail: function(t) {
                        console.log("fail"), console.log(t);
                    },
                    complete: function(t) {
                        console.log("complete"), console.log(t), "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? wx.redirectTo({
                            url: "/pages/miaosha/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && wx.redirectTo({
                                    url: "/pages/miaosha/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == t.code && wx.showToast({
                    title: t.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    BalancePay: function(a) {
        e.request({
            url: t.miaosha.pay_data,
            data: {
                order_id: a,
                pay_type: "BALANCE_PAY"
            },
            complete: function() {
                wx.hideLoading();
            },
            success: function(t) {
                0 == t.code && wx.redirectTo({
                    url: "/pages/miaosha/order/order?status=1"
                }), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                });
            }
        });
    },
    orderRevoke: function(a) {
        var o = this;
        wx.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmText: "是",
            success: function(s) {
                if (s.cancel) return !0;
                s.confirm && (wx.showLoading({
                    title: "操作中"
                }), e.request({
                    url: t.miaosha.order_revoke,
                    data: {
                        order_id: a.currentTarget.dataset.id
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && o.loadOrderList(o.data.status);
                            }
                        });
                    }
                }));
            }
        });
    },
    orderConfirm: function(a) {
        var o = this;
        wx.showModal({
            title: "提示",
            content: "是否确认已收到货？",
            cancelText: "否",
            confirmText: "是",
            success: function(s) {
                if (s.cancel) return !0;
                s.confirm && (wx.showLoading({
                    title: "操作中"
                }), e.request({
                    url: t.miaosha.confirm,
                    data: {
                        order_id: a.currentTarget.dataset.id
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.showToast({
                            title: t.msg
                        }), 0 == t.code && o.loadOrderList(3);
                    }
                }));
            }
        });
    },
    orderQrcode: function(a) {
        var o = this, s = o.data.order_list, i = a.target.dataset.index;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.data.order_list[i].offline_qrcode ? (o.setData({
            hide: 0,
            qrcode: o.data.order_list[i].offline_qrcode
        }), wx.hideLoading()) : e.request({
            url: t.order.get_qrcode,
            data: {
                order_no: s[i].order_no
            },
            success: function(t) {
                0 == t.code ? o.setData({
                    hide: 0,
                    qrcode: t.data.url
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    hide: function(t) {
        this.setData({
            hide: 1
        });
    }
});