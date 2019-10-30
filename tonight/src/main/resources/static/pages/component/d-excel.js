Vue.component('d-excel',{
    template:`
        <div>
            <div ref="spreadsheet" v-if="showSheet" style="background:white;" ></div>
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
            spreadsheet:null,
            showSheet:false
        }
    },
    methods:{
        load(options){
            this.showSheet = false;
            this.$nextTick(()=>{
                this.showSheet = true;
                this.$nextTick(()=>{
                    this.spreadsheet = jexcel(this.$refs.spreadsheet, options);
                    console.log(this.spreadsheet)
                })
            })
        }
    }
})