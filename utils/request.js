module.exports = function(e) {
    e.data || (e.data = {});
    var t = wx.getStorageSync("access_token");
    t && (e.data.access_token = t), e.data._uniacid = this.siteInfo.uniacid, e.data._acid = this.siteInfo.acid, 
    wx.request({
        url: e.url,
        header: e.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: e.data || {},
        method: e.method || "GET",
        dataType: e.dataType || "json",
        success: function(t) {
            -1 == t.data.code ? getApp().login() : e.success && e.success(t.data);
        },
        fail: function(t) {
            console.warn("--- request fail >>>"), console.warn(t), console.warn("<<< request fail ---");
            var a = getApp();
            a.is_on_launch ? (a.is_on_launch = !1, wx.showModal({
                title: "网络请求出错",
                content: t.errMsg,
                showCancel: !1,
                success: function(t) {
                    t.confirm && e.fail && e.fail(t);
                }
            })) : (wx.showToast({
                title: t.errMsg,
                image: "/images/icon-warning.png"
            }), e.fail && e.fail(t));
        },
        complete: function(t) {
            200 != t.statusCode && (console.log("--- request http error >>>"), console.log(t.statusCode), 
            console.log(t.data), console.log("<<< request http error ---")), e.complete && e.complete(t);
        }
    });
};