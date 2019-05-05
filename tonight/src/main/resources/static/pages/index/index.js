/**
 * 系统架构
 * @author zhdong
 * @date 2018/8/26
 */
/*********全局混入*********/
Vue.mixin({
    created() {
        this.$getPath = function (url) {
            return App.getPath(url);
        }
    }
});

App.start({
    el: '#app',
    data: function () {
        return {
            menuWidth: "200px",
            menuList: [
                {
                    "menuId": "#1",
                    "name": "首页",
                    "url": "#home/home.html",
                    "iconCls": "iconfont icon-home",
                    "componentId": "admin-home"
                },
                {
                    "menuId": "2",
                    "name": "演示",
                    "url": "#template/template.html",
                    "iconCls": "iconfont icon-yanshi"
                },
                {
                    "menuId": "3",
                    "name": "多级菜单",
                    "url": "#template/template.html",
                    "iconCls": "iconfont icon-yanshi",
                    "children": [{
                            "menuId": "3-1",
                            "name": "二级菜单1",
                            "url": "#template/template.html",
                            "iconCls": "iconfont icon-yanshi"
                        }]
                }
            ]
        }
    },
    mounted() {

    },
    methods: {
        closeMenu(b) {
            if (b) {
                this.menuWidth = "60px";
            } else {
                this.menuWidth = "200px";
            }
        }
    },
    watch: {}
})