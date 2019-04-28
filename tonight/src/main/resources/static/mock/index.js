//模拟菜单数据
Mock.mock(/api\/user\/menuList/,new MockResult([
    {"id":"#1","menuId":"#1","name":"首页","url":"#home/home.html","iconCls":"iconfont icon-home","componentId":"admin-home"},
    {"id":"2","menuId":"2","name":"应用管理","url":"#app/app.html","iconCls":"iconfont icon-gaiicon-"},
    {"id":"3","menuId":"3","name":"API维护","url":"#api/api.html","iconCls":"iconfont icon-API"},
    {"id":"4","menuId":"4","name":"API单元测试","url":"#api_ut/api_ut.html","iconCls":"iconfont icon-ceshi"},
    {"id":"5","menuId":"5","name":"数据字典","url":"#data_dictionary/data_dictionary.html","iconCls":"iconfont icon-shujuguanli"},
    {"id":"6","menuId":"6","name":"用户管理","url":"#user/user.html","iconCls":"iconfont icon-biyan"},
    {"id":"7","menuId":"7","name":"角色&权限","url":"#role/role.html","iconCls":"iconfont icon-biyan"},
]));

//应用数据
(function(){

    var pager = new App.Pager()
    delete pager.list;
    pager["list|1-100"] = [
        {
            "id|1-1000000":0,
            "name":"消息服务",
            "desc":"这是应用描述。。。。",
            "person|1":[Mock.Random.cname(),Mock.Random.cname(),Mock.Random.cname(),Mock.Random.cname(),Mock.Random.cname(),Mock.Random.cname(),Mock.Random.cname(),Mock.Random.cname(),Mock.Random.cname()],
            "creator":"toga",
            "createTime":new Date(),
            "envList":[
                {
                    "profile":"dev",
                    "url":"http://localhost:7775"
                },
                {
                    "profile":"test",
                    "url":"http://localhost:7775"
                }
            ]
        }
    ];

    Mock.mock(/api\/app\/query/,new MockResult(pager))

})()

