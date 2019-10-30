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
        <div style="display: flex;">
            <div class="tag-nav-wrapper">
                <div class="tag-nav-body" ref="tagBody">
                   <div :class="{'tag-nav':true,'tag-nav-active': item == currentTag }" @mouseover="hoverTag=item" @mouseout="hoverTag=null"
                        v-for="item in tagList" @click="onTagClick(item,$event)">
                        <i :class="item.iconCls" v-if="item.iconCls" ></i>
                        <span v-text="item.name" ></span>
                        <div class="tag-nav-bar" v-if="item == currentTag" ></div>
                        <i @click="closeTag(item)" v-show="hoverTag == item && item.menuId != '#1' " class="el-icon-close" style="position: absolute;top:14px;right:2px;font-size: 12px;"></i>
                   </div>
                </div>
            </div>
            <div draggable style="width: 40px;overflow: hidden;height: 40px;line-height: 40px;">
                <i class="el-icon-caret-left" @click="moveRight" ></i>
                <i class="el-icon-caret-right" @click="moveLeft" ></i>
            </div>
            <div style="width: 200px;overflow: hidden;height: 40px;line-height: 40px;">
                <slot name="left"></slot>
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
        var dataJson = window.localStorage.getItem("LOCAL_TAG_NAV_DATA");
        if ( dataJson) {
            this.tagList = JSON.parse(dataJson);
        }else{
            //初始化
            this.tagList.push(this.homeNav);
        }
        this.createIndex();
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
        },
        tagList(){
            window.localStorage.setItem("LOCAL_TAG_NAV_DATA",JSON.stringify(this.tagList));
        }
    },
    methods: {
        createIndex(){
            var caches = [];
            this.tagList.forEach(item=>{
                this.allTagsMap.set(item.id, item);
                caches.push(item.id)
            })
            //页面缓存
            this.$root.cacheList = caches;
        },
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
        closeTag(item){
            item = item || this.currentTag;
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

            if ( this.currentTag.diy == 1) {
                var menu = this.$root.getMenuById(this.currentTag.menuId);
                var moudle;
                eval("moudle="+menu.script);
                moudle.template = menu.template;
                Vue.component(this.currentTag.id,moudle);
                this.$emit('on-switch', this.currentTag);
            }else if ( this.currentTag.diy == 2) {
                App.request({
                    dataType: "text",
                    url: pageContextPath + "/config/function.html",
                    success: res => {
                        var wrap = $("<div></div>").html(res);
                        var title = wrap.children('title').text();
                        if (this.currentTag && this.currentTag.name == "    ") {
                            this.currentTag.name = title || "无标题";
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
            }else{
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
            }

        },
        onTagClick(tag,evt){
            var target = evt.target || evt.srcElement;
            if ( target.tagName == 'I')
                return;
            this.currentTag = tag;
        },
        getCurrentTag(){
            return this.currentTag;
        },
        moveLeft(){
            var tagBody = $(this.$refs.tagBody);
            var left = -parseInt(tagBody.css("left"))+1;
            var width = 0;
            $(this.$refs.tagBody).children().each(function(){
                width += $(this).outerWidth(true);
                if ( width > left){
                    return false;
                }
            })
            $(this.$refs.tagBody).css({left:-width});
        },
        moveRight(){
            var tagBody = $(this.$refs.tagBody);
            var left = -parseInt(tagBody.css("left"))-1;
            var width = 0;
            $(this.$refs.tagBody).children().each(function(){
                var avWidth = $(this).outerWidth(true);
                console.log(width + avWidth,left)
                if ( width + avWidth > left){
                    return false;
                }
                width += avWidth;
            })
            $(this.$refs.tagBody).css({left:-width});
        },
        autoMove(){
            //以当前节点为目标进行移动
            var tagBody = $(this.$refs.tagBody);
            var left = -parseInt(tagBody.css("left"))-1;
            var width = 0;
            var actTag = $(this.$refs.tagBody).find("tag-nav-active");
            var actLeft = actTag.position().left + actTag.outerWidth(true) - left;
            var bodyWidth = $(this.$refs.tagBody).width();
            if ( actLeft > bodyWidth ){
                $(this.$refs.tagBody).children().each(function(){
                    var avWidth = $(this).outerWidth(true);
                    if ( actLeft - avWidth > left){
                        return false;
                    }
                    width += avWidth;
                })
            }

            $(this.$refs.tagBody).css({left:-width});
        }
    }

});