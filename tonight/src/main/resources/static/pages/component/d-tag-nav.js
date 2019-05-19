function NavTag(menu) {
    if (arguments.length > 1) {
        this.menuId = arguments[0] || "";
        this.name = arguments[1] || "";
        this.url = arguments[2] || "";
        this.iconCls = arguments[3] || "";
    } else {
        this.menuId = menu.menuId || "";
        this.name = menu.name || "";
        this.url = menu.url || "";
        this.iconCls = menu.iconCls || "";
        this.data = menu.data || null;
        this.diy = menu.diy || null;
    }
    this.id = App.convertToComp(this.url)
}


Vue.component('d-tag-nav', {
    template: `
        <div class="tag-nav-wrapper">
            <div class="tag-nav-body">
               <div :class="{'tag-nav':true,'tag-nav-active': item == currentTag }" @mouseover="hoverTag=item" @mouseout="hoverTag=null"
                    v-for="item in tagList" @click="onTagClick(item,$event)">
                    <i :class="item.iconCls" v-if="item.iconCls" ></i>
                    <span v-text="item.name" ></span>
                    <div class="tag-nav-bar" v-if="item == currentTag" ></div>
                    <i @click="closeTag(item)" v-show="hoverTag == item && item.menuId != '#1' " class="el-icon-close" style="position: absolute;top:14px;right:2px;font-size: 12px;"></i>
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
    data() {
        return {
            allTagsMap: new Map(),
            tagList: [],
            hoverTag:null,
            currentTag: null,
            homeNav: new NavTag('#1', '首页', '#home/home.html','iconfont icon-home')
        }
    },
    watch: {
        currentTag(n, o) {
            if (n != o) {
                var compId = n.id;
                if (!Vue.component(compId)) {
                    this.loadMoule()
                } else {
                    window.location.hash = n.url;
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
            console.log(menu);
            var m = typeof menu == "string" ? this.$root.getMenuByComp(menu) : menu;
            console.log(m);
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
        closeTag(item){
            var index = this.tagList.indexOf(item);
            this.$delete(this.tagList,index);
            this.$root.$delete(this.$root.cacheList,index);
            this.allTagsMap.delete(item.id);
            if ( this.currentTag == item )
                this.currentTag = this.tagList[index--] || this.tagList[index++] || this.tagList[0];
        },
        loadMoule() {
            var url = this.currentTag.url;
            if ( url.indexOf("#") == 0){
                url = url.substring(1);
            }
            window.location.hash = url;
            //请求前将页面搞空
            this.$root.componentId = "d-page-loading";

            var compId = this.currentTag.id;
            Vue.component(compId, function (resolve, reject) {
                App.request({
                    dataType: "text",
                    url: pageContextPath + url,
                    success: res => {
                        var wrap = $("<div></div>").html(res);
                        var title = wrap.children('title').text();
                        if (this.currentTag && this.currentTag.name == "    ") {
                            this.currentTag.name = title || "无标题";
                        }
                        var template = wrap.children('template');
                        var templateHtml = template.html();
                        template.remove();
                        wrap.appendTo('body');
                        App.component.template = templateHtml;
                        console.log(App.component)
                        resolve(App.component)
                        this.$emit('on-switch', that.currentTag);
                    }
                }).callError(res => {
                }).hideLoad();
            })

            if ( this.currentTag.diy != 1) {

            }else{
                var menu = this.$root.getMenuById(this.currentTag.menuId);
                var moudle;
                eval("moudle="+menu.script);
                moudle.template = menu.template;
                Vue.component(this.currentTag.id,moudle);
                this.$emit('on-switch', this.currentTag);
            }

        },
        onTagClick(tag,evt){
            var target = evt.target || evt.srcElement;
            if ( target.className == "el-icon-close" )
                return;
            this.currentTag = tag;
        },
        getCurrentTag(){
            return this.currentTag;
        }
    }

});