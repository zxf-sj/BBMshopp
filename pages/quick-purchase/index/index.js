var t = require("../../../api.js"), a = getApp();

Page({
    data: {
        quick_list: [],
        goods_list: [],
        carGoods: [],
        showModal: !1,
        checked: !1,
        cat_checked: !1,
        color: "",
        total: {
            total_price: 0,
            total_num: 0
        }
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.setData({
            store: wx.getStorageSync("store")
        });
    },
    onShow: function() {
        a.pageOnShow(this), this.loadData();
    },
    loadData: function(o) {
        var r = this, i = wx.getStorageSync("item"), e = Object.keys(i).length;
        if (e >= 4) i.total, i.carGoods; else ;
        e >= 4 && r.setData({
            quick_hot_goods_lists: i.quick_hot_goods_lists,
            quick_list: i.quick_list,
            total: i.total,
            carGoods: i.carGoods
        }), a.request({
            url: t.quick.quick,
            success: function(t) {
                if (0 == t.code) {
                    for (var a = [], o = t.data.list, s = o.length, d = 0; d < s; d++) {
                        var n = o[d].goods;
                        n && 0 != n.length && a.push(o[d]);
                    }
                    for (var c = a.length, _ = [], l = 0; l < c; l++) _.push(a[l].goods);
                    for (var g = [].concat.apply([], _), u = g.length, p = [], h = 0; h < u; h++) 1 == g[h].hot_cakes && p.push(g[h]);
                    for (l = 0; l < p.length; l++) for (var f = l + 1; f < p.length; ) p[l].id == p[f].id ? p.splice(f, 1) : f++;
                    if (e >= 4) if (i.quick_hot_goods_lists.length != p.length || i.quick_list.length != a.length) {
                        var m = {
                            total_price: 0,
                            total_num: 0
                        }, v = [];
                        r.setData({
                            quick_hot_goods_lists: p,
                            quick_list: a,
                            total: m,
                            carGoods: v
                        });
                    } else r.setData({
                        quick_hot_goods_lists: i.quick_hot_goods_lists,
                        quick_list: i.quick_list,
                        total: i.total,
                        carGoods: i.carGoods
                    }); else {
                        var m = {
                            total_price: 0,
                            total_num: 0
                        }, v = [];
                        r.setData({
                            quick_hot_goods_lists: p,
                            quick_list: a,
                            total: m,
                            carGoods: v
                        });
                    }
                }
            }
        });
    },
    get_goods_info: function(t) {
        var a = this, o = a.data.carGoods, r = a.data.total, i = a.data.quick_hot_goods_lists, e = a.data.quick_list, s = {
            carGoods: o,
            total: r,
            quick_hot_goods_lists: i,
            check_num: a.data.check_num,
            quick_list: e
        };
        wx.setStorageSync("item", s);
        var d = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/goods/goods?id=" + d + "&quick=1"
        });
    },
    selectMenu: function(t) {
        var a = t.currentTarget.dataset, o = this.data.quick_list;
        if ("hot_cakes" == a.tag) for (var r = !0, i = o.length, e = 0; e < i; e++) o[e].cat_checked = !1; else {
            for (var s = a.index, i = o.length, e = 0; e < i; e++) o[e].cat_checked = !1, o[e].id == o[s].id && (o[e].cat_checked = !0);
            r = !1;
        }
        this.setData({
            toView: a.tag,
            selectedMenuId: a.id,
            quick_list: o,
            cat_checked: r
        });
    },
    onShareAppMessage: function(t) {
        var o = this;
        return {
            path: "/pages/index/index?user_id=" + wx.getStorageSync("user_info").id,
            success: function(t) {
                1 == ++share_count && a.shareSendCoupon(o);
            }
        };
    },
    jia: function(t) {
        for (var a = this, o = t.currentTarget.dataset, r = a.data.quick_list, i = r.length, e = [], s = 0; s < i; s++) for (var d = r[s].goods, n = d.length, c = 0; c < n; c++) e.push(d[c]);
        for (var _ = e.length, l = [], g = 0; g < _; g++) e[g].id == o.id && l.push(e[g]);
        for (var n = l.length, u = 0; u < n; u++) l[u].num += 1;
        var p = parseFloat(l[0].price * l[0].num), h = a.data.carGoods, f = {
            goods_id: l[0].id,
            num: 1,
            goods_name: l[0].name,
            attr: "",
            goods_price: p.toFixed(2),
            price: l[0].price
        }, m = !0;
        if ((i = h.length) <= 0) h.push(f); else {
            for (c = 0; c < i; c++) h[c].goods_id == l[0].id && (h[c].num += 1, h[c].goods_price = p.toFixed(2), 
            m = !1);
            m && h.push(f);
        }
        var v = h.find(function(t) {
            return t.goods_id == o.id;
        }), k = JSON.parse(l[0].attr);
        if (v.num > k[0].num) {
            wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), v.num = k[0].num;
            for (var q = 0; q < n; q++) l[q].num -= 1;
        } else {
            var S = a.data.total;
            S.total_num += 1, l[0].price = parseFloat(l[0].price), S.total_price = parseFloat(S.total_price), 
            S.total_price += l[0].price, S.total_price = S.total_price.toFixed(2);
            var D = a.data.quick_hot_goods_lists, w = D.find(function(t) {
                return t.id == o.id;
            });
            w && (w.num += 1), a.setData({
                quick_list: r,
                total: S,
                carGoods: h,
                quick_hot_goods_lists: D
            });
        }
    },
    jian: function(t) {
        for (var a = this, o = t.currentTarget.dataset, r = a.data.quick_list, i = r.length, e = [], s = 0; s < i; s++) for (var d = r[s].goods, n = d.length, c = 0; c < n; c++) e.push(d[c]);
        for (var _ = e.length, l = [], g = 0; g < _; g++) e[g].id == o.id && l.push(e[g]);
        for (var n = l.length, u = 0; u < n; u++) l[u].num -= 1;
        var p = a.data.total;
        p.total_num -= 1, l[0].price = parseFloat(l[0].price), p.total_price = parseFloat(p.total_price), 
        p.total_price -= l[0].price, p.total_price = p.total_price.toFixed(2);
        var h = a.data.quick_hot_goods_lists, f = h.find(function(t) {
            return t.id == o.id;
        });
        f && (f.num -= 1), a.setData({
            quick_list: r,
            total: p,
            quick_hot_goods_lists: h
        });
        var m = a.data.carGoods, v = m.find(function(t) {
            return t.goods_id == o.id;
        });
        v.num -= 1, v.goods_price = parseFloat(v.goods_price), v.goods_price -= l[0].price, 
        v.goods_price = v.goods_price.toFixed(2), a.setData({
            carGoods: m
        });
    },
    showDialogBtn: function(o) {
        var r = this, i = o.currentTarget.dataset.id, e = o.currentTarget.dataset;
        if (a.request({
            url: t.default.goods,
            data: {
                id: i
            },
            success: function(t) {
                0 == t.code && r.setData({
                    data: e,
                    attr_group_list: t.data.attr_group_list,
                    showModal: !0
                });
            }
        }), e.cid) s = r.data.quick_list.find(function(t) {
            return t.id == e.cid;
        }).goods.find(function(t) {
            return t.id == e.id;
        }); else var s = r.data.quick_hot_goods_lists.find(function(t) {
            return t.id == e.id;
        });
        for (var d = JSON.parse(s.attr), n = d.length, c = 0; c < n; c++) d[c].check_num = 0;
        r.setData({
            goods: s,
            goods_name: s.name,
            attr: d,
            check_num: 0
        });
        var _ = r.data.carGoods, l = _.length;
        if (l >= 1) for (c = 0; c < l; c++) JSON.stringify(s.name) != JSON.stringify(_[c].goods_name) && r.setData({
            check_num: !1,
            check_goods_price: !1
        });
    },
    close_box: function(t) {
        this.setData({
            showModal: !1
        });
    },
    attrClick: function(t) {
        var a = this, o = t.target.dataset.groupId, r = t.target.dataset.id, i = a.data.attr_group_list;
        for (var e in i) if (i[e].attr_group_id == o) for (var s in i[e].attr_list) i[e].attr_list[s].attr_id == r ? i[e].attr_list[s].checked = !0 : i[e].attr_list[s].checked = !1;
        for (var d = i.length, n = [], c = [], _ = 0; _ < d; _++) for (var l = i[_].attr_list, g = l.length, e = 0; e < g; e++) if (1 == l[e].checked) {
            var u = {
                attr_group_id: i[_].attr_group_id,
                attr_group_name: i[_].attr_group_name,
                attr_id: l[e].attr_id,
                attr_name: l[e].attr_name
            };
            c.push(u);
            var p = {
                attr_id: l[e].attr_id,
                attr_name: l[e].attr_name
            };
            n.push(p);
        }
        for (var h = a.data.attr, f = h.length, m = 0; m < f; m++) if (JSON.stringify(h[m].attr_list) == JSON.stringify(n)) var v = h[m].price;
        a.setData({
            attr_group_list: i,
            check_goods_price: v,
            check_attr_list: n
        });
        for (var k = a.data.carGoods, q = a.data.carGoods.length, S = a.data.goods, D = 0, _ = 0; _ < q; _++) if (k[_].goods_id == S.id && JSON.stringify(k[_].attr) == JSON.stringify(c)) {
            D = k[_].num;
            break;
        }
        a.setData({
            check_num: D
        });
    },
    onConfirm: function(t) {
        var a = this, o = (a.data.attr_group, a.data.attr_group_list), r = [];
        for (var i in o) {
            s = !1;
            for (var e in o[i].attr_list) if (o[i].attr_list[e].checked) {
                s = {
                    attr_id: o[i].attr_list[e].attr_id,
                    attr_name: o[i].attr_list[e].attr_name
                };
                break;
            }
            if (!s) return wx.showToast({
                title: "请选择" + o[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            r.push({
                attr_group_id: o[i].attr_group_id,
                attr_group_name: o[i].attr_group_name,
                attr_id: s.attr_id,
                attr_name: s.attr_name
            });
        }
        a.setData({
            attr_group_list: o
        });
        for (var s = a.data.attr, d = a.data.check_attr_list, n = s.length, c = 0; c < n; c++) if (JSON.stringify(s[c].attr_list) == JSON.stringify(d)) var _ = s[c].num;
        for (var l = a.data.data, g = a.data.quick_list, u = g.length, p = [], i = 0; i < u; i++) for (var h = g[i].goods, f = h.length, m = 0; m < f; m++) p.push(h[m]);
        for (var v = p.length, k = [], c = 0; c < v; c++) p[c].id == l.id && k.push(p[c]);
        a.setData({
            checked_attr_list: r
        });
        for (var n = r.length, q = [], m = 0; m < n; m++) q.push(r[m].attr_id);
        var S = a.data.carGoods, D = a.data.check_goods_price;
        if (0 == D) w = parseFloat(k[0].price); else var w = parseFloat(D);
        var x = {
            goods_id: k[0].id,
            num: 1,
            goods_name: k[0].name,
            attr: r,
            goods_price: w,
            price: w
        }, F = !0, G = 0;
        if ((u = S.length) <= 0) G = 1, S.push(x); else {
            for (m = 0; m < u; m++) S[m].goods_id == k[0].id && JSON.stringify(S[m].attr) == JSON.stringify(r) && (S[m].num += 1, 
            G = S[m].num, F = !1);
            F && (S.push(x), G = 1);
        }
        if (G > _) {
            wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), G = _;
            for (m = 0; m < u; m++) S[m].goods_id == k[0].id && JSON.stringify(S[m].attr) == JSON.stringify(r) && (S[m].num = _);
        } else {
            for (m = 0; m < u; m++) S[m].goods_id == k[0].id && JSON.stringify(S[m].attr) == JSON.stringify(r) && (S[m].goods_price = parseFloat(S[m].goods_price), 
            S[m].goods_price += w, S[m].goods_price = S[m].goods_price.toFixed(2));
            for (var f = k.length, y = 0; y < f; y++) k[y].num += 1;
            var O = a.data.total;
            O.total_num += 1, O.total_price = parseFloat(O.total_price), O.total_price += w, 
            O.total_price = O.total_price.toFixed(2);
            var J = a.data.quick_hot_goods_lists, N = J.find(function(t) {
                return t.id == l.id;
            });
            N && (N.num += 1), a.setData({
                quick_hot_goods_lists: J,
                quick_list: g,
                carGoods: S,
                total: O,
                check_num: G
            });
        }
    },
    preventTouchMove: function() {},
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    guigejian: function(t) {
        var a = this, o = a.data.data, r = a.data.goods, i = r.id, e = a.data.quick_list, s = e.length, d = [], n = a.data.attr_group_list, c = [];
        for (var _ in n) {
            var l = !1;
            for (var g in n[_].attr_list) if (n[_].attr_list[g].checked) {
                l = {
                    attr_id: n[_].attr_list[g].attr_id,
                    attr_name: n[_].attr_list[g].attr_name
                };
                break;
            }
            if (!l) return wx.showToast({
                title: "请选择" + n[_].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            c.push({
                attr_group_id: n[_].attr_group_id,
                attr_group_name: n[_].attr_group_name,
                attr_id: l.attr_id,
                attr_name: l.attr_name
            });
        }
        for (var u = a.data.check_num, _ = 0; _ < s; _++) for (var p = e[_].goods, h = p.length, f = 0; f < h; f++) d.push(p[f]);
        for (var m = d.length, v = [], k = 0; k < m; k++) r.id == d[k].id && v.push(d[k]);
        for (var q = v.length, S = 0; S < q; S++) v[S].num -= 1;
        var D = a.data.quick_hot_goods_lists, w = D.find(function(t) {
            return t.id == o.id;
        });
        w && (w.num -= 1), a.setData({
            quick_hot_goods_lists: D,
            quick_list: e
        });
        for (var x = a.data.carGoods, s = x.length, f = 0; f < s; f++) x[f].goods_id == i && JSON.stringify(x[f].attr) == JSON.stringify(c) && (x[f].num -= 1, 
        u = x[f].num);
        a.setData({
            check_num: u
        });
        var F = a.data.total;
        F.total_num -= 1;
        var G = a.data.check_goods_price;
        G = parseFloat(G), F.total_price = parseFloat(F.total_price), F.total_price -= G, 
        F.total_price = F.total_price.toFixed(2), a.setData({
            total: F
        }), 0 == F.total_num && a.setData({
            goodsModel: !1
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
    tianjia: function(t) {
        for (var a = this, o = t.currentTarget.dataset, r = a.data.quick_list, i = r.length, e = [], s = 0; s < i; s++) for (var d = r[s].goods, n = d.length, c = 0; c < n; c++) e.push(d[c]);
        for (var _ = e.length, l = [], g = 0; g < _; g++) e[g].id == o.id && l.push(e[g]);
        var u = JSON.parse(l[0].attr);
        if (1 == u.length) {
            var p = (m = a.data.carGoods).find(function(t) {
                return t.goods_id == o.id;
            });
            if (p.num += 1, p.num > u[0].num) return wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), void (p.num -= 1);
            p.goods_price = parseFloat(p.goods_price), o.price = parseFloat(o.price), p.goods_price += o.price, 
            p.goods_price = p.goods_price.toFixed(2);
            for (var h = l.length, f = 0; f < h; f++) l[f].num += 1;
        } else {
            for (var h = l.length, f = 0; f < h; f++) l[f].num += 1;
            for (var m = a.data.carGoods, v = m.length, k = [], c = 0; c < v; c++) if (o.index == c) for (var q = m[c].attr, S = q.length, s = 0; s < S; s++) {
                var D = {
                    attr_id: q[s].attr_id,
                    attr_name: q[s].attr_name
                };
                k.push(D);
            }
            for (var w = u.length, s = 0; s < w; s++) if (JSON.stringify(u[s].attr_list) == JSON.stringify(k)) var x = u[s].num;
            for (c = 0; c < v; c++) if (o.index == c && (m[c].num += 1, m[c].goods_price = parseFloat(m[c].goods_price), 
            o.price = parseFloat(o.price), m[c].goods_price += o.price, m[c].goods_price = m[c].goods_price.toFixed(2), 
            m[c].num > x)) {
                wx.showToast({
                    title: "商品库存不足",
                    image: "/images/icon-warning.png"
                }), m[c].num -= 1;
                for (var h = l.length, f = 0; f < h; f++) l[f].num -= 1;
                return m[c].goods_price -= o.price, void (m[c].goods_price = m[c].goods_price.toFixed(2));
            }
        }
        var F = a.data.total;
        F.total_num += 1, F.total_price = parseFloat(F.total_price), o.price = parseFloat(o.price), 
        F.total_price += o.price, F.total_price = F.total_price.toFixed(2);
        var G = a.data.quick_hot_goods_lists, y = G.find(function(t) {
            return t.id == o.id;
        });
        y && (y.num += 1), a.setData({
            quick_list: r,
            carGoods: m,
            total: F,
            quick_hot_goods_lists: G
        });
    },
    jianshao: function(t) {
        for (var a = this, o = t.currentTarget.dataset, r = a.data.carGoods, i = r.length, e = 0; e < i; e++) if (o.index == e) {
            if (r[e].num <= 0) return;
            r[e].num -= 1, o.price = parseFloat(o.price), r[e].goods_price = parseFloat(r[e].goods_price), 
            r[e].goods_price -= o.price, r[e].goods_price = r[e].goods_price.toFixed(2);
        }
        a.setData({
            carGoods: r
        });
        for (var s = a.data.quick_list, i = s.length, d = [], n = 0; n < i; n++) for (var c = s[n].goods, _ = c.length, e = 0; e < _; e++) d.push(c[e]);
        for (var l = [], g = d.length, e = 0; e < g; e++) o.id == d[e].id && l.push(d[e]);
        for (var u = l.length, p = 0; p < u; p++) l[p].id == o.id && (l[p].num -= 1);
        a.setData({
            quick_list: s
        });
        var h = a.data.total;
        h.total_num -= 1, h.total_price = parseFloat(h.total_price), h.total_price -= o.price, 
        h.total_price = h.total_price.toFixed(2);
        var f = a.data.quick_hot_goods_lists, m = f.find(function(t) {
            return t.id == o.id;
        });
        m && (m.num -= 1), a.setData({
            total: h,
            quick_hot_goods_lists: f
        }), 0 == h.total_num && a.setData({
            goodsModel: !1
        });
    },
    clearCar: function(t) {
        for (var a = this, o = (t.currentTarget.dataset, a.data.carGoods), r = o.length, i = 0; i < r; i++) o[i].num = 0, 
        o[i].goods_price = 0;
        var e = a.data.total;
        e.total_num = 0, e.total_price = 0, a.setData({
            total: e,
            carGoods: o,
            goodsModel: !1
        });
        for (var s = a.data.quick_list, r = s.length, i = 0; i < r; i++) for (var d = s[i].goods, n = d.length, c = 0; c < n; c++) d[c].num = 0;
        a.data.check_num;
        for (var _ = a.data.quick_hot_goods_lists, l = _.length, g = 0; g < l; g++) _[g].num = 0;
        a.setData({
            quick_list: s,
            check_num: 0,
            quick_hot_goods_lists: _
        }), wx.getStorageSync("item") && wx.removeStorageSync("item");
    },
    buynow: function(t) {
        var a = this, o = a.data.carGoods;
        a.data.goodsModel;
        a.setData({
            goodsModel: !1
        });
        for (var r = o.length, i = [], e = [], s = 0; s < r; s++) 0 != o[s].num && (e = {
            id: o[s].goods_id,
            num: o[s].num,
            attr: o[s].attr
        }, i.push(e));
        wx.navigateTo({
            url: "/pages/order-submit/order-submit?cart_list=" + JSON.stringify(i)
        });
    }
});