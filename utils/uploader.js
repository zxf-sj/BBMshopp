module.exports = {
    upload: function(e) {
        function o(o) {
            "function" == typeof e.start && e.start(o), console.log("submit args:", e), wx.uploadFile({
                url: e.url || t.api.default.upload_image,
                filePath: o.path,
                name: e.name || "image",
                formData: e.data || {},
                success: function(o) {
                    console.log("--uploadFile--"), console.log(o), 200 == o.statusCode ? "function" == typeof e.success && (o.data = JSON.parse(o.data), 
                    e.success(o.data)) : "function" == typeof e.error && e.error("上传错误：" + o.statusCode + "；" + o.data), 
                    e.complete();
                },
                fail: function(o) {
                    "function" == typeof e.error && e.error(o.errMsg), e.complete();
                }
            });
        }
        console.log("user args:", e);
        var t = getApp();
        (e = e || {}).complete = e.complete || function() {}, e.data = e.data || {}, e.data._uniacid = e.data._uniacid || t.siteInfo.uniacid, 
        e.data._acid = e.data._acid || t.siteInfo.acid, wx.chooseImage({
            count: 1,
            success: function(t) {
                if (console.log("--chooseImage--"), console.log(t), t.tempFiles && t.tempFiles.length > 0) {
                    var a = t.tempFiles[0];
                    o(a);
                } else "function" == typeof e.error && e.error("请选择文件"), e.complete();
            },
            fail: function(o) {
                "function" == typeof e.error && (e.error("请选择文件"), e.complete());
            }
        });
    }
};