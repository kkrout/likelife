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
            activeMenuId:"",
            menuWidth: "200px",
            componentId:"",
            cacheList:[],
            currentMenu:null,
            menuList: [
                {
                    "menuId": "#1",
                    "name": "首页",
                    "url": "#home/home.html",
                    "iconCls": "iconfont icon-home",
                    "componentId": "admin-home"
                },
                {
                    "menuId": "3",
                    "name": "多级菜单",
                    "iconCls": "iconfont icon-yanshi",
                    "children": [{
                            "menuId": "3-1",
                            "name": "二级菜单1",
                            "iconCls": "iconfont icon-yanshi",
                            "children":[
                                {
                                    "menuId": "3-1-1",
                                    "name": "演示",
                                    "url": "#template/template.html",
                                    "iconCls": "iconfont icon-yanshi"
                                }
                            ]
                        }]
                }
            ]
        }
    },
    mounted() {

    },
    methods: {
        getMenuByComp(compId,menuList){
            var list = menuList || this.menuList;
            var compId2 = App.convertToComp(compId);
            for(var i=0,item;item=list[i++];){

                var compId1 = App.convertToComp(item.url);
                if ( compId1 == compId2){
                    return item;
                }
                var find = item.children && item.children.length && this.getMenuByComp(compId,item.children);
                if ( find ){
                    return find;
                }
            }
        },
        getMenuById(menuId,menuList){
            var list = menuList || this.menuList;
            for(var i=0,item;item=list[i++];){
                var menuId_ = item.menuId;
                if ( menuId_ == menuId){
                    return item;
                }
                var find = item.children && item.children.length && this.getMenuById(menuId,item.children);
                if ( find ){
                    return find;
                }
            }
        },
        menuSelect(v){
            var menu = this.getMenuById(v)
            if ( v ){
                this.$refs.tagNav.openTag(menu);
                this.currentMenu = menu;
            }
        },
        switchComp(tag){
            this.componentId = tag.id;
            this.activeMenuId = tag.menuId;
            this.currentMenu = tag;
        },
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