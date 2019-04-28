(()=>{

    App.moule({
    data :function(result) {
        return {

            form1:{
                id:'',
                profiles:[{
                    profile:'',
                    url:''
                }]


            },
            input1: '',
            input2: ''
        }
    },
    methods: {
        insertProfile(){
            var that = this;
            App.request('/app/insertProfile')
                .post().setData(this.form1).callSuccess(function (res) {
                App.success("添加成功！");
            });
            that.form1.profiles[0].profile = "";
            that.form1.profiles[0].url = "";
            App.closeCurrentTagNav();
        },
        cancelProfile(){
            App.closeCurrentTagNav();
        },
        handleChange(val) {
            console.log(val);
        },
        /*删除应用环境*/
        deleteProfile(){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
        },
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
        var that = this;
        that.form1.id =App.getData("id");
        App.removeData("id");
        console.log('添加环境组件被激活');
    },
    /*  组件未被激活 类似小程序ondestroy */
    deactivated :function() {
        console.log('组件未激活');
    }

});

})()

