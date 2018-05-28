var t = require("../../../api.js"), a = getApp(), e = "", i = "", s = require("../../../utils/utils.js");

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
        this.setData({
            content: t.detail.value
        });
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
        if (1 == t.target.dataset.index) this.setData({
            offline: 1,
            express_price: 0,
            express_price_1: e,
            is_area: 0
        }); else {
            var s = a.data.is_area_city_id, o = t.target.dataset.city_id;
            s && function(t, a) {
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
        if (i.offline = e, -1 == a.data.payment) return a.setData({
            show_payment: !0
        }), !1;
        a.data.cart_id_list && (i.cart_id_list = JSON.stringify(a.data.cart_id_list)), a.data.goods_info && (i.goods_info = JSON.stringify(a.data.goods_info)), 
        a.data.picker_coupon && (i.user_coupon_id = a.data.picker_coupon.user_coupon_id), 
        a.data.content && (i.content = a.data.content), 1 == a.data.integral_radio ? i.use_integral = 1 : i.use_integral = 2, 
        i.payment = a.data.payment, i.formId = t.detail.formId, a.order_submit(i, "ms");
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
        var o = this, n = "";
        o.data.address && o.data.address.id && (n = o.data.address.id), s.goods_info && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.miaosha.submit_preview,
            data: {
                goods_info: s.goods_info,
                address_id: n,
                longitude: e,
                latitude: i
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = t.data.shop_list, e = {};
                    1 == a.length && (e = a[0]), console.log(t.data), o.setData({
                        total_price: t.data.total_price,
                        goods_list: t.data.list,
                        goods_info: t.data.goods_info,
                        address: t.data.address,
                        express_price: parseFloat(t.data.express_price),
                        coupon_list: t.data.coupon_list,
                        shop_list: a,
                        shop: e,
                        name: t.data.address ? t.data.address.name : "",
                        mobile: t.data.address ? t.data.address.mobile : "",
                        send_type: t.data.send_type,
                        level: t.data.level,
                        new_total_price: t.data.total_price,
                        integral: t.data.integral,
                        is_payment: t.data.is_payment,
                        is_coupon: t.data.list[0].coupon,
                        is_discount: t.data.list[0].is_discount,
                        pay_type_list: t.data.pay_type_list,
                        payment: t.data.pay_type_list[0].payment,
                        is_area_city_id: t.data.is_area_city_id
                    }), t.data.pay_type_list.length > 1 && o.setData({
                        payment: -1
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
                        t.confirm && (1 == getCurrentPages().length ? wx.redirectTo({
                            url: "/pages/index/index"
                        }) : wx.navigateBack({
                            delta: 1
                        }));
                    }
                });
            }
        }));
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
        var t = this, a = t.data.total_price, e = t.data.express_price, i = t.data.picker_coupon, s = t.data.integral, o = t.data.integral_radio, n = t.data.level, r = t.data.offline;
        i && (a -= i.sub_price), s && 1 == o && (a -= parseFloat(s.forehead)), n && (a = a * n.discount / 10), 
        a <= .01 && (a = .01), 0 == r && (a += e), t.setData({
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
            var n = o[e].default_list;
            for (var r in n) r == i ? n[i].is_selected = 1 : n[r].is_selected = 0;
            o[e].default_list = n;
        }
        "checkbox" == o[e].type && (1 == (n = o[e].default_list)[i].is_selected ? n[i].is_selected = 0 : n[i].is_selected = 1, 
        o[e].default_list = n), s.list = o, a.setData({
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