//模拟菜单数据
Mock.mock(/api\/user\/menuList/, new MockResult([
    {
        "id": "#1",
        "menuId": "#1",
        "name": "首页",
        "url": "#home/home.html",
        "iconCls": "iconfont icon-home",
        "componentId": "admin-home"
    },
    {"id": "2", "menuId": "2",name:"演示","url": "#template/template.html", "iconCls": "iconfont icon-yanshi"}
]));

//应用数据
(function () {

    var pager = new App.Pager()
    delete pager.list;
    pager["list|1-100"] = [
        {
            "id|1-1000000": 0,
            "name": "消息服务",
            "desc": "这是应用描述。。。。",
            "person|1": [Mock.Random.cname(), Mock.Random.cname(), Mock.Random.cname(), Mock.Random.cname(), Mock.Random.cname(), Mock.Random.cname(), Mock.Random.cname(), Mock.Random.cname(), Mock.Random.cname()],
            "creator": "toga",
            "createTime": new Date(),
            "envList": [
                {
                    "profile": "dev",
                    "url": "http://localhost:7775"
                },
                {
                    "profile": "test",
                    "url": "http://localhost:7775"
                }
            ]
        }
    ];

    Mock.mock(/api\/app\/query/, new MockResult(pager))

})()

