Vue.component('d-sub-menu',{
    template:`
        <el-submenu :index="item.menuId" v-if="item.children && item.children.length" >
            <template slot="title">
                <i v-if="item.iconCls" :class="item.iconCls"></i>
                <span slot="title" v-text="item.name" ></span>
            </template>
            <d-sub-menu :item="sub" v-for="sub in item.children" ></d-sub-menu>
        </el-submenu>
        <el-menu-item v-else :index="item.menuId" >
            <i v-if="item.iconCls" :class="item.iconCls"></i>
            <span slot="title" :title="item.name" v-text="item.name" ></span>
        </el-menu-item>
    `,
    props:{
        item:{
            type:Object,
            default:{}
        }
    },
});


Vue.component('d-subclose-menu',{
    template:`
        <el-dropdown  v-if="item.children && item.children.length" placement="left" @command="$emit('command',$event)" >
            <el-dropdown-item :command="item.menuId" >
                <i v-if="item.iconCls" :class="item.iconCls"></i>
                 <span v-text="item.name"></span>
                 <i class="el-icon-arrow-right"></i>
            </el-dropdown-item>
            <el-dropdown-menu slot="dropdown">
                <d-subclose-menu v-for="sub in item.children" :item="sub" ></d-subclose-menu>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown-item v-else :command="item.menuId" >
            <i v-if="item.iconCls" :class="item.iconCls"></i>
            <span v-text="item.name"></span>
        </el-dropdown-item>
    `,
    props:["item"]
})

Vue.component('d-close-menu',{
    template:`
        <el-dropdown size="medium" v-if="item.children && item.children.length" placement="left" @command="$emit('command',$event)" >
            <el-menu-item :index="item.menuId" >
                <i v-if="item.iconCls" :class="item.iconCls"></i>
            </el-menu-item>
            <el-dropdown-menu slot="dropdown">
                <d-subclose-menu v-for="sub in item.children" :item="sub" @command="$emit('command',$event)" ></d-subclose-menu>
             </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip v-else class="item" effect="dark" :content="item.name" placement="left">
            <el-menu-item :index="item.menuId" >
                <i v-if="item.iconCls" :class="item.iconCls"></i>
            </el-menu-item>
        </el-tooltip>
    `,
    props:{
        item:{
            type:Object,
            default:{}
        }
    },
});

Vue.component('d-menu',{
    template:`
        <div style="height: calc(100% - 60px)" >
            <div style="height: calc(100% - 30px);overflow: hidden;position: relative;" v-scroll >
                <el-menu :unique-opened="true" :collapse="closed" :default-active="value"  @select="menuSelect" 
                         background-color="#090723" text-color="#fff"
                         active-text-color="#409EFF"  >
                    <d-sub-menu :item="item" v-for="item in list" ></d-sub-menu>
                </el-menu>
            </div>
            <div class="close-menu" >
               <div>
                   <i class="el-icon-d-arrow-left" v-if="!closed" @click="onClospend(true)" ></i>
                   <i class="el-icon-d-arrow-right" v-else @click="onClospend(false)" ></i>
               </div>
            </div>
        </div>
    `,
    props:{
        list:{
            type:Array,
            default:[]
        },
        value:{
            type:String,
            default: ""
        }
    },
    data(){
        return {
            closed:false
        }
    },
    methods:{
        menuSelect(v){
            this.$emit('select',v);
        },
        onClospend(b){
            this.closed=b;
            this.$emit('close',b)
        }
    }
})