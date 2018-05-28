module.exports = {
    currentPage: null,
    onLoad: function(e) {
        console.log("--------pageOnLoad----------"), this.currentPage = e;
        t = this;
        if (e.options) {
            var a = 0;
            if (e.options.user_id) a = e.options.user_id; else if (e.options.scene) if (isNaN(e.options.scene)) {
                var o = decodeURIComponent(e.options.scene);
                o && (o = getApp().utils.scene_decode(o)) && o.uid && (a = o.uid);
            } else a = e.options.scene;
            a && wx.setStorageSync("parent_id", a);
        }
        if (void 0 === e.openWxapp && (e.openWxapp = getApp().openWxapp), void 0 === e.showToast && (e.showToast = function(e) {
            t.showToast(e);
        }), void 0 === e._formIdFormSubmit) {
            var t = this;
            e._formIdFormSubmit = function(e) {
                t.formIdFormSubmit(e);
            };
        }
        getApp().setNavigationBarColor(), this.setPageNavbar(e), e.naveClick = function(a) {
            getApp().navigatorClick(a, e);
        }, getApp().order_pay.init(e, getApp()), this.setDeviceInfo(), this.setPageClasses();
    },
    onReady: function(e) {
        console.log("--------pageOnReady----------"), this.currentPage = e;
    },
    onShow: function(e) {
        console.log("--------pageOnShow----------"), this.currentPage = e;
    },
    onHide: function(e) {
        console.log("--------pageOnHide----------"), this.currentPage = e;
    },
    onUnload: function(e) {
        console.log("--------pageOnUnload----------"), this.currentPage = e;
    },
    showToast: function(e) {
        console.log("--- showToast ---");
        var a = this.currentPage, o = e.duration || 2500, t = e.title || "", n = (e.success, 
        e.fail, e.complete || null);
        a._toast_timer && clearTimeout(a._toast_timer), a.setData({
            _toast: {
                title: t
            }
        }), a._toast_timer = setTimeout(function() {
            var e = a.data._toast;
            e.hide = !0, a.setData({
                _toast: e
            }), "function" == typeof n && n();
        }, o);
    },
    formIdFormSubmit: function(e) {
        console.log("--- formIdFormSubmit ---", e);
    },
    setDeviceInfo: function() {
        var e = this.currentPage, a = [ {
            id: "device_iphone_5",
            model: "iPhone 5"
        }, {
            id: "device_iphone_x",
            model: "iPhone X"
        } ], o = wx.getSystemInfoSync();
        if (o.model) {
            o.model.indexOf("iPhone X") >= 0 && (o.model = "iPhone X");
            for (var t in a) a[t].model == o.model && e.setData({
                __device: a[t].id
            });
        }
    },
    setPageNavbar: function(e) {
        function a(a) {
            var o = !1, t = e.route || e.__route__ || null;
            for (var n in a.navs) a.navs[n].url === "/" + t ? (a.navs[n].active = !0, o = !0) : a.navs[n].active = !1;
            o && e.setData({
                _navbar: a
            });
        }
        console.log("----setPageNavbar----"), console.log(e);
        var o = wx.getStorageSync("_navbar");
        o && a(o);
        var t = !1;
        for (var n in this.navbarPages) if (e.route == this.navbarPages[n]) {
            t = !0;
            break;
        }
        t ? getApp().request({
            url: getApp().api.default.navbar,
            success: function(e) {
                0 == e.code && (a(e.data), wx.setStorageSync("_navbar", e.data));
            }
        }) : console.log("----setPageNavbar Return----");
    },
    navbarPages: [ "pages/index/index", "pages/cat/cat", "pages/cart/cart", "pages/user/user", "pages/list/list", "pages/search/search", "pages/topic-list/topic-list", "pages/video/video-list", "pages/miaosha/miaosha", "pages/shop/shop", "pages/pt/index/index", "pages/book/index/index", "pages/share/index", "pages/quick-purchase/index/index" ],
    setPageClasses: function() {
        var e = this.currentPage, a = e.data.__device;
        e.data._navbar && e.data._navbar.navs && e.data._navbar.navs.length > 0 && (a += " show_navbar"), 
        e.setData({
            __page_classes: a
        });
    }
};