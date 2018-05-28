var t = require("../../api.js"), a = getApp(), e = !1, s = !1;

Page({
    data: {
        cat_list: [],
        sub_cat_list_scroll_top: 0,
        scrollLeft: 0,
        page: 1,
        cat_style: 0,
        height: 0
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
        var e = wx.getStorageSync("store"), s = t.cat_id;
        void 0 !== s && s && (this.data.cat_style = e.cat_style = -1, wx.showLoading({
            title: "正在加载",
            mask: !0
        }), this.childrenCat(s)), this.setData({
            store: e
        });
    },
    onShow: function() {
        wx.hideLoading(), a.pageOnShow(this), -1 !== this.data.cat_style && this.loadData();
    },
    loadData: function(e) {
        var s = this;
        if ("" == s.data.cat_list || 5 != wx.getStorageSync("store").cat_style && 4 != wx.getStorageSync("store").cat_style && 2 != wx.getStorageSync("store").cat_style) {
            var c = wx.getStorageSync("cat_list");
            c && s.setData({
                cat_list: c,
                current_cat: null
            }), a.request({
                url: t.default.cat_list,
                success: function(t) {
                    0 == t.code && (s.data.cat_list = t.data.list, 5 === wx.getStorageSync("store").cat_style && s.goodsAll({
                        currentTarget: {
                            dataset: {
                                index: 0
                            }
                        }
                    }), 4 !== wx.getStorageSync("store").cat_style && 2 !== wx.getStorageSync("store").cat_style || s.catItemClick({
                        currentTarget: {
                            dataset: {
                                index: 0
                            }
                        }
                    }), 1 !== wx.getStorageSync("store").cat_style && 3 !== wx.getStorageSync("store").cat_style || (s.setData({
                        cat_list: t.data.list,
                        current_cat: null
                    }), wx.setStorageSync("cat_list", t.data.list)));
                },
                complete: function() {
                    wx.stopPullDownRefresh();
                }
            });
        } else s.setData({
            cat_list: s.data.cat_list,
            current_cat: s.data.current_cat
        });
    },
    childrenCat: function(s) {
        var c = this;
        e = !1;
        c.data.page;
        a.request({
            url: t.default.cat_list,
            success: function(t) {
                if (0 == t.code) {
                    var a = !0;
                    for (var e in t.data.list) t.data.list[e].id == s && t.data.list[e].list.length > 0 && (a = !1, 
                    c.setData({
                        current_cat: t.data.list[e]
                    }), c.goodsItem({
                        currentTarget: {
                            dataset: {
                                index: 0
                            }
                        }
                    }));
                    a && c.setData({
                        show_no_data_tip: !0
                    });
                }
            },
            complete: function() {
                wx.stopPullDownRefresh(), wx.createSelectorQuery().select("#cat").boundingClientRect(function(t) {
                    console.log("21分类" + t.height), c.setData({
                        height: t.height
                    });
                }).exec();
            }
        });
    },
    catItemClick: function(t) {
        var a = this, e = t.currentTarget.dataset.index, s = a.data.cat_list, c = null;
        for (var i in s) i == e ? (s[i].active = !0, !1, c = s[i]) : s[i].active = !1;
        console.log(c), a.setData({
            cat_list: s,
            sub_cat_list_scroll_top: 0,
            current_cat: c
        });
    },
    goodsItem: function(t) {
        var a = this, e = t.currentTarget.dataset.index, s = a.data.current_cat, c = 0;
        for (var i in s.list) e == i ? (s.list[i].active = !0, c = s.list[i].id) : s.list[i].active = !1;
        a.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1,
            current_cat: s
        }), this.list(c, 2);
    },
    goodsAll: function(t) {
        var a = this, e = t.currentTarget.dataset.index, s = a.data.cat_list, c = null;
        for (var i in s) i == e ? (s[i].active = !0, c = s[i]) : s[i].active = !1;
        a.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1,
            cat_list: s,
            current_cat: c
        });
        var o = t.currentTarget.offsetLeft, l = a.data.scrollLeft;
        l = o - 80, a.setData({
            scrollLeft: l
        }), this.list(c.id, 1), wx.createSelectorQuery().select("#catall").boundingClientRect(function(t) {
            console.log("11分类" + t.height), a.setData({
                height: t.height
            });
        }).exec();
    },
    list: function(s, c) {
        var i = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e = !1;
        var o = i.data.page || 2;
        a.request({
            url: t.default.goods_list,
            data: {
                cat_id: s,
                page: o
            },
            success: function(t) {
                0 == t.code && (wx.hideLoading(), 0 == t.data.list.length && (e = !0), i.setData({
                    page: o + 1
                }), i.setData({
                    goods_list: t.data.list
                }), i.setData({
                    cat_id: s
                })), i.setData({
                    show_no_data_tip: 0 == i.data.goods_list.length
                });
            },
            complete: function() {
                1 == c && wx.createSelectorQuery().select("#catall").boundingClientRect(function(t) {
                    console.log("12分类" + t.height), i.setData({
                        height: t.height
                    });
                }).exec();
            }
        });
    },
    onReachBottom: function() {
        var t = this;
        e || 5 != wx.getStorageSync("store").cat_style && -1 != t.data.cat_style || t.loadMoreGoodsList();
    },
    loadMoreGoodsList: function() {
        var c = this;
        if (!s) {
            c.setData({
                show_loading_bar: !0
            }), s = !0;
            var i = c.data.cat_id || "", o = c.data.page || 2;
            a.request({
                url: t.default.goods_list,
                data: {
                    page: o,
                    cat_id: i
                },
                success: function(t) {
                    0 == t.data.list.length && (e = !0);
                    var a = c.data.goods_list.concat(t.data.list);
                    c.setData({
                        goods_list: a,
                        page: o + 1
                    });
                },
                complete: function() {
                    s = !1, c.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    }
});