(()=>{

    App.moule({
    data :function(result) {
        return {
            form:{},
            addForm:{},
            totals:0,
            defaultOpen:['1'],
            tableData: [],
            addModule:false,
            rules: {
                field: [
                    {required: true, message: '请输入字段', trigger: 'blur'},
                ],
                fieldName: [
                    {required: true, message: '请输入字段名称', trigger: 'blur'},
                ]
            },
            updateModule:false,
            updateForm:{},

        }
    },
    inject: ['reload'],
    methods: {
        findData(){

        },
        insertData(){
            this.addModule =true;
        },
        addButton(){
            App.request("/dictionary/save").post().setData(this.addForm).callSuccess(res=>{
                this.$message({
                    message:"保存成功",
                    type:"success"
                })
                this.addForm={};
                this.addModule =false;
                this.find()
            })
        },
        find(){
            App.request("/dictionary/find").post().setData(this.form).callSuccess(res=>{
                this.tableData =res.data.data
                this.totals =res.data.total;
            })
        },
        updateButton(){
        App.request("/dictionary/update").post().setData(this.updateForm).callSuccess(res=>{
            this.$message({
                message:"更新成功",
                type:"success"
            })
            this.updateModule=false;
            this.find()
        })
        },
        updateClick(row){
            this.updateForm=row;
            this.updateModule=true;
        },
        deleteClick(row){
            App.request("/dictionary/remove/"+row.id).callSuccess(res=>{
                this.$message({
                    message:"删除成功",
                    type:"success"
                })
                this.find()
            })
        },
        handleSizeChange(val) {
            this.form.pageSize=val;
            this.find()
        },
        handleCurrentChange(val) {
            this.form.pageNum=val;
            this.find()
        }
     },

    /* 组件创建完成事件  */
    created :function(){
        console.log('组件创建完成事件');
    },
    /* 模板编译挂载完成事件 类似小程序onload */
    mounted :function(){
        console.log('模板编译挂载完成事件');
    },
    /* 组件更新完成事件 */
    upApiIdd:function(){
        console.log('组件更新完成事件');
    },
    /*  组件被激活 类似小程序onshow */
    activated :function(){
       this.find()
    },
    /*  组件未被激活 类似小程序ondestroy */
    deactivated :function() {
        console.log('组件未激活');
    }

});

})()

