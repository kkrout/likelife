(()=>{

    App.moule({
        data :function() {
            return {
                /*用户数据*/
                userData:[],
                /*查询数据*/
                userQuery:{id:'',username:'',currentPage:1,pageSize:10},
                /*分页栏的 当前页*/
                tableCurrentPage: 1,
                /*分页栏的 每页行数*/
                tablePageSize: 10,
                /*分页栏的总条数*/
                tableTotal: 0,
                /*表格高度*/
                tableHeight:0,
                /*弹出框状态*/
                addUserDialog:false,
                updateUserDialog:false,
                /*增加修改form*/
                userForm:{
                    id:'',
                    username:'',
                    password:'',
                    userRole:'',
                },

                /*角色列表*/
                roleOptions:[],
            }
        },

        methods: {
            /*
            查询确认
             */
            querySubmit(){
                this.tableCurrentPage = 1;
                this.findUser();
            },

            /*查询重置按钮*/
            queryRestSubmit(){
                this.userQuery={id:'',username:'',currentPage:1,pageSize:10};
                this.findUser();
            },

            /*
            添加用户确认
             */
            addUserClick(){
                this.addUserDialog=true;
            },
            /*分页栏对应的函数*/
            handleSizeChange(val) {
                this.tablePageSize = val;
                //console.log(`每页 ${val} 条`);
                this.findUser();
            },
            handleCurrentChange(val) {
                this.tableCurrentPage = val;
                // console.log(`当前页: ${val}`);
                this.findUser();
            },

            /*添加用户确认按钮*/
            addUserDialogSubmit(userForm){
                let that=this;
                this.$refs[userForm].validate((valid) => {
                    if (valid) {
                        App.request("/user/registerVerify",{username:that.userForm.username}).callSuccess(function(resp){
                            if (resp.data) {
                                App.request("/user/saveUser").post().setData(that.userForm).callSuccess(function(resp){
                                    if(resp.data){
                                        that.$message({
                                            type: 'success',
                                            message: '添加用户成功!'
                                        });
                                        that.addUserDialog=false;
                                        that.findUser();
                                    }else{
                                        that.$message({
                                            type: 'error',
                                            message: '添加用户失败!'
                                        });
                                    }
                                });
                            }else{
                                that.$message({
                                    showClose: true,
                                    message: '用户名已存在，请更换用户名',
                                    type: 'error'
                                });
                            }
                        });
                    } else {
                        that.$message({
                            message: '警告,请正确填写表单信息',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            },


            /*修改用户按钮*/
            updateClick(row){
                this.userForm.id=row.id;
                this.userForm.username=row.username;
                this.userForm.password=row.password;
                this.userForm.userRole=row.userRole;
                this.updateUserDialog=true;
            },

            /*修改用户确认按钮*/
            updateUserDialogSubmit(userForm){
                let that=this;
                this.$refs[userForm].validate((valid) => {
                    if (valid) {
                        App.request("/user/updateUser").post().setData(that.userForm).callSuccess(function(resp){
                            if(resp.data){
                                that.$message({
                                    type: 'success',
                                    message: '修改用户信息成功!'
                                });
                                that.updateUserDialog=false;
                                that.findUser();
                            }else{
                                that.$message({
                                    type: 'error',
                                    message: '修改用户信息失败!'
                                });
                            }
                        });
                    } else {
                        that.$message({
                            message: '警告,请正确填写表单信息',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            },

            /*删除用户按钮*/
            deleteClick(row){
                let that = this;
                that.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    App.request("/user/removeUser", {id: row.id}).callSuccess(function (resp) {
                        if (resp.data) {
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.tableCurrentPage=1; //刷新页面时，刷新到第一页
                            that.findUser();
                        } else {
                            that.$message({
                                type: 'error',
                                message: '删除失败!'
                            });
                        }
                    });
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            /*查询用户*/
            findUser(){
                let that=this;
                that.userQuery.currentPage=that.tableCurrentPage;
                that.userQuery.pageSize=that.tablePageSize;
                App.request("/user/userPageList").post().setData(that.userQuery).callSuccess(function (resp) {
                   that.userData =resp.data.list;
                   that.tableTotal=resp.data.total;
                });
            },

            /*关闭对话框时情况对话框内容*/
            closeClearDialog(){
                this.userForm={
                        id:'',
                        username:'',
                        password:'',
                        userRole:'',
                };
            }
        },

        /* 组件创建完成事件  */
        created :function(){
            console.log('组件创建完成事件');
        },
        /* 模板编译挂载完成事件 类似小程序onload */
        mounted :function(){
            console.log('模板编译挂载完成事件');
            let that=this;
            App.request("/role/findRoleOptions").callSuccess(function (resp) {
                that.roleOptions=resp.data;
            })
        },
        /* 组件更新完成事件 */
        upApiIdd:function(){
            console.log('组件更新完成事件');
        },
        /*  组件被激活 类似小程序onshow */
        activated :function(){
            this.$nextTick(() => {
                this.tableHeight = App.MainVueApp.pageHeight - 200;
            });
            this.findUser();
        },
        /*  组件未被激活 类似小程序ondestroy */
        deactivated :function() {
            console.log('组件未激活');
        }

    });

})()

