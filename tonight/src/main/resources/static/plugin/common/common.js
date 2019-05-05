/**
 * App应用对象
 * @author zhdong
 * @date 2018/8/26
 */
var App = (function ($) {

    const localPrefix = "LOCAL_DATA_";
    //声明app
    var app = {
        MainVueApp: null,
        currentLoading: null,
        currentMoule:null
    };

    app.start = function(vue){
        app.MainVueApp = new Vue(vue);
    }

    var localData = {};

    /*************** 设置本地缓存 ****************/
    app.putData = function(key,data,cache){

        data = data || '';
        var menuFlag = this.MainVueApp.activeMenuId.split("@")[0];
        localData[menuFlag+key] = data;
        //如果无需本地缓存
        if ( cache === false ) return data;
        try{
            window.localStorage.setItem(localPrefix+menuFlag+key,JSON.stringify(data));
        }catch (e) { console.log("存储异常："+e) }
    }
    app.getData = function(key,cache){
        var menuFlag = this.MainVueApp.activeMenuId.split("@")[0];
        var data = localData[menuFlag+key];
        //如果无需本地缓存
        if ( cache === false ) return data;

        if ( !data ){
            try {
                data = window.localStorage.getItem(localPrefix + menuFlag + key);
                if (data != null && data != undefined) {
                    return JSON.parse(data);
                }
            }catch (e) { console.log("存储异常："+e) }
        }
        return data;
    }
    /*************** 设置本地缓存 ****************/

    app.removeData = function(key){
        var menuFlag = this.MainVueApp.activeMenuId.split("@")[0];
        delete localData[menuFlag+key];
        window.localStorage.removeItem(localPrefix + menuFlag + key);
    }

    /* 关闭当前页面 */
    app.closeCurrentTagNav = function(){
        this.MainVueApp.closeCurrentTagNav();
    };

    app.isEmpty = function(obj){
        return obj == null || obj == undefined || obj === "";
    }

    /* 分页对象 PageInfo返回封装对象*/
    app.Pager = function (p) {
        p = p || {};
        //判断是什么page类型
        if ( p.content ){
            //mongo类型
            this.list = p.content || [];
            //mongo分页有问题，不设置分页
            // this.pageNum = p.number !== undefined ? p.number + 1 : 1;
            this.pageSize = p.size || 10;
            this.pages = p.totalPages || 1;
            this.total = p.totalElements || 0;
        }else{
            this.list = p.list || [];
            this.pageNum = p.pageNum || 1;
            this.pageSize = p.pageSize || 10;
            this.pages = p.pages || 1;
            this.total = p.total || 0;
        }

    }

    /* 分页对象 PageImpl返回封装对象*/
    app.Page = function (p) {
        p = p || {};
        this.list = p.content || [];
        this.pageNum = p.pageNum || 1;
        this.pageSize = p.size || 15;
        this.pages = p.totalPages || 1;
        this.total = p.totalElements || 0;
    }


    /* 获取oss访问地址 */
    app.getOssAccessUrl = function (buck, key) {
        return "http://" + buck + "." + OSSAccessDomain + "/" + key;
    }

    app.getPath = function(url){
        url = contextPath + url;
        if (url.substring(0, 2) == "//") {
            url = url.substring(1);
        }
        return url;
    }

    app.requestCache = new Map();

    app.convertToComp = function(url){
        if ( !url || url.indexOf('.') == -1 ) return "";
        if ( url.indexOf('#') == 0 ){
            url = url.substring(1);
        }

        // if ( url.indexOf('?') != -1 ){
        //    url = url.substring(0,url.indexOf('?'));
        // }\
        let url1 = url.substring(0,url.indexOf('.'));
        let url2 = url.substring(url.indexOf('.')+5);
        url =url1+url2;
        url = url.replace(/\//gi,'-')
        return url;
    },

        app.mouleTemplate = {};
    app.mouleTemplateCallback = {};
    app.moule =function(compent){
        var compId = this.convertToComp(window.location.hash);
        compent.template = this.mouleTemplate[compId];
        var m = Vue.component(compId, compent);
        this.mouleTemplateCallback[compId] && this.mouleTemplateCallback[compId](compId);
        delete this.mouleTemplate[compId];
        delete this.mouleTemplateCallback[compId];
    }

    //设置主App应用
    app.setMainApp = function (vue) {
        this.MainVueApp = vue;
    }

    //显示loadding蒙层
    app.showLoadding = function (message, timeout, ajax) {
        try {
            this.currentLoading && this.currentLoading();
            this.currentLoading = this.MainVueApp.$Message.loading({
                content: message || '加载中...',
                duration: timeout || 60,
                closable: ajax ? true : false,
                onClose: function () {
                    //结束请求
                    ajax && ajax.abort && ajax.abort();
                }
            })
        } catch (e) {
            console.log('显示loading错误' + e)
        }
    }
    //隐藏蒙层
    app.hideLoading = function () {
        try {
            this.currentLoading && this.currentLoading();
        } catch (e) {
            console.log('隐藏loading错误' + e)
        }
    }

    //弹出提示toast
    app.info = function (msg, timeout, closable) {
        this.MainVueApp.$message({
            type:"info",
            message: msg,
            duration: timeout*1000  || 3000,
            showClose: closable || true
        });
    }

    //弹出成功toast
    app.success = function (msg, timeout, closable) {
        this.MainVueApp.$message({
            type:"success",
            message: msg,
            duration: timeout*1000 || 3000,
            showClose: closable || true
        });
    }

    //弹出警告toast
    app.warning = function (msg, timeout, closable) {
        this.MainVueApp.$message({
            type:"warning",
            message: msg,
            duration: timeout*1000 || 3000,
            showClose: closable || true
        });
    }

    //弹出错误toast
    app.error = function (msg, timeout, closable) {
        this.MainVueApp.$message({
            type:"error",
            message: msg,
            duration: timeout*1000 || 3000,
            showClose: closable || true
        });
    }

    //debug
    app.debug = function (e) {
        if (DEBUGGER) {
            console.log(e);
        }
    }

    app.confirm = function(title,then,cancel){
        this.MainVueApp.$confirm(title || '确认提示', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(then).catch(cancel);
    }

    var convertParam = function(data){
        for (var r in data){
            var d = data[r];
            //将集合转换为正确的数组格式
            if ( d && $.isArray(d) && d.length ){
                d.forEach((item,i)=>{
                    data[r+"["+i+"]"] = item;
                });
                delete data[r];
            }
        }
        return data;
    };

    app.ajax = function (options, data) {


        //默认ajax请求
        let defOpt = {
            type: null,
            dataType: "json",
            showLoad: true,
            cached: false,
            modal: null,
            button: null,
            loadArea:null,
            post: function () {
                this.type = "post";
                $.ajax(finalOpt);
            },
            get: function () {
                this.type = "get";
                $.ajax(finalOpt);
            },
            setUrl: function (url) {
                this.url = contextPath + url;
                if (this.url.substring(0, 2) === "//") {
                    this.url = this.url.substring(1);
                }
                return this;
            },
            setModal: function (modal) {
                this.modal = modal;
                return this;
            },
            setDataType: function (dataType) {
                this.dataType = dataType;
                return this;
            },
            setLoadArea(area) {
                this.loadArea = area;
                return this;
            },
            setButton(btn) {
                this.button = btn;
                return this;
            },
            useCache: function () {
                this.cached = true;
                return this;
            },
            synced: function () {
                this.async = false;
                return this;
            },
            setData: function (d) {
                this.contentType = 'application/json;charset=utf-8';
                this.data = JSON.stringify(d);
                return this;
            },
            hideLoad: function () {
                this.showLoad = false;
                return this;
            },
            beforeSend: function (xhr) {
                if (this.button && typeof this.button === 'object') {
                    this.button.loading = true;
                }else if ( this.loadArea ){
                    this.loadArea.$set(this.loadArea,'loading',true)
                }else {
                    const app_ = this.modal || app;
                    this.showLoad && app_.showLoadding(null, null, xhr);
                }
                this.beforeCallback && this.beforeCallback.call(this,xhr);
                var token = window.localStorage.getItem('Header-M-Auth-Token');
                xhr.setRequestHeader('M-Auth-Token',token);
            },
            complete: function () {
                if (this.button && typeof this.button === 'object') {
                    this.button.loading = false;
                }else if( this.loadArea ){
                    this.loadArea.$set(this.loadArea,'loading',false)
                }else {
                    const app_ = this.modal || app;
                    this.showLoad && app_.hideLoading();
                }
                this.completeCallback && this.completeCallback();
            },
            success: function (res) {
                if (this.successCallback2) {
                    return this.successCallback2(res);
                }
                if (res.success) {
                    //如果激活了缓存，则保存缓存
                    if ((!this.type || this.type.toLowerCase() === 'get') && this.cached) {
                        app.requestCache.set(this.url,$.extend(true,{},res))
                    }
                    this.successCallback && this.successCallback(res);
                } else {
                    if (this.errorCallback2) {
                        return this.errorCallback2(res);
                    }
                    res.message && app.error(res.message);
                    this.errorCallback && this.errorCallback(res);
                }
            },
            error: function (xhr) {
                if (this.errorCallback2) {
                    return this.errorCallback2(xhr.responseJSON, xhr);
                }
                const dataJson = xhr.responseJSON || JSON.parse(xhr.responseText);
                if (xhr.status === 401) {
                    if (dataJson && dataJson.code === 10060) {
                        app.error('登录超时，请重新登录!');
                        app.MainVueApp.callLogin(this);
                        return;
                    }
                } else if (xhr.status === 403) {
                    app.error('您没有浏览该页面的权限');
                } else if (xhr.status === 404) {
                    app.error('您访问的页面不存在');
                } else if (xhr.status === 500) {
                    if (dataJson.message) {
                        app.error(dataJson.message);
                    } else {
                        app.error('页面内部错误，请联系管理员');
                    }
                } else if (xhr.status === 405) {
                    app.error('请求方法错误');
                } else {
                    app.error('无法访问服务器，请检查网络');
                }
                this.errorCallback && this.errorCallback(xhr.responseJSON, xhr);
            },
            callBefore: function (callback) {
                this.beforeCallback = callback;
                return this;
            },
            callComplete: function (callback) {
                this.completeCallback = callback;
                return this;
            },
            callError: function (callback) {
                this.errorCallback = callback;
                return this;
            },
            callSuccess: function (callback) {
                this.successCallback = callback;
                return this;
            },
            handError: function (callback) {
                this.errorCallback2 = callback;
                return this;
            },
            handSuccess: function (callback) {
                this.successCallback2 = callback;
                return this;
            }
        };

        let finalOpt;
        //第一个参数是string，直接引用默认属性，否则为对象类型，直接复制对象
        if (typeof options === 'string') {
            finalOpt = defOpt.setUrl(options);
            finalOpt.data = convertParam(data);
        } else {
            finalOpt = $.extend(defOpt, options);
            finalOpt.url = contextPath + finalOpt.url;
            //设置参数
            if (data) {
                //处理数据
                finalOpt.data = convertParam(data);
            }
            if (finalOpt.url.substring(0, 2) === "//") {
                finalOpt.url = finalOpt.url.substring(1);
            }
        }

        //判断是否从缓存中获取
        if (finalOpt.cached) {
            const ps = finalOpt.data ? $.param(finalOpt.data) : "";
            const key = finalOpt.url.indexOf('?') === -1 && ps ? finalOpt.url + "?" + ps :finalOpt.url + ps;
            const exitsCache = app.requestCache.get(key);
            if (exitsCache) {
                finalOpt.successCallback && finalOpt.successCallback($.extend(true,{},exitsCache));
                return;
            }
        }
        return finalOpt;
    };

    /** 此方法经测试有同步的问题,建议使用app.ajax方法 */
    app.request = function (options, data) {

        //默认ajax请求
        var defOpt = {
            type: "get",
            dataType: "json",
            showLoad: true,
            cached: false,
            modal: null,
            button: null,
            loadArea:null,
            setUrl: function (url) {
                this.url = contextPath + url;
                if (this.url.substring(0, 2) == "//") {
                    this.url = this.url.substring(1);
                }
                return this;
            },
            setModal: function (modal) {
                this.modal = modal;
                return this;
            },
            setType: function (type) {
                this.type = type;
                return this;
            },
            setLoadArea(area) {
                this.loadArea = area;
                return this;
            },
            setButton(btn) {
                this.button = btn;
                return this;
            },
            post: function () {
                this.type = "post";
                return this;
            },
            useCache: function () {
                this.cached = true;
                return this;
            },
            synced: function () {
                this.async = false;
                return this;
            },
            setData: function (d) {
                this.contentType = 'application/json;charset=utf-8';
                this.data = JSON.stringify(d);
                return this;
            },
            hideLoad: function () {
                this.showLoad = false;
                return this;
            },
            beforeSend: function (xhr) {
                if (this.button && typeof this.button === 'object') {
                    this.button.loading = true;
                }else if ( this.loadArea ){
                    this.loadArea.$set(this.loadArea,'loading',true)
                }else {
                    var app_ = this.modal || app;
                    this.showLoad && app_.showLoadding(null, null, xhr);
                }
                this.beforeCallback && this.beforeCallback.call(this,xhr);
                var token = window.localStorage.getItem('Header-M-Auth-Token');
                xhr.setRequestHeader('M-Auth-Token',token);
            },
            complete: function () {
                if (this.button && typeof this.button === 'object') {
                    this.button.loading = false;
                }else if( this.loadArea ){
                    this.loadArea.$set(this.loadArea,'loading',false)
                }else {
                    var app_ = this.modal || app;
                    this.showLoad && app_.hideLoading();
                }
                this.completeCallback && this.completeCallback();
            },
            success: function (res) {
                if (this.successCallback2) {
                    return this.successCallback2(res);
                }
                if (res.success) {
                    //如果激活了缓存，则保存缓存
                    if ((!this.type || this.type.toLowerCase() == 'get') && this.cached) {
                        app.requestCache.set(this.url,$.extend(true,{},res))
                    }
                    this.successCallback && this.successCallback(res);
                } else {
                    if (this.errorCallback2) {
                        return this.errorCallback2(res);
                    }
                    res.message && app.error(res.message);
                    this.errorCallback && this.errorCallback(res);
                }
            },
            error: function (xhr) {

                if (xhr.status == 401) {
                    var dataJson = xhr.responseJSON || JSON.parse(xhr.responseText);
                    if (dataJson && dataJson.code == 10060) {
                        app.error('登录超时，请重新登录!');
                        app.MainVueApp.callLogin(this);
                        return;
                    }
                }

                if (this.errorCallback2) {
                    return this.errorCallback2(xhr.responseJSON, xhr);
                }
                if (xhr.status == 403) {
                    app.error('您没有浏览该页面的权限');
                }
                else if (xhr.status == 404) {
                    app.error('您访问的页面不存在');
                }
                else if (xhr.status == 500) {
                    var dataJson = xhr.responseJSON || JSON.parse(xhr.responseText);
                    if (dataJson.message) {
                        app.error(dataJson.message);
                    } else {
                        app.error('页面内部错误，请联系管理员');
                    }
                }
                else if (xhr.status == 405) {
                    app.error('请求方法错误');
                }else{
                    app.error('无法访问服务器，请检查网络');
                }
                this.errorCallback && this.errorCallback(xhr.responseJSON, xhr);
            },
            callBefore: function (callback) {
                this.beforeCallback = callback;
                return this;
            },
            callComplete: function (callback) {
                this.completeCallback = callback;
                return this;
            },
            callError: function (callback) {
                this.errorCallback = callback
                return this;
            },
            callSuccess: function (callback) {
                this.successCallback = callback
                return this;
            },
            handError: function (callback) {
                this.errorCallback2 = callback
                return this;
            },
            handSuccess: function (callback) {
                this.successCallback2 = callback
                return this;
            }
        }
        var finalOpt;
        //第一个参数是string，直接引用默认属性，否则为对象类型，直接复制对象
        if (typeof options === 'string') {
            finalOpt = defOpt.setUrl(options);
            finalOpt.data = convertParam(data);
        } else {
            finalOpt = $.extend(defOpt, options)
            finalOpt.url = contextPath + finalOpt.url;
            //设置参数
            if (data) {
                //处理数据
                finalOpt.data = convertParam(data);
            }
            if (finalOpt.url.substring(0, 2) == "//") {
                finalOpt.url = finalOpt.url.substring(1);
            }
        }
        //延时调用，方便调用对象方法追加属性
        setTimeout(function () {
            //判断是否从缓存中获取
            if (finalOpt.cached) {
                var ps = finalOpt.data ? $.param(finalOpt.data) : "";
                var key = finalOpt.url.indexOf('?') == -1 && ps ? finalOpt.url + "?" + ps :finalOpt.url + ps;
                var exitsCache = app.requestCache.get(key);
                if (exitsCache) {
                    finalOpt.successCallback && finalOpt.successCallback($.extend(true,{},exitsCache));
                    return;
                }
            }
            $.ajax(finalOpt)
        }, 100);

        return finalOpt;
    }

    var convertParam = function(data){
        for (var r in data){
            var d = data[r];
            //将集合转换为正确的数组格式
            if ( d && $.isArray(d) && d.length ){
                d.forEach((item,i)=>{
                    data[r+"["+i+"]"] = item;
                });
                delete data[r];
            }
        }
        return data;
    }

    app.post = function(options, data){
        return app.request(options, data).post();
    }

    /**
     *
     * @param subMenuFlag 子模块标识 ,直接写html的名称吧
     * @param url 模块url
     * @param name 模块名称
     */
    app.openModule = function (moudelFlag, name, url) {
        var mainApp = this.MainVueApp;
        var activityId = mainApp.activeMenuId;
        //最原始的menuId
        var menuId = activityId.split('@')[0];
        var tabNav = new NavObject(menuId + "@" + moudelFlag, "#" + url, name);
        mainApp.addSubPageTag(tabNav);
    }

    /**
     *该模块是否已打开
     * @param subMenuFlag 子模块标识
     * @param url 模块url
     * @param name 模块名称
     */
    app.isExistModule  = function (moudelFlag, name, url) {
        var mainApp = this.MainVueApp;
        var tabNav = new NavObject(mainApp.activeMenuId + "@" + moudelFlag, "#" + url, name);
        return mainApp.isSubPageTag(tabNav);
    }

    app.openResource = function(url){
        window.location.hash = url;
    }

    // 跳转到相关页面并刷新页面
    app.openReloadModel = function (url){
        window.location.hash = url;
        window.location.reload()
    }

    return app;
})(jQuery)

//导航对象
function NavObject(menuId, url, name, iconCls) {
    this.menuId = menuId;
    this.name = name;
    this.url = url;
    this.iconCls = iconCls;
}

function JS_UUID() {
    var uuid = new Date().getTime();
    var rdn = Math.floor(Math.random() * 1000000);
    return uuid.toString(36) + "-" + rdn.toString(36);
}

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

//原生的日期转换函数有问题，这里需要重写
Date.prototype.toJSON = function(){
    return this.format("yyyy-MM-dd hh:mm:ss")
}
//这个也重写算了
Date.prototype.toString = function(){
    return this.format("yyyy-MM-dd hh:mm:ss")
}
