function NavTag(menu) {
    if (arguments.length == 3) {
        this.menuId = arguments[0] || "";
        this.name = arguments[1] || "";
        this.url = arguments[2] || "";
        this.iconCls = arguments[3] || "";
    } else {
        this.menuId = menu.menuId || "";
        this.name = menu.name || "";
        this.url = menu.url || "";
        this.iconCls = menu.iconCls || "";
    }
    this.id = App.convertToComp(this.url)
}


Vue.component('d-tag-nav', {
    template: `
        <div class="tag-nav-wrapper">
            <div class="tag-nav-body">
               <div :class="{'tag-nav':true,'tag-nav-active': item == currentTag }" @mouseover="hoverTag=item" @mouseout="hoverTag=null"
                    v-for="item in tagList" @click="onTagClick(item)">
                    <i :class="item.iconCls" v-if="item.iconCls" ></i>
                    <span v-text="item.name" ></span>
                    <div class="tag-nav-bar" v-if="item == currentTag" ></div>
                    <i v-show="hoverTag == item && item.menuId != '#1' " class="el-icon-close" style="position: absolute;top:5px;right:2px;font-size: 12px;"></i>
               </div>   
            </div>
        </div>
    `,
    props: {
        capacity: {
            type: Number,
            default: 9
        },
        value: {
            type: String,
            default: "#1"
        }
    },
    created() {
        //初始化
        this.tagList.push(this.homeNav);
        this.allTagsMap.set(this.homeNav.id, this.homeNav);
    },
    mounted() {
        //监控hash
        this.initNav();
    },
    data() {
        return {
            allTagsMap: new Map(),
            tagList: [],
            hoverTag:null,
            currentTag: null,
            homeNav: new NavTag('#1', '首页', '#home/home.html')
        }
    },
    watch: {
        currentTag(n, o) {
            if (n != o) {
                var compId = n.id;
                if (!Vue.component(compId)) {
                    this.loadMoule()
                } else {
                    this.$emit('on-switch', n);
                }
            }
        }
    },
    methods: {
        //自动切换导航
        initNav() {
            $.history.init(hash => {
                this.openTag(hash)
            });
        },
        //主动切换
        openTag(menu) {
            var tag = typeof menu === "string" ? this.allTagsMap.get(App.convertToComp(menu))
                : this.allTagsMap.get(App.convertToComp(menu.url))

            if ( menu == ""){
                tag = this.homeNav;
            }

            if (!tag) {
                //创建并且添加tag
                tag = this.addNavTag(menu);
            }
            this.currentTag = tag;
        },
        addNavTag(menu) {
            var m = typeof menu == "string" ? this.$root.getMenuByComp(menu) : menu;
            //建立临时tag
            var tag;
            if ( !m ){
                tag = new NavTag('#2', '    ',menu);
            }else{
                tag = new NavTag(m)
            }

            this.tagList.push(tag);
            this.allTagsMap.set(tag.id, tag);
            this.$root.cacheList.push(tag.id);

            return tag;
        },
        loadMoule() {
            var url = this.currentTag.url;
            if ( url.indexOf("#") == 0){
                url = url.substring(1);
            }
            window.location.hash = url;
            //请求前将页面搞空
            this.$root.componentId = "d-page-loading";
            App.request({
                dataType: "text",
                url: pageContextPath + url,
                success: res => {
                    var wrap = $("<div></div>").html(res);
                    var title = wrap.children('title').text();
                    if (this.currentTag && this.currentTag.name == "    ") {
                        this.currentTag.name = title;
                    }
                    var template = wrap.children('template');
                    var compId = this.currentTag.id;
                    App.mouleTemplate[compId] = template.html();
                    var that = this;
                    App.mouleTemplateCallback[compId] = function (v) {
                        that.$emit('on-switch', that.currentTag);
                    }
                    template.remove();
                    wrap.appendTo('body');
                }
            }).callError(res => {
                //App.MainVueApp.componentId = "page-error";
            }).hideLoad();
        },
        onTagClick(tag){
            this.currentTag = tag;
        }
    }

});