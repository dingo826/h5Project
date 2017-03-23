define(function (require, exports, module) {
    'use strict';
    var localDB = new (require('localDB'));

    $(function(){
        //日期
        Date.prototype.format = function(fmt) {
            var o = {
                "Y+": this.getFullYear(), //年
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    });
    (function isLogin(){
       /* var personInfo = localDB.get('personInfo');
        if(personInfo == null){
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2039ed060d264454&redirect_uri=http%3A%2F%2Fblackdragon.tunnel.qydev.com%2Fwechat%2FgetOpenId&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect&url='
        }*/
    })();
    var domain = 'http://172.16.20.103:7080';
    //方法加载中的等待图像
    function loading() {
        var dialog = '<div class="loading-page">' +
            '<div class="loading-img">' +
            '<div class="spinner">' +
            '<div class="rect1"></div>' +
            '<div class="rect2"></div>' +
            '<div class="rect3"></div>' +
            '<div class="rect4"></div>' +
            '<div class="rect5"></div>' +
            '</div>' +
            '</div>' +
            '</div>'
        var loading = $(dialog);
        loading.appendTo('body');
        return loading;
    }
    exports.loading = loading;
    //获得页面传来的参数如？id=123之类的
    exports.getParameter = function(pName) {
        var url = window.location.href,
            start = url.indexOf("?") + 1,
            paras = {};
        if (start !== 0) {
            var queryString = url.substring(start),
                paraNames = queryString.split("&"),
                arr = [],
                i = 0;
            for (; i < paraNames.length; i++) {
                arr = paraNames[i].split("=");
                if (i === paraNames.length - 1) {
                    var sIndex = arr[1].indexOf("#");
                    if (sIndex !== -1) {
                        arr[1] = arr[1].substring(0, sIndex);
                    }
                }
                paras[arr[0]] = arr[1]
            }
        }
        return decodeURIComponent(paras[pName] || "");
    }

    //提示信息
    var hint = function (info, middle, func) {
        var hint = $('.system-hint-area');
        if (!hint.length) {
            hint = $('<div class="system-hint-area"></div>').appendTo('body');
        }
        var op = $('<p></p>').html(info).hide(); //.appendTo(hint).after('<br/>');
        hint.html(op);
        op.fadeIn();

        //如果传入middle，就让hint显示在屏幕上方1/3出
        //不传入middle或传入的middle是其它值，就让hint显示在屏幕下方
        if (middle == 'middle') {
            hint.css({
                'margin-left': 0 - (op.outerWidth() / 2),
                'position': 'absolute',
                'top': ($(window).height() * 1 / 3)
            })
        } else {
            op.css({
                'margin-left': 0 - (op.outerWidth() / 2)
            })
        }

        setTimeout(function () {
            if (!op.siblings('p').length) {
                op.parent().remove();
            } else {
                op.remove();
            }
            if (func) {
                func();
            }
        }, 2000);
    }
    exports.hint = hint;
    //统一的ajax请求
    var ajax = function (json) {

        var url = domain + json.url,
            type = json.type,
            data = json.data,
            unpack = json.unpack,
            isLoading = json.isLoading,
            timeout = json.timeout,
            loadingAction;
        if (isLoading === true) {
            loadingAction = loading();
        }
        
        return $.ajax({
            type: type,
            data: data,
            dataType: 'jsonp',
            cache: (json.cache == "false" ? json.cache : "true"),  //原理 在后面加时间戳
            async: (json.async == "false" ? json.async : "true"),
            timeout: timeout ||　30000,
            url: url,
            success: function (res) {                
                if (isLoading === true) {
                    loadingAction.remove();
                }
                try {
                    if (typeof res != 'object') {
                        res = $.parseJSON(res);
                       
                    }
                    if (res.status == 'SUCCESS') {
                        try {
                            //console.log(res.resultObject)
                            if ($.type(res.resultObject) === 'string' && res.resultObject.length) {

                               // res.resultObject = $.parseJSON(res.resultObject);
                            }
                            if (unpack) {
                                json.done = (json.done == undefined) ? json.suc : json.done;
                                json.done(res);
                            } else {
                                json.done = (json.done == undefined) ? json.suc : json.done;
                                json.done(res);
                            }
                        } catch (e) {
                            console.log(e.name + ": " + e.message);
                        }

                    } else {
                        
                    }
                } catch (e) {
                    json.err && json.err();
                    hint(e.name + ": " + e.message);
                }
            },
            error: function (e, errormsg, msg) {

                console.log(errormsg)
                if (isLoading === true) {
                    loadingAction.remove();
                }
                json.err && json.err();
                var errorJson = {
                        'error': '网络错误！',
                        'timeout': '连接超时'
                    },
                    errorMsg = errorJson[errormsg] || '未知错误';
                hint(errorMsg);
            }
        })
    }
    exports.ajax = ajax;

    exports.listAjax = function(opts){
        var options = {},
            param = {
                size: 10,
                page: 0
            }
        $.extend(options, opts);
        $.extend(options.param, param);
        var targetPage = options.param.page || 0;

        _fnLoad();
        function _fnLoad(page){
            options.param.page = page;
            _ajax().then(function(res){
                console.log(res)
                options.callback(res);
            });
        }

            //是否最低端，或者加载更多显示
            //判断是tab类型，还是window类型
            //
        var $obj = $('.js-panel')
        $obj.on('scroll', function(){
            console.log(1)
            var scrollTop = $obj.scrollTop();
            var scrollHeight = $("#wrapper").height();
            var windowHeight = $obj.height();
            if (scrollHeight - scrollTop - windowHeight < 50) {
                _fnLoad(++targetPage);
            }
        });
        function _ajax(){
            return new Promise(function (resolve, reject) {
                ajax({
                    url: options.url,
                    data: options.param,
                    type: 'post',
                    suc: function (res) {
                        resolve(res);  
                    }
                });
            });
            
        }


    }
});
