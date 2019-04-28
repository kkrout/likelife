/*
  *  系统：#{system}
  *  名称：#{menuName}
  *  路径：#{url}
  *  原型设计：#{yuanxing}
  *  开发人：#{dev}
  *  日期：2018/08/29
*/
/* 使用闭包，对变量作用域隔离*/
(function (app) {

    app.register({
        template: '#moduleName',
        data:function(){
            return {}
        },
        methods: {}
    });

})(App);