var t = require("../../api.js"), a = require("../../utils.js"), o = getApp(), i = require("../../wxParse/wxParse.js"), r = 1, e = !1, s = !0, d = 0;

Page({
    data: {
        id: null,
        goods: {},
        show_attr_picker: !1,
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        },
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: wx.getSystemInfoSync().windowWidth,
        y: wx.getSystemInfoSync().windowHeight - 20,
        miaosha_end_time_over: {
            h: "--",
            m: "--",
            s: "--"
        },
        page: 1,
        drop: !1,
        goodsModel: !1
    },
    onLoad: function(t) {
        var i = this;
        o.pageOnLoad(this), console.log(wx.getSystemInfoSync()), d = 0, r = 1, e = !1, s = !0;
        var n = t.quick;
        if (n) {
            var c = wx.getStorageSync("item");
            if (c) var _ = c.total, l = c.carGoods; else var _ = {
                total_price: 0,
                total_num: 0
            }, l = [];
            i.setData({
                quick: n,
                quick_list: c.quick_list,
                total: _,
                carGoods: l,
                quick_hot_goods_lists: c.quick_hot_goods_lists
            });
        }
        this.setData({
            store: wx.getStorageSync("store")
        });
        var u = 0, g = t.user_id;
        console.log("options=>" + JSON.stringify(t));
        var m = decodeURIComponent(t.scene);
        if (void 0 != g) u = g; else if (void 0 != m) {
            console.log("scene string=>" + m);
            var f = a.scene_decode(m);
            console.log("scene obj=>" + JSON.stringify(f)), f.uid && f.gid ? (u = f.uid, t.id = f.gid) : u = m;
        }
        o.loginBindParent({
            parent_id: u
        }), i.setData({
            id: t.id
        }), i.getGoods(), i.getCommentList();
    },
    getGoods: function() {
        var a = this;
        if (a.data.quick) {
            var r = a.data.carGoods;
            if (r) {
                for (var e = r.length, s = 0, d = 0; d < e; d++) r[d].goods_id == a.data.id && (s += parseInt(r[d].num));
                a.setData({
                    goods_num: s
                });
            }
        }
        o.request({
            url: t.default.goods,
            data: {
                id: a.data.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = t.data.detail;
                    i.wxParse("detail", "html", o, a), a.setData({
                        goods: t.data,
                        attr_group_list: t.data.attr_group_list
                    }), a.goods_recommend({
                        goods_id: t.data.id,
                        reload: !0
                    }), a.data.goods.miaosha && a.setMiaoshaTimeOver(), a.selectDefaultAttr();
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.switchTab({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    goodsModel: function(t) {
        var a = this, o = (a.data.carGoods, a.data.goodsModel);
        o ? a.setData({
            goodsModel: !1
        }) : a.setData({
            goodsModel: !0
        });
    },
    hideGoodsModel: function() {
        this.setData({
            goodsModel: !1
        });
    },
    close_box: function(t) {
        this.setData({
            showModal: !1
        });
    },
    showDialogBtn: function(t) {
        this.setData({
            showModal: !0
        });
    },
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    onConfirm: function(t) {
        var a = this, o = a.data.attr_group_list, i = [], r = [], e = a.data.goods;
        for (var s in o) {
            var d = !1;
            for (var n in o[s].attr_list) if (o[s].attr_list[n].checked) {
                d = {
                    attr_id: o[s].attr_list[n].attr_id,
                    attr_name: o[s].attr_list[n].attr_name
                };
                break;
            }
            if (!d) return wx.showToast({
                title: "请选择" + o[s].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            i.push({
                attr_id: d.attr_id,
                attr_name: d.attr_name
            }), r.push({
                attr_group_id: o[s].attr_group_id,
                attr_group_name: o[s].attr_group_name,
                attr_id: d.attr_id,
                attr_name: d.attr_name
            });
        }
        for (var c = a.data.carGoods, _ = JSON.parse(e.attr), l = _.length, s = 0; s < l; s++) {
            var u = _[s].attr_list;
            if (JSON.stringify(u) == JSON.stringify(i)) var g = _[s].price, m = _[s].num;
        }
        if (0 == g) f = parseFloat(e.price); else var f = parseFloat(g);
        var p = {
            goods_id: e.id,
            num: 1,
            goods_name: e.name,
            attr: r,
            goods_price: f,
            price: f
        }, h = c.length, v = !0, w = 0;
        if (h <= 0) w = 1, c.push(p); else {
            for (N = 0; N < h; N++) c[N].goods_id == e.id && JSON.stringify(c[N].attr) == JSON.stringify(r) && (c[N].num += 1, 
            w = c[N].num, c[N].goods_price = w * f, c[N].goods_price = c[N].goods_price.toFixed(2), 
            v = !1);
            v && (c.push(p), w = 1);
        }
        if (w > m) {
            wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), w = m;
            for (N = 0; N < h; N++) c[N].goods_id == e.id && JSON.stringify(c[N].attr) == JSON.stringify(r) && (c[N].num = m, 
            c[N].goods_price -= f, c[N].goods_price = c[N].goods_price.toFixed(2));
        } else {
            var x = a.data.goods_num;
            x += 1;
            var k = a.data.total;
            k.total_num += 1, k.total_price = parseFloat(k.total_price), f = parseFloat(f), 
            k.total_price += f, k.total_price = k.total_price.toFixed(2);
            var D = a.data.quick_hot_goods_lists;
            if (D) {
                var S = D.find(function(t) {
                    return t.id == a.data.id;
                });
                S && (S.num += 1);
            }
            var q = a.data.quick_list;
            if (q) {
                for (var b = q.length, y = [], s = 0; s < b; s++) for (var F = q[s].goods, G = F.length, N = 0; N < G; N++) y.push(F[N]);
                for (var O = y.length, M = [], T = 0; T < O; T++) y[T].id == a.data.id && M.push(y[T]);
                for (var G = M.length, C = 0; C < G; C++) M[C].num += 1;
            }
            a.setData({
                carGoods: c,
                check_num: w,
                total: k,
                goods_num: x
            });
            var J = {
                quick_list: q,
                quick_hot_goods_lists: D,
                carGoods: c,
                total: k
            };
            wx.setStorageSync("item", J);
        }
    },
    guigejian: function(t) {
        var a = this, o = a.data.attr_group_list, i = [], r = [];
        for (var e in o) {
            var s = !1;
            for (var d in o[e].attr_list) if (o[e].attr_list[d].checked) {
                s = {
                    attr_id: o[e].attr_list[d].attr_id,
                    attr_name: o[e].attr_list[d].attr_name
                };
                break;
            }
            if (!s) return wx.showToast({
                title: "请选择" + o[e].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            i.push({
                attr_id: s.attr_id,
                attr_name: s.attr_name
            }), r.push({
                attr_group_id: o[e].attr_group_id,
                attr_group_name: o[e].attr_group_name,
                attr_id: s.attr_id,
                attr_name: s.attr_name
            });
        }
        for (var n = a.data.goods, c = JSON.parse(n.attr), _ = c.length, e = 0; e < _; e++) {
            var l = c[e].attr_list;
            if (JSON.stringify(l) == JSON.stringify(i)) {
                var u = c[e].price;
                c[e].num;
            }
        }
        if (0 == u) g = parseFloat(n.price); else var g = parseFloat(u);
        for (var m = a.data.carGoods, f = m.length, p = 0; p < f; p++) if (m[p].goods_id == n.id && JSON.stringify(m[p].attr) == JSON.stringify(r)) {
            m[p].num -= 1;
            var h = m[p].num;
            m[p].goods_price = h * g;
        }
        var v = a.data.goods_num;
        v -= 1;
        var w = a.data.total;
        w.total_num -= 1, w.total_price = parseFloat(w.total_price), u = parseFloat(u), 
        w.total_price -= u, w.total_price = w.total_price.toFixed(2);
        var x = a.data.quick_hot_goods_lists;
        if (x) {
            var k = x.find(function(t) {
                return t.id == a.data.id;
            });
            k && (k.num -= 1);
        }
        var D = a.data.quick_list;
        if (D) {
            for (var S = D.length, q = [], e = 0; e < S; e++) for (var b = D[e].goods, y = b.length, p = 0; p < y; p++) q.push(b[p]);
            for (var F = q.length, G = [], N = 0; N < F; N++) q[N].id == a.data.id && G.push(q[N]);
            for (var y = G.length, O = 0; O < y; O++) G[O].num -= 1;
        }
        a.setData({
            carGoods: m,
            check_num: h,
            total: w,
            goods_num: v
        });
        var M = {
            quick_list: D,
            quick_hot_goods_lists: x,
            carGoods: m,
            total: w
        };
        wx.setStorageSync("item", M);
    },
    jia: function(t) {
        var a = this, o = a.data.goods, i = a.data.goods_num;
        if ((i += 1) > JSON.parse(o.attr)[0].num) return wx.showToast({
            title: "商品库存不足",
            image: "/images/icon-warning.png"
        }), void (i -= 1);
        var r = a.data.total;
        r.total_num += 1, o.price = parseFloat(o.price), r.total_price = parseFloat(r.total_price), 
        r.total_price += o.price, r.total_price = r.total_price.toFixed(2);
        var e = parseFloat(o.price * i), s = {
            goods_id: o.id,
            num: 1,
            goods_name: o.name,
            attr: "",
            goods_price: e.toFixed(2),
            price: o.price.toFixed(2)
        }, d = a.data.carGoods, n = !0;
        if ((u = d.length) <= 0) d.push(s); else {
            for (h = 0; h < u; h++) d[h].goods_id == o.id && (d[h].num += 1, d[h].goods_price = e.toFixed(2), 
            n = !1);
            n && d.push(s);
        }
        var c = a.data.quick_hot_goods_lists;
        if (c) {
            var _ = c.find(function(t) {
                return t.id == a.data.id;
            });
            _ && (_.num += 1);
        }
        var l = a.data.quick_list;
        if (l) {
            for (var u = l.length, g = [], m = 0; m < u; m++) for (var f = l[m].goods, p = f.length, h = 0; h < p; h++) g.push(f[h]);
            for (var v = g.length, w = [], x = 0; x < v; x++) g[x].id == a.data.id && w.push(g[x]);
            for (var p = w.length, k = 0; k < p; k++) w[k].num += 1;
        }
        a.setData({
            goods_num: i,
            carGoods: d,
            total: r
        });
        var D = {
            quick_list: l,
            quick_hot_goods_lists: c,
            carGoods: d,
            total: r
        };
        wx.setStorageSync("item", D);
    },
    jian: function() {
        var t = this, a = t.data.goods, o = t.data.goods_num;
        o -= 1;
        var i = t.data.total;
        i.total_num -= 1, a.price = parseFloat(a.price), i.total_price = parseFloat(i.total_price), 
        i.total_price -= a.price, i.total_price = i.total_price.toFixed(2);
        for (var r = t.data.carGoods, e = r.length, s = 0; s < e; s++) r[s].goods_id == a.id && (r[s].num -= 1, 
        r[s].goods_price = parseFloat(r[s].goods_price), r[s].goods_price -= a.price, r[s].goods_price = r[s].goods_price.toFixed(2));
        var d = t.data.quick_hot_goods_lists;
        if (d) {
            var n = d.find(function(a) {
                return a.id == t.data.id;
            });
            n && (n.num -= 1);
        }
        var c = t.data.quick_list;
        if (c) {
            for (var e = c.length, _ = [], l = 0; l < e; l++) for (var u = c[l].goods, g = u.length, s = 0; s < g; s++) _.push(u[s]);
            for (var m = _.length, f = [], p = 0; p < m; p++) _[p].id == t.data.id && f.push(_[p]);
            for (var g = f.length, h = 0; h < g; h++) f[h].num -= 1;
        }
        t.setData({
            goods_num: o,
            carGoods: r,
            total: i
        });
        var v = {
            quick_list: c,
            quick_hot_goods_lists: d,
            carGoods: r,
            total: i
        };
        wx.setStorageSync("item", v);
    },
    tianjia: function(t) {
        var a = this, o = t.currentTarget.dataset, i = a.data.quick_list, r = a.data.goods;
        if (i) {
            for (var e = i.length, s = [], d = 0; d < e; d++) for (var n = i[d].goods, c = n.length, _ = 0; _ < c; _++) s.push(n[_]);
            for (var l = s.length, u = [], g = 0; g < l; g++) s[g].id == o.id && u.push(s[g]);
            var m = JSON.parse(u[0].attr);
            if (1 == m.length) {
                var f = (F = a.data.carGoods).find(function(t) {
                    return t.goods_id == o.id;
                });
                if (f.num += 1, f.num > m[0].num) return wx.showToast({
                    title: "商品库存不足",
                    image: "/images/icon-warning.png"
                }), void (f.num -= 1);
                f.goods_price = parseFloat(f.goods_price), o.price = parseFloat(o.price), f.goods_price += o.price, 
                f.goods_price = f.goods_price.toFixed(2);
                for (var p = u.length, h = 0; h < p; h++) u[h].num += 1;
            } else {
                for (var p = u.length, h = 0; h < p; h++) u[h].num += 1;
                for (var v = (F = a.data.carGoods).length, w = [], _ = 0; _ < v; _++) if (o.index == _) for (var x = F[_].attr, k = x.length, d = 0; d < k; d++) {
                    var D = {
                        attr_id: x[d].attr_id,
                        attr_name: x[d].attr_name
                    };
                    w.push(D);
                }
                for (var S = m.length, d = 0; d < S; d++) if (JSON.stringify(m[d].attr_list) == JSON.stringify(w)) var q = m[d].num;
                for (_ = 0; _ < v; _++) if (o.index == _ && (F[_].num += 1, F[_].goods_price = parseFloat(F[_].goods_price), 
                o.price = parseFloat(o.price), F[_].goods_price += o.price, F[_].goods_price = F[_].goods_price.toFixed(2), 
                F[_].num > q)) {
                    wx.showToast({
                        title: "商品库存不足",
                        image: "/images/icon-warning.png"
                    }), F[_].num -= 1;
                    for (var p = u.length, h = 0; h < p; h++) u[h].num -= 1;
                    return F[_].goods_price -= o.price, void (F[_].goods_price = F[_].goods_price.toFixed(2));
                }
            }
            var b = a.data.quick_hot_goods_lists;
            if (b) {
                var y = b.find(function(t) {
                    return t.id == o.id;
                });
                y && (y.num += 1);
            }
        } else {
            var F = a.data.carGoods, G = F[o.index].attr, N = [];
            if (G) for (var O = G.length, _ = 0; _ < O; _++) N.push({
                attr_id: G[_].attr_id,
                attr_name: G[_].attr_name
            });
            if (0 == r.use_attr) J = (M = JSON.parse(r.attr))[0].num; else for (var M = JSON.parse(r.attr), T = M.length, d = 0; d < T; d++) {
                var C = M[d].attr_list;
                if (JSON.stringify(C) == JSON.stringify(N)) var J = M[d].num;
            }
            if (F[o.index].num += 1, F[o.index].goods_price = parseFloat(F[o.index].goods_price), 
            o.price = parseFloat(o.price), F[o.index].goods_price += o.price, F[o.index].goods_price = F[o.index].goods_price.toFixed(2), 
            F[o.index].num > J) return wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), void (F[o.index].num = J);
        }
        var I = a.data.total;
        I.total_num += 1, I.total_price = parseFloat(I.total_price), o.price = parseFloat(o.price), 
        I.total_price += o.price, I.total_price = I.total_price.toFixed(2);
        var P = a.data.goods_num;
        P += 1, a.setData({
            carGoods: F,
            total: I,
            goods_num: P
        });
        var A = {
            quick_list: i,
            quick_hot_goods_lists: b,
            carGoods: F,
            total: I
        };
        wx.setStorageSync("item", A);
    },
    jianshao: function(t) {
        for (var a = this, o = t.currentTarget.dataset, i = a.data.carGoods, r = i.length, e = 0; e < r; e++) if (o.index == e) {
            if (i[e].num <= 0) return;
            i[e].num -= 1, o.price = parseFloat(o.price), i[e].goods_price = parseFloat(i[e].goods_price), 
            i[e].goods_price -= o.price, i[e].goods_price = i[e].goods_price.toFixed(2);
        }
        a.setData({
            carGoods: i
        });
        var s = a.data.quick_list;
        if (s) {
            for (var r = s.length, d = [], n = 0; n < r; n++) for (var c = s[n].goods, _ = c.length, e = 0; e < _; e++) d.push(c[e]);
            for (var l = [], u = d.length, e = 0; e < u; e++) o.id == d[e].id && l.push(d[e]);
            for (var g = l.length, m = 0; m < g; m++) l[m].id == o.id && (l[m].num -= 1);
            var f = a.data.quick_hot_goods_lists, p = f.find(function(t) {
                return t.id == o.id;
            });
            p && (p.num -= 1);
        }
        var h = a.data.total;
        h.total_num -= 1, h.total_price = parseFloat(h.total_price), h.total_price -= o.price, 
        h.total_price = h.total_price.toFixed(2);
        v = a.data.goods_num;
        v -= 1;
        var v = a.data.goods_num;
        v -= 1, a.setData({
            total: h,
            goods_num: v
        }), 0 == h.total_num && a.setData({
            goodsModel: !1
        });
        var w = {
            quick_list: s,
            quick_hot_goods_lists: f,
            carGoods: i,
            total: h
        };
        wx.setStorageSync("item", w);
    },
    clearCar: function() {
        var t = this;
        t.data.goods_num;
        var a = t.data.total;
        a.total_num = 0, a.total_price = 0;
        t.data.goodsModel;
        for (var o = t.data.carGoods, i = o.length, r = 0; r < i; r++) o[r].num = 0, o[r].goods_price = 0;
        for (var e = t.data.quick_list, i = e.length, r = 0; r < i; r++) for (var s = e[r].goods, d = s.length, n = 0; n < d; n++) s[n].num = 0;
        for (var c = t.data.quick_hot_goods_lists, _ = c.length, l = 0; l < _; l++) c[l].num = 0;
        t.setData({
            carGoods: o,
            total: a,
            goods_num: 0,
            goodsModel: !1,
            quick_list: e,
            quick_hot_goods_lists: c
        });
        var u = t.data.check_num;
        u && (u = 0, t.setData({
            check_num: u
        })), wx.getStorageSync("item") && wx.removeStorageSync("item");
    },
    buynow: function(t) {
        var a = this, o = a.data.carGoods;
        a.data.goodsModel;
        a.setData({
            goodsModel: !1
        });
        for (var i = o.length, r = [], e = [], s = 0; s < i; s++) 0 != o[s].num && (e = {
            id: o[s].goods_id,
            num: o[s].num,
            attr: o[s].attr
        }, r.push(e));
        wx.navigateTo({
            url: "/pages/order-submit/order-submit?cart_list=" + JSON.stringify(r)
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var o in t.data.attr_group_list[a].attr_list) 0 == a && 0 == o && (t.data.attr_group_list[a].attr_list[o].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    getCommentList: function(a) {
        var i = this;
        a && "active" != i.data.tab_comment || e || s && (e = !0, o.request({
            url: t.default.comment_list,
            data: {
                goods_id: i.data.id,
                page: r
            },
            success: function(t) {
                0 == t.code && (e = !1, r++, i.setData({
                    comment_count: t.data.comment_count,
                    comment_list: a ? i.data.comment_list.concat(t.data.list) : t.data.list
                }), 0 == t.data.list.length && (s = !1));
            }
        }));
    },
    onGoodsImageClick: function(t) {
        var a = this, o = [], i = t.currentTarget.dataset.index;
        for (var r in a.data.goods.pic_list) o.push(a.data.goods.pic_list[r].pic_url);
        wx.previewImage({
            urls: o,
            current: o[i]
        });
    },
    numberSub: function() {
        var t = this, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },
    numberAdd: function() {
        var t = this, a = t.data.form.number;
        a++, t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this, o = t.detail.value;
        o = parseInt(o), isNaN(o) && (o = 1), o <= 0 && (o = 1), a.setData({
            form: {
                number: o
            }
        });
    },
    addCart: function() {
        this.submit("ADD_CART");
    },
    buyNow: function() {
        this.submit("BUY_NOW");
    },
    submit: function(a) {
        var i = this;
        if (!i.data.show_attr_picker) return i.setData({
            show_attr_picker: !0
        }), !0;
        if (i.data.miaosha_data && i.data.miaosha_data.rest_num > 0 && i.data.form.number > i.data.miaosha_data.rest_num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (i.data.form.number > i.data.goods.num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var r = i.data.attr_group_list, e = [];
        for (var s in r) {
            var d = !1;
            for (var n in r[s].attr_list) if (r[s].attr_list[n].checked) {
                d = {
                    attr_id: r[s].attr_list[n].attr_id,
                    attr_name: r[s].attr_list[n].attr_name
                };
                break;
            }
            if (!d) return wx.showToast({
                title: "请选择" + r[s].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            e.push({
                attr_group_id: r[s].attr_group_id,
                attr_group_name: r[s].attr_group_name,
                attr_id: d.attr_id,
                attr_name: d.attr_name
            });
        }
        "ADD_CART" == a && (wx.showLoading({
            title: "正在提交",
            mask: !0
        }), o.request({
            url: t.cart.add_cart,
            method: "POST",
            data: {
                goods_id: i.data.id,
                attr: JSON.stringify(e),
                num: i.data.form.number
            },
            success: function(t) {
                wx.showToast({
                    title: t.msg,
                    duration: 1500
                }), wx.hideLoading(), i.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == a && (i.setData({
            show_attr_picker: !1
        }), wx.redirectTo({
            url: "/pages/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: i.data.id,
                attr: e,
                num: i.data.form.number
            })
        }));
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.setData({
            show_attr_picker: !0
        });
    },
    attrClick: function(a) {
        var i = this, r = a.target.dataset.groupId, e = a.target.dataset.id, s = i.data.attr_group_list;
        for (var d in s) if (s[d].attr_group_id == r) for (var n in s[d].attr_list) s[d].attr_list[n].attr_id == e ? s[d].attr_list[n].checked = !0 : s[d].attr_list[n].checked = !1;
        i.setData({
            attr_group_list: s
        });
        var c = [], _ = !0;
        for (var d in s) {
            var l = !1;
            for (var n in s[d].attr_list) if (s[d].attr_list[n].checked) {
                c.push(s[d].attr_list[n].attr_id), l = !0;
                break;
            }
            if (!l) {
                _ = !1;
                break;
            }
        }
        var u = i.data.carGoods;
        if (u) {
            for (var g = u.length, m = [], d = 0; d < g; d++) {
                if (u[d].goods_id == i.data.goods.id) var f = u[d].attr;
                if (f) {
                    for (var p = f.length, m = [], h = 0; h < p; h++) m.push(f[h].attr_id);
                    v = 0;
                    if (c.join(",") == m.join(",")) {
                        v = u[d].num;
                        break;
                    }
                } else var v = 0;
            }
            i.setData({
                check_num: v || null
            });
        }
        _ && o.request({
            url: t.default.goods_attr_info,
            data: {
                goods_id: i.data.goods.id,
                attr_list: JSON.stringify(c)
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = i.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, i.setData({
                        goods: a,
                        miaosha_data: t.data.miaosha
                    });
                }
            }
        });
    },
    favoriteAdd: function() {
        var a = this;
        o.request({
            url: t.user.favorite_add,
            method: "post",
            data: {
                goods_id: a.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = a.data.goods;
                    o.is_favorite = 1, a.setData({
                        goods: o
                    });
                }
            }
        });
    },
    favoriteRemove: function() {
        var a = this;
        o.request({
            url: t.user.favorite_remove,
            method: "post",
            data: {
                goods_id: a.data.goods.id
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = a.data.goods;
                    o.is_favorite = 0, a.setData({
                        goods: o
                    });
                }
            }
        });
    },
    tabSwitch: function(t) {
        var a = this;
        "detail" == t.currentTarget.dataset.tab ? a.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : a.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        console.log(t);
        var a = this, o = t.currentTarget.dataset.index, i = t.currentTarget.dataset.picIndex;
        wx.previewImage({
            current: a.data.comment_list[o].pic_list[i],
            urls: a.data.comment_list[o].pic_list
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = this, a = wx.getStorageSync("item");
        if (a) var o = a.total, i = a.carGoods, r = t.data.goods_num; else var o = {
            total_price: 0,
            total_num: 0
        }, i = [], r = 0;
        t.setData({
            total: o,
            carGoods: i,
            goods_num: r
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        "active" == t.data.tab_detail && t.data.drop ? (t.data.drop = !1, t.goods_recommend({
            goods_id: t.data.goods.id,
            loadmore: !0
        })) : "active" == t.data.tab_comment && t.getCommentList(!0);
    },
    onShareAppMessage: function() {
        var t = this, a = wx.getStorageSync("user_info");
        return {
            path: "/pages/goods/goods?id=" + this.data.id + "&user_id=" + a.id,
            success: function(a) {
                console.log(a), 1 == ++d && o.shareSendCoupon(t);
            },
            title: t.data.goods.name,
            imageUrl: t.data.goods.pic_list[0].pic_url
        };
    },
    play: function(t) {
        var a = t.target.dataset.url;
        this.setData({
            url: a,
            hide: "",
            show: !0
        }), wx.createVideoContext("video").play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), wx.createVideoContext("video").pause();
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function() {
        var a = this;
        if (a.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), a.data.goods_qrcode) return !0;
        o.request({
            url: t.default.goods_qrcode,
            data: {
                goods_id: a.data.id
            },
            success: function(t) {
                0 == t.code && a.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (a.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveGoodsQrcode: function() {
        var t = this;
        wx.saveImageToPhotosAlbum ? (wx.showLoading({
            title: "正在保存图片",
            mask: !1
        }), wx.downloadFile({
            url: t.data.goods_qrcode,
            success: function(t) {
                wx.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function() {
                        wx.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(t) {
                        wx.showModal({
                            title: "图片保存失败",
                            content: t.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(t) {
                        console.log(t), wx.hideLoading();
                    }
                });
            },
            fail: function(a) {
                wx.showModal({
                    title: "图片下载失败",
                    content: a.errMsg + ";" + t.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(t) {
                console.log(t), wx.hideLoading();
            }
        })) : wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
            showCancel: !1
        });
    },
    goodsQrcodeClick: function(t) {
        var a = t.currentTarget.dataset.src;
        wx.previewImage({
            urls: [ a ]
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    setMiaoshaTimeOver: function() {
        function t() {
            var t = o.data.goods.miaosha.end_time - o.data.goods.miaosha.now_time;
            t = t < 0 ? 0 : t, o.data.goods.miaosha.now_time++, o.setData({
                goods: o.data.goods,
                miaosha_end_time_over: a(t)
            });
        }
        function a(t) {
            var a = parseInt(t / 3600), o = parseInt(t % 3600 / 60), i = t % 60;
            return {
                h: a < 10 ? "0" + a : "" + a,
                m: o < 10 ? "0" + o : "" + o,
                s: i < 10 ? "0" + i : "" + i
            };
        }
        var o = this;
        t(), setInterval(function() {
            t();
        }, 1e3);
    },
    to_dial: function(t) {
        var a = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    goods_recommend: function(a) {
        var i = this;
        i.setData({
            is_loading: !0
        });
        var r = i.data.page || 2;
        o.request({
            url: t.default.goods_recommend,
            data: {
                goods_id: a.goods_id,
                page: r
            },
            success: function(t) {
                if (0 == t.code) {
                    if (a.reload) o = t.data.list;
                    if (a.loadmore) var o = i.data.goods_list.concat(t.data.list);
                    i.data.drop = !0, i.setData({
                        goods_list: o
                    }), i.setData({
                        page: r + 1
                    });
                }
            },
            complete: function() {
                i.setData({
                    is_loading: !1
                });
            }
        });
    }
});