var e = require("../../api.js"), t = getApp(), a = {
    init: function(a, o) {
        var i = this;
        i.page = a, t = o, i.page.orderPay = function(a) {
            function o(e, a, o) {
                t.request({
                    url: a,
                    data: {
                        order_id: e,
                        pay_type: "WECHAT_PAY"
                    },
                    complete: function() {
                        wx.hideLoading();
                    },
                    success: function(e) {
                        0 == e.code && wx.requestPayment({
                            timeStamp: e.data.timeStamp,
                            nonceStr: e.data.nonceStr,
                            package: e.data.package,
                            signType: e.data.signType,
                            paySign: e.data.paySign,
                            success: function(e) {
                                console.log("success"), console.log(e);
                            },
                            fail: function(e) {
                                console.log("fail"), console.log(e);
                            },
                            complete: function(e) {
                                "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? wx.redirectTo({
                                    url: "/" + o + "?status=1"
                                }) : wx.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: !1,
                                    confirmText: "确认",
                                    success: function(e) {
                                        e.confirm && wx.redirectTo({
                                            url: "/" + o + "?status=0"
                                        });
                                    }
                                });
                            }
                        }), 1 == e.code && wx.showToast({
                            title: e.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
            function s(e, a, o) {
                var i = wx.getStorageSync("user_info");
                wx.showModal({
                    title: "当前账户余额：" + i.money,
                    content: "是否使用余额",
                    success: function(i) {
                        i.confirm && (wx.showLoading({
                            title: "正在提交",
                            mask: !0
                        }), t.request({
                            url: a,
                            data: {
                                order_id: e,
                                pay_type: "BALANCE_PAY"
                            },
                            complete: function() {
                                wx.hideLoading();
                            },
                            success: function(e) {
                                0 == e.code && wx.redirectTo({
                                    url: "/" + o + "?status=1"
                                }), 1 == e.code && wx.showModal({
                                    title: "提示",
                                    content: e.msg,
                                    showCancel: !1
                                });
                            }
                        }));
                    }
                });
            }
            var r = a.currentTarget.dataset.index, n = i.page.data.order_list[r], d = new Array();
            if (void 0 !== i.page.data.pay_type_list) d = i.page.data.pay_type_list; else if (void 0 !== n.pay_type_list) d = n.pay_type_list; else if (void 0 !== n.goods_list[0].pay_type_list) d = n.goods_list[0].pay_type_list; else {
                var c = {};
                c.payment = 0, d.push(c);
            }
            var g = getCurrentPages(), u = g[g.length - 1].route, p = e.order.pay_data;
            -1 != u.indexOf("pt") ? p = e.group.pay_data : -1 != u.indexOf("miaosha") && (p = e.miaosha.pay_data), 
            1 == d.length ? (wx.showLoading({
                title: "正在提交",
                mask: !0
            }), 0 == d[0].payment && o(n.order_id, p, u), 3 == d[0].payment && s(n.order_id, p, u)) : wx.showModal({
                title: "提示",
                content: "选择支付方式",
                cancelText: "余额支付",
                confirmText: "微信支付",
                success: function(e) {
                    e.confirm ? (wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), o(n.order_id, p, u)) : e.cancel && s(n.order_id, p, u);
                }
            });
        }, i.page.order_submit = function(o, s) {
            function r() {
                wx.showLoading({
                    title: "正在提交",
                    mask: !0
                }), t.request({
                    url: n,
                    method: "post",
                    data: o,
                    success: function(e) {
                        if (0 == e.code) {
                            var r = function() {
                                t.request({
                                    url: d,
                                    data: {
                                        order_id: n,
                                        order_id_list: g,
                                        pay_type: u,
                                        form_id: o.formId
                                    },
                                    success: function(e) {
                                        if (0 != e.code) return wx.hideLoading(), void i.page.showToast({
                                            title: e.msg,
                                            image: "/images/icon-warning.png"
                                        });
                                        setTimeout(function() {
                                            wx.hideLoading();
                                        }, 1e3), "pt" == s ? "ONLY_BUY" == i.page.data.type ? wx.redirectTo({
                                            url: c + "?status=2"
                                        }) : wx.redirectTo({
                                            url: "/pages/pt/group/details?oid=" + n
                                        }) : void 0 !== i.page.data.goods_card_list && i.page.data.goods_card_list.length > 0 && 2 != o.payment ? i.page.setData({
                                            show_card: !0
                                        }) : wx.redirectTo({
                                            url: c + "?status=-1"
                                        });
                                    }
                                });
                            };
                            setTimeout(function() {
                                i.page.setData({
                                    options: {}
                                });
                            }, 1);
                            var n = e.data.order_id || "", g = e.data.order_id_list ? JSON.stringify(e.data.order_id_list) : "", u = "";
                            0 == o.payment ? t.request({
                                url: d,
                                data: {
                                    order_id: n,
                                    order_id_list: g,
                                    pay_type: "WECHAT_PAY"
                                },
                                success: function(e) {
                                    if (0 != e.code) {
                                        if (1 == e.code) return wx.hideLoading()(), void i.page.showToast({
                                            title: e.msg,
                                            image: "/images/icon-warning.png"
                                        });
                                    } else {
                                        setTimeout(function() {
                                            wx.hideLoading();
                                        }, 1e3), wx.requestPayment({
                                            timeStamp: e.data.timeStamp,
                                            nonceStr: e.data.nonceStr,
                                            package: e.data.package,
                                            signType: e.data.signType,
                                            paySign: e.data.paySign,
                                            success: function(e) {},
                                            fail: function(e) {},
                                            complete: function(e) {
                                                "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? "requestPayment:ok" != e.errMsg || (void 0 !== i.page.data.goods_card_list && i.page.data.goods_card_list.length > 0 ? i.page.setData({
                                                    show_card: !0
                                                }) : "pt" == s ? "ONLY_BUY" == i.page.data.type ? wx.redirectTo({
                                                    url: c + "?status=2"
                                                }) : wx.redirectTo({
                                                    url: "/pages/pt/group/details?oid=" + n
                                                }) : wx.redirectTo({
                                                    url: c + "?status=1"
                                                })) : wx.showModal({
                                                    title: "提示",
                                                    content: "订单尚未支付",
                                                    showCancel: !1,
                                                    confirmText: "确认",
                                                    success: function(e) {
                                                        e.confirm && wx.redirectTo({
                                                            url: c + "?status=0"
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                        var t = wx.getStorageSync("quick_list");
                                        if (t) {
                                            for (var o = t.length, r = 0; r < o; r++) for (var d = t[r].goods, g = d.length, u = 0; u < g; u++) d[u].num = 0;
                                            wx.setStorageSync("quick_lists", t);
                                            for (var p = wx.getStorageSync("carGoods"), o = p.length, r = 0; r < o; r++) p[r].num = 0, 
                                            p[r].goods_price = 0, a.setData({
                                                carGoods: p
                                            });
                                            wx.setStorageSync("carGoods", p);
                                            var l = wx.getStorageSync("total");
                                            l && (l.total_num = 0, l.total_price = 0, wx.setStorageSync("total", l));
                                            wx.getStorageSync("check_num");
                                            0, wx.setStorageSync("check_num", 0);
                                            for (var _ = wx.getStorageSync("quick_hot_goods_lists"), o = _.length, r = 0; r < o; r++) _[r].num = 0, 
                                            a.setData({
                                                quick_hot_goods_lists: _
                                            });
                                            wx.setStorageSync("quick_hot_goods_lists", _);
                                        }
                                    }
                                }
                            }) : 2 == o.payment ? (u = "HUODAO_PAY", r()) : 3 == o.payment && (u = "BALANCE_PAY", 
                            r());
                        }
                        if (1 == e.code) return wx.hideLoading(), void i.page.showToast({
                            title: e.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
            var n = e.order.submit, d = e.order.pay_data, c = "/pages/order/order";
            if ("pt" == s ? (n = e.group.submit, d = e.group.pay_data, c = "/pages/pt/order/order") : "ms" == s && (n = e.miaosha.submit, 
            d = e.miaosha.pay_data, c = "/pages/miaosha/order/order"), 3 == o.payment) {
                var g = wx.getStorageSync("user_info");
                wx.showModal({
                    title: "当前账户余额：" + g.money,
                    content: "是否确定使用余额支付",
                    success: function(e) {
                        e.confirm && r();
                    }
                });
            } else r();
        };
    }
};

module.exports = a;