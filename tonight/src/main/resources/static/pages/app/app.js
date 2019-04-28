(()=>{

    App.moule({
    data :function(result) {
        return {
            tableData: [{
                appId: '',
                appName:'',
                appDesc:'',
                appLeader:'',
                profiles:[{
                    profile:'',
                    url:'',
                }]
            }],
            form1:{
                appName:'',
                appDesc:'',
                appLeader:'',
                pageSize:10,
                pageCurrent:''
            },
            input1: '',
            input2: '',
            value1: '',
            defaultOpen:[1],
            currentPage:1,
            totals:'',
            size:10,
        }
    },
    inject: ['reload'],
    methods: {

        /*分页查询所有数据*/
        findAllApp(){
            var that = this;
            App.request('/app/findAllApp',{page:that.currentPage,size:that.size}).callSuccess(function (res){
                that.tableData = res.data.appPojo;
                that.totals = res.data.total;
            });
        },

        /*条件查询数据*/
        findApp(){
          var that = this;
          that.form1.pageCurrent = that.currentPage;
          App.request('/app/findApp').post().setData(this.form1).callSuccess(function (res) {
              that.tableData = res.data.appPojo;
              that.totals = res.data.total;
          })
        },

        /*添加app应用*/
        insertApp(){
            App.openModule("insertApp","添加APP","app/insertApp/insertapp.html")
        },

        /*修改app应用*/
        updateApp(row){
            App.putData("row",row);
            App.openModule("updateApp","修改APP","app/updateApp/updateapp.html");
        },

        /*删除app按钮方法*/
        deleteApp(row){
            var that = this;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                App.request('/app/removeApp',{id:row.id}).post()
                .callSuccess(function (res) {
                    that.findAllApp();
                    App.success("应用删除成功！");
                });
        }).catch(() => {
                App.info("已取消删除!");
        });
        },

        /*删除profile按钮方法*/
        deleteProfile(row,index){
            var that = this;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                App.request('/app/removeProfile',{id:row,index:index}).post()
                    .callSuccess(function (res) {
                        App.success("环境删除成功！");
                    });
                that.findAllApp();
            }).catch(() => {
                App.info("已取消删除！")
            });
        },

        /*添加profile跳转按钮方法*/
        insertProfile(id){
            App.putData("id",id);
            App.openModule("insertProfile","添加profile","app/insertProfile/insertprofile.html")
        },
        /*分页方法*/
        handleSizeChange(val) {
            this.size = val;
            this.findAllApp();
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
           /* var that = this;*/
            this.currentPage = val;
            this.findAllApp();
            console.log(`当前页: ${val}`);
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
        var that = this;
        App.request('/app/findAllApp',{page:that.currentPage,size:that.size}).callSuccess(function (res){
            that.tableData = res.data.appPojo;
            that.totals = res.data.total;
        });
        console.log('app主页组件被激活');
        that.findAllApp();
    },
    /*  组件未被激活 类似小程序ondestroy */
    deactivated :function() {
        console.log('组件未激活');
    }

});

})()

