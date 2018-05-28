var t = require("../../api.js"), a = getApp();

Page({
    data: {
        load_more_count: 0,
        last_load_more_time: 0,
        is_loading: !1,
        loading_class: "",
        cat_id: !1,
        keyword: !1,
        page: 1,
        limit: 20,
        goods_list: [],
        show_history: !0,
        show_result: !1,
        history_list: [],
        is_search: !0
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
        var t = this;
        t.setData({
            history_list: t.getHistoryList(!0)
        });
    },
    inputFocus: function() {
        this.setData({
            show_history: !0,
            show_result: !1
        });
    },
    inputBlur: function() {
        var t = this;
        t.data.goods_list.length > 0 && setTimeout(function() {
            t.setData({
                show_history: !1,
                show_result: !0
            });
        }, 300);
    },
    inputConfirm: function(t) {
        var a = this, s = t.detail.value;
        0 != s.length && (a.setData({
            page: 1,
            keyword: s
        }), a.setHistory(s), a.getGoodsList());
    },
    searchCancel: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    historyClick: function(t) {
        var a = this, s = t.currentTarget.dataset.value;
        0 != s.length && (a.setData({
            page: 1,
            keyword: s
        }), a.getGoodsList());
    },
    getGoodsList: function() {
        var s = this;
        s.setData({
            show_history: !1,
            show_result: !0,
            is_search: !0
        }), s.setData({
            page: 1,
            scroll_top: 0
        }), s.setData({
            goods_list: []
        });
        var o = {};
        s.data.cat_id && (o.cat_id = s.data.cat_id, s.setActiveCat(o.cat_id)), s.data.keyword && (o.keyword = s.data.keyword), 
        s.showLoadingBar(), s.is_loading = !0, a.request({
            url: t.default.goods_list,
            data: o,
            success: function(t) {
                0 == t.code && (s.setData({
                    goods_list: t.data.list
                }), 0 == t.data.list.length ? s.setData({
                    is_search: !1
                }) : s.setData({
                    is_search: !0
                })), t.code;
            },
            complete: function() {
                s.hideLoadingBar(), s.is_loading = !1;
            }
        });
    },
    onListScrollBottom: function(t) {
        this.getMoreGoodsList();
    },
    getHistoryList: function(t) {
        t = t || !1;
        var a = wx.getStorageSync("search_history_list");
        if (!a) return [];
        if (!t) return a;
        for (var s = [], o = a.length - 1; o >= 0; o--) s.push(a[o]);
        return s;
    },
    setHistory: function(t) {
        var a = this.getHistoryList();
        a.push({
            keyword: t
        });
        for (var s in a) {
            if (a.length <= 20) break;
            a.splice(s, 1);
        }
        wx.setStorageSync("search_history_list", a);
    },
    getMoreGoodsList: function() {
        var s = this, o = {};
        s.data.cat_id && (o.cat_id = s.data.cat_id, s.setActiveCat(o.cat_id)), s.data.keyword && (o.keyword = s.data.keyword), 
        o.page = s.data.page || 1, s.showLoadingMoreBar(), s.setData({
            is_loading: !0
        }), s.setData({
            load_more_count: s.data.load_more_count + 1
        }), o.page = s.data.page + 1, s.setData({
            page: o.page
        }), a.request({
            url: t.default.goods_list,
            data: o,
            success: function(t) {
                if (0 == t.code) {
                    var a = s.data.goods_list;
                    if (t.data.list.length > 0) {
                        for (var i in t.data.list) a.push(t.data.list[i]);
                        s.setData({
                            goods_list: a
                        });
                    } else s.setData({
                        page: o.page - 1
                    });
                }
                t.code;
            },
            complete: function() {
                s.setData({
                    is_loading: !1
                }), s.hideLoadingMoreBar();
            }
        });
    },
    showLoadingBar: function() {
        this.setData({
            loading_class: "active"
        });
    },
    hideLoadingBar: function() {
        this.setData({
            loading_class: ""
        });
    },
    showLoadingMoreBar: function() {
        this.setData({
            loading_more_active: "active"
        });
    },
    hideLoadingMoreBar: function() {
        this.setData({
            loading_more_active: ""
        });
    },
    deleteSearchHistory: function() {
        this.setData({
            history_list: null
        }), wx.removeStorageSync("search_history_list");
    }
});