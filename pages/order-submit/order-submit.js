var t = require("../../api.js"), a = getApp(), e = "", i = "", s = require("../../utils/utils.js");

Page({
    data: {
        total_price: 0,
        address: null,
        express_price: 0,
        content: "",
        offline: 0,
        express_price_1: 0,
        name: "",
        mobile: "",
        integral_radio: 1,
        new_total_price: 0,
        show_card: !1,
        payment: -1,
        show_payment: !1
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
        var e = this, i = s.formatData(new Date());
        e.setData({
            options: t,
            store: wx.getStorageSync("store"),
            time: i
        });
    },
    bindkeyinput: function(t) {
        var a = t.currentTarget.dataset.mchIndex;
        -1 == a ? this.setData({
            content: t.detail.value
        }) : (this.data.mch_list[a] && (this.data.mch_list[a].content = t.detail.value), 
        this.setData({
            mch_list: this.data.mch_list
        }));
    },
    KeyName: function(t) {
        this.setData({
            name: t.detail.value
        });
    },
    KeyMobile: function(t) {
        this.setData({
            mobile: t.detail.value
        });
    },
    getOffline: function(t) {
        var a = this, e = this.data.express_price, i = this.data.express_price_1;
        if (1 == t.currentTarget.dataset.index) this.setData({
            offline: 1,
            express_price: 0,
            express_price_1: e,
            is_area: 0
        }); else {
            var s = a.data.is_area_city_id, o = a.data.address.city_id;
            o && s && function(t, a) {
                for (var e = 0; e < t.length; e++) if (a == t[e]) return !1;
                return !0;
            }(s, o) && this.setData({
                is_area: 1
            }), this.setData({
                offline: 0,
                express_price: i
            });
        }
        a.getPrice();
    },
    dingwei: function() {
        var t = this;
        wx.chooseLocation({
            success: function(a) {
                e = a.longitude, i = a.latitude, t.setData({
                    location: a.address
                });
            },
            fail: function(e) {
                a.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(a) {
                        a && (a.authSetting["scope.userLocation"] ? t.dingwei() : wx.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    orderSubmit: function(t) {
        var a = this, e = a.data.offline, i = {};
        if (0 == e) {
            var s = a.data.is_area_city_id;
            if (s && function(t, a) {
                for (var e = 0; e < t.length; e++) if (a == t[e]) return !1;
                return !0;
            }(s, a.data.address.city_id)) return void wx.showToast({
                title: "所选地区无货",
                image: "/images/icon-warning.png"
            });
        }
        if (0 == e) {
            if (!a.data.address || !a.data.address.id) return void wx.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            i.address_id = a.data.address.id;
        } else {
            if (i.address_name = a.data.name, i.address_mobile = a.data.mobile, !a.data.shop.id) return void wx.showModal({
                title: "警告",
                content: "请选择门店",
                showCancel: !1
            });
            if (i.shop_id = a.data.shop.id, !i.address_name || void 0 == i.address_name) return void a.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!i.address_mobile || void 0 == i.address_mobile) return void a.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^1\d{10}$/.test(i.address_mobile)) return void wx.showModal({
                title: "提示",
                content: "手机号格式不正确",
                showCancel: !1
            });
        }
        i.offline = e;
        var o = a.data.form;
        if (1 == o.is_form) {
            var d = o.list;
            for (var r in d) if ("date" == d[r].type && (d[r].default = d[r].default ? d[r].default : a.data.time), 
            "time" == d[r].type && (d[r].default = d[r].default ? d[r].default : "00:00"), 1 == d[r].required) if ("radio" == d[r].type || "checkboxc" == d[r].type) {
                var n = !1;
                for (var c in d[r].default_list) 1 == d[r].default_list[c].is_selected && (n = !0);
                if (!n) return wx.showModal({
                    title: "提示",
                    content: "请填写" + o.name + "，加‘*’为必填项",
                    showCancel: !1
                }), !1;
            } else if (!d[r].default || void 0 == d[r].default) return wx.showModal({
                title: "提示",
                content: "请填写" + o.name + "，加‘*’为必填项",
                showCancel: !1
            }), !1;
        }
        if (-1 == a.data.payment) return a.setData({
            show_payment: !0
        }), !1;
        if (i.form = JSON.stringify(o), a.data.cart_id_list && (i.cart_id_list = JSON.stringify(a.data.cart_id_list)), 
        a.data.mch_list && a.data.mch_list.length) {
            var l = [];
            for (var r in a.data.mch_list) if (a.data.mch_list[r].cart_id_list) {
                var _ = {
                    id: a.data.mch_list[r].id,
                    cart_id_list: a.data.mch_list[r].cart_id_list
                };
                a.data.mch_list[r].content && (_.content = a.data.mch_list[r].content), l.push(_);
            }
            l.length ? i.mch_list = JSON.stringify(l) : i.mch_list = "";
        }
        a.data.goods_info && (i.goods_info = JSON.stringify(a.data.goods_info)), a.data.picker_coupon && (i.user_coupon_id = a.data.picker_coupon.user_coupon_id), 
        a.data.content && (i.content = a.data.content), a.data.cart_list && (i.cart_list = JSON.stringify(a.data.cart_list)), 
        1 == a.data.integral_radio ? i.use_integral = 1 : i.use_integral = 2, a.data.goods_list && a.data.goods_list.length || !a.data.mch_list || 1 != a.data.mch_list.length || (i.content = a.data.mch_list[0].content ? a.data.mch_list[0].content : ""), 
        i.payment = a.data.payment, i.formId = t.detail.formId, a.order_submit(i, "s");
    },
    onReady: function() {},
    onShow: function() {
        var t = this, a = wx.getStorageSync("picker_address");
        if (a) {
            var e = t.data.is_area_city_id;
            e && (!function(t, a) {
                for (var e = 0; e < t.length; e++) if (a == t[e]) return !1;
                return !0;
            }(e, a.city_id) ? t.setData({
                is_area: 0
            }) : t.setData({
                is_area: 1
            })), t.setData({
                address: a,
                name: a.name,
                mobile: a.mobile
            }), wx.removeStorageSync("picker_address");
        }
        t.getOrderData(t.data.options);
    },
    getOrderData: function(s) {
        var o = this, d = {}, r = "";
        if (o.data.address && o.data.address.id && (r = o.data.address.id), d.address_id = r, 
        d.longitude = e, d.latitude = i, wx.showLoading({
            title: "正在加载",
            mask: !0
        }), s.cart_list) {
            JSON.parse(s.cart_list);
            d.cart_list = s.cart_list;
        }
        if (s.cart_id_list) {
            var n = JSON.parse(s.cart_id_list);
            d.cart_id_list = n;
        }
        if (s.mch_list) {
            var c = JSON.parse(s.mch_list);
            d.mch_list = c;
        }
        s.goods_info && (d.goods_info = s.goods_info), a.request({
            url: t.order.submit_preview,
            data: d,
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = [], e = t.data.coupon_list;
                    for (var i in e) null != e[i] && a.push(e[i]);
                    var s = t.data.shop_list, d = {};
                    s && 1 == s.length && (d = s[0]), t.data.is_shop && (d = t.data.is_shop), o.setData({
                        total_price: t.data.total_price || 0,
                        goods_list: t.data.list || null,
                        address: t.data.address || null,
                        express_price: parseFloat(t.data.express_price),
                        coupon_list: a,
                        shop_list: s,
                        shop: d,
                        name: t.data.address ? t.data.address.name : "",
                        mobile: t.data.address ? t.data.address.mobile : "",
                        send_type: t.data.send_type,
                        level: t.data.level,
                        new_total_price: t.data.total_price || 0,
                        integral: t.data.integral,
                        goods_card_list: t.data.goods_card_list || [],
                        form: t.data.form,
                        is_payment: t.data.is_payment,
                        pay_type_list: t.data.pay_type_list,
                        payment: t.data.pay_type_list[0].payment,
                        mch_list: t.data.mch_list || null,
                        is_area_city_id: t.data.is_area_city_id
                    }), t.data.pay_type_list.length > 1 && o.setData({
                        payment: -1
                    }), t.data.goods_info && o.setData({
                        goods_info: t.data.goods_info
                    }), t.data.cart_id_list && o.setData({
                        cart_id_list: t.data.cart_id_list
                    }), t.data.cart_list && o.setData({
                        cart_list: t.data.cart_list
                    }), 1 == t.data.send_type && o.setData({
                        offline: 0
                    }), 2 == t.data.send_type && o.setData({
                        offline: 1
                    }), o.getPrice(), 1 == t.data.is_area && o.setData({
                        is_area: 1
                    });
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(t) {
                        t.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    },
    copyText: function(t) {
        var a = t.currentTarget.dataset.text;
        a && wx.setClipboardData({
            data: a,
            success: function() {
                page.showToast({
                    title: "已复制内容"
                });
            },
            fail: function() {
                page.showToast({
                    title: "复制失败",
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    showCouponPicker: function() {
        var t = this;
        t.data.coupon_list && t.data.coupon_list.length > 0 && t.setData({
            show_coupon_picker: !0
        });
    },
    pickCoupon: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        "-1" == e || -1 == e ? a.setData({
            picker_coupon: !1,
            show_coupon_picker: !1
        }) : a.setData({
            picker_coupon: a.data.coupon_list[e],
            show_coupon_picker: !1
        }), a.getPrice();
    },
    numSub: function(t, a, e) {
        return 100;
    },
    showShop: function(t) {
        var a = this;
        a.dingwei(), a.data.shop_list && a.data.shop_list.length >= 1 && a.setData({
            show_shop: !0
        });
    },
    pickShop: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        "-1" == e || -1 == e ? a.setData({
            shop: !1,
            show_shop: !1
        }) : a.setData({
            shop: a.data.shop_list[e],
            show_shop: !1
        }), a.getPrice();
    },
    integralSwitchChange: function(t) {
        var a = this;
        0 != t.detail.value ? a.setData({
            integral_radio: 1
        }) : a.setData({
            integral_radio: 2
        }), a.getPrice();
    },
    integration: function(t) {
        var a = this.data.integral.integration;
        wx.showModal({
            title: "积分使用规则",
            content: a,
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#ff4544",
            success: function(t) {
                t.confirm && console.log("用户点击确定");
            }
        });
    },
    getPrice: function() {
        var t = this, a = t.data.total_price, e = t.data.express_price, i = t.data.picker_coupon, s = t.data.integral, o = t.data.integral_radio, d = t.data.level, r = t.data.offline;
        if (t.data.goods_list && t.data.goods_list.length > 0 && (i && (a -= i.sub_price), 
        s && 1 == o && (a -= parseFloat(s.forehead)), d && (a = a * d.discount / 10), a <= .01 && (a = .01), 
        0 == r && (a += e)), t.data.mch_list && t.data.mch_list.length) for (var n in t.data.mch_list) a += t.data.mch_list[n].total_price + t.data.mch_list[n].express_price;
        t.setData({
            new_total_price: parseFloat(a.toFixed(2))
        });
    },
    cardDel: function() {
        this.setData({
            show_card: !1
        }), wx.redirectTo({
            url: "/pages/order/order?status=1"
        });
    },
    cardTo: function() {
        this.setData({
            show_card: !1
        }), wx.redirectTo({
            url: "/pages/card/card"
        });
    },
    formInput: function(t) {
        var a = this, e = t.currentTarget.dataset.index, i = a.data.form, s = i.list;
        s[e].default = t.detail.value, i.list = s, a.setData({
            form: i
        });
    },
    selectForm: function(t) {
        var a = this, e = t.currentTarget.dataset.index, i = t.currentTarget.dataset.k, s = a.data.form, o = s.list;
        if ("radio" == o[e].type) {
            var d = o[e].default_list;
            for (var r in d) r == i ? d[i].is_selected = 1 : d[r].is_selected = 0;
            o[e].default_list = d;
        }
        "checkbox" == o[e].type && (1 == (d = o[e].default_list)[i].is_selected ? d[i].is_selected = 0 : d[i].is_selected = 1, 
        o[e].default_list = d), s.list = o, a.setData({
            form: s
        });
    },
    showPayment: function() {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            payment: a,
            show_payment: !1
        });
    },
    payClose: function() {
        this.setData({
            show_payment: !1
        });
    }
});