Vue.component('d-sub-menu',{
    template:`
        <el-submenu v-if="item.children && item.children.length" >
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
        <el-dropdown v-if="item.children && item.children.length" placement="left" >
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
        <el-dropdown size="medium" v-if="item.children && item.children.length" placement="left" >
            <el-menu-item :index="item.menuId" >
                <i v-if="item.iconCls" :class="item.iconCls"></i>
            </el-menu-item>
            <el-dropdown-menu slot="dropdown">
                <d-subclose-menu v-for="sub in item.children" :item="sub" ></d-subclose-menu>
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
        <div style="height: 100%">
            <el-menu :index="value"  @select="menuSelect" style="height: calc(100% - 30px)"
                     background-color="#383e4b" text-color="#fff"
                     active-text-color="rgba(19,194,194,0.66)"  >
                <template  v-if="closed" >
                    <d-close-menu :item="item" v-for="item in list" ></d-close-menu>
                </template>
                <template  v-else >
                    <d-sub-menu :item="item" v-for="item in list" ></d-sub-menu>
                </template>
            </el-menu>
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
            console.log(v)
        },
        onClospend(b){
            this.closed=b;
            this.$emit('close',b)
        }
    }
})