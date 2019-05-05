(()=>{

    App.moule({
        data :function() {
            return {
                form:{},
                tabStyle:{}
            }
        },
        activated(){
            //接收数据
            var editData = App.getData('editData');
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