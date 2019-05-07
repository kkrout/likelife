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

Vue.use(ELEMENT,{size:"small"})

App.start({
    el: '#app',
    data: function () {
        return {
            activeMenuId:"",
            menuWidth: "200px",
            componentId:"",
            cacheList:[],
            currentMenu:null,
            menuList: [],
            menuIndexMap:new Map(),
            menuCompIndexMap:new Map()
        }
    },
    mounted() {
        App.request("/api/system/menu/list").callSuccess( res =>{
            this.menuList = [new NavTag('#1', '首页', '#home/home.html','iconfont icon-home')].concat(res.data);
            this.createMenuIndex(this.menuList);
            this.$refs.tagNav.initNav();
        })
    },
    methods: {
        createMenuIndex(list){
            list.forEach(item => {
                this.menuIndexMap.set(item.menuId,item);
                if ( item.children && item.children.length ){
                    this.createMenuIndex(item.children)
                }else{
                    var compId = App.convertToComp(item.url)
                    //只有叶子节点才能拥有url，父节点不算
                    this.menuCompIndexMap.set(compId,item);
                }
            })
        },
        getMenuByComp(url){
            var compId = App.convertToComp(url);
            return this.menuCompIndexMap.get(compId);
        },
        getMenuById(menuId){
            return this.menuIndexMap.get(menuId);
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