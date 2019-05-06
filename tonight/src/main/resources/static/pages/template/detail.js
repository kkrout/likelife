(()=>{

    App.moule({
        data :function() {
            return {
                form:{},
                tabStyle:{}
            }
        },
        mounted(){
            var tag = this.$getCurrentTag();
            //接收数据
            var editData = tag.data;
            App.success("接收传过来的数据为："+JSON.stringify(editData));
            this.$nextTick(()=>{
                this.$set(this.tabStyle,'height',(App.MainVueApp.pageHeight - 150)+"px")
                this.$set(this.tabStyle,'overflow',"auto")
            })
        },
        methods:{

        },
    });

})()