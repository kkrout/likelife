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
        this.$getCurrentTag = function(){
            return App.MainVueApp.$refs.tagNav.getCurrentTag();
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
            menuList: []
        }
    },
    mounted() {
        App.request("/api/system/menu/list").callSuccess( res =>{
            this.menuList = [new NavTag('#1', '首页', '#home/home.html','iconfont icon-home')].concat(res.data);
            this.$refs.tagNav.initNav();
        })
    },
    methods: {
        getMenuByComp(compId,menuList){
            var list = menuList || this.menuList;
            var compId2 = App.convertToComp(compId);
            for(var i=0,item;item=list[i++];){

                var compId1 = App.convertToComp(item.url);
                if ( compId1 == compId2 && (!item.children || !item.children.length)){
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
        openFromCurrentMenu(name,url,data){
            var menu = $.extend({},this.currentMenu)
            menu.name = name;
            menu.url = url;
            menu.diy = null;
            menu.template = "";
            menu.script = "";
            menu.data = data;

            this.$refs.tagNav.openTag(menu);
        },
        switchComp(tag){
            console.log(tag)
            this.componentId = tag.id;
            this.activeMenuId = tag.menuId;
            this.currentMenu = this.getMenuById(tag.menuId);
        },
        closeMenu(b) {
            if (b) {
                this.menuWidth = "64px";
            } else {
                this.menuWidth = "200px";
            }
        }
    },
    watch: {}
})