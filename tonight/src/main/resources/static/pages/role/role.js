(() => {

    App.moule({
        data: function () {
            return {
                /*页面高度*/
                cardHeight: 0,
                /*权限树数据*/
                perData: [
                    {
                        id: '/',
                        label: '全部权限',
                    }],

                /*添加权限的dialog状态*/
                insertPerDialogFormVisible: false,
                /*编辑权限的dialog状态*/
                updatePerDialogFormVisible: false,

                /*权限dialog 的form*/
                perDialogForm: {
                    perName: '',
                    perUrl: '',
                },

                /*权限函数自定义的data*/
                perTreeData: '',
                /*权限函数自定义的Node*/
                perTreeNode: '',

                /*角色数据表*/
                roleData: [],
                /*分页栏的 当前页*/
                tableCurrentPage: 1,
                /*分页栏的 每页行数*/
                tablePageSize: 10,
                /*分页栏的总条数*/
                tableTotal: 0,

                addRoleDialog: false,
                updateRoleDialog:false,
                roleForm: {id:'',roleName: '', rolePer: []},

            }
        },
        methods: {
            /*增加权限*/
            append(data) {
                this.perTreeData = data;
                this.insertPerDialogFormVisible = true;

            },
            /*确认添加权限确认函数*/
            insetPerDialogFormVisibleSubmit() {
                let that = this;
                let data = that.perTreeData;
                const newChild = {id: that.perDialogForm.perUrl, label: that.perDialogForm.perName, children: []};
                if (!data.children) {
                    that.$set(data, 'children', []);
                }
                data.children.push(newChild);
                App.request("/role/savePer", {"perData": JSON.stringify(that.perData)}).post();
                that.insertPerDialogFormVisible = false;
            },

            /*修改权限*/
            update(node, data) {
                this.perTreeNode = node;
                this.perTreeData = data;
                this.perDialogForm = {
                    perName: node.label,
                    perUrl: node.key,
                };
                this.updatePerDialogFormVisible = true;

            },
            updatePerDialogFormVisibleSubmit() {
                let that = this;
                let data = that.perTreeData;
                let node = that.perTreeNode;
                data.id = that.perDialogForm.perUrl;
                data.label = that.perDialogForm.perName;
                App.request("/role/savePer", {"perData": JSON.stringify(that.perData)}).post();
                this.updatePerDialogFormVisible = false;
            },


            /*删除权限*/
            remove(node, data) {
                let that = this;
                if (node.id === "/" || node.label === "全部权限") {
                    that.$message({
                        message: '警告：全部(根)权限不能删除',
                        type: 'warning'
                    });
                    return;
                }
                that.$confirm('此操作将永久删除该权限信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const parent = node.parent;
                    const children = parent.data.children || parent.data;
                    const index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);
                    App.request("/role/savePer", {"perData": JSON.stringify(that.perData)}).post();
                    that.$message({
                        type: 'success',
                        message: '删除成功!'
                    });

                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            /*关闭对话框时情况对话框内容*/
            closeClearDialog() {
                this.perDialogForm = {
                    perName: '',
                    perUrl: '',
                };
                this.perTreeData = '';
                this.perTreeNode = '';
                this.roleForm = {id:'',roleName: '', rolePer: []};
            },

            /*添加用户*/
            addRoleClick() {
                this.addRoleDialog=true;
            },
            addRoleDialogSubmit(){
                let that=this;
                App.request("/role/saveRole").post().setData(that.roleForm).callSuccess(function (resp) {
                    if(resp.data){
                        that.$message({
                            type: 'success',
                            message: '添加角色成功!'
                        });
                        that.addRoleDialog=false;
                        that.findRole();
                    }else{
                        that.$message({
                            type: 'error',
                            message: '添加角色失败!'
                        });
                    }
                });
            },

            /*修改角色*/
            updateRoleClick(rowData){
                this.roleForm.id=rowData.id;
                this.roleForm.roleName=rowData.roleName;
                this.roleForm.rolePer=rowData.rolePer;
                this.updateRoleDialog=true;
            },
            updateRoleDialogSubmit(){
                let that=this;
                App.request("/role/updateRole").post().setData(that.roleForm).callSuccess(function (resp) {
                    if(resp.data){
                        that.$message({
                            type: 'success',
                            message: '修改角色成功!'
                        });
                        that.updateRoleDialog=false;
                        that.findRole();
                    }else{
                        that.$message({
                            type: 'error',
                            message: '修改角色失败!'
                        });
                    }
                });
            },


            /*删除角色*/
            deleteRoleClick(rowData){
                let that = this;
                that.$confirm('此操作将永久删除该角色信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    App.request("/role/removeRole", {id: rowData.id}).callSuccess(function (resp) {
                        if (resp.data) {
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.tableCurrentPage=1; //刷新页面时，刷新到第一页
                            that.findRole();
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


            /**
             * 查找角色列表
             */
            findRole(){
                let that=this;
                App.request("/role/pageRoleList",{"pageSize":that.tablePageSize,"currentPage":that.tableCurrentPage}).callSuccess(function (resp) {
                    that.roleData=resp.data.list;
                    that.tableTotal=resp.data.total;
                })
            },

            /*分页栏对应的函数*/
            handleSizeChange(val) {
                this.tablePageSize = val;
                //console.log(`每页 ${val} 条`);
                  this.findRole();
            },
            handleCurrentChange(val) {
                this.tableCurrentPage = val;
                // console.log(`当前页: ${val}`);
                   this.findRole();
            },

            /*返回当前选择的权限key数组*/
            rolePerChecked(node,data){
                this.roleForm.rolePer=data.checkedKeys;
            }
        },
        /* 组件创建完成事件  */
        created: function () {
            console.log('组件创建完成事件');
        },
        /* 模板编译挂载完成事件 类似小程序onload */
        mounted: function () {
            console.log('模板编译挂载完成事件');
        },
        /* 组件更新完成事件 */
        updated: function () {
            console.log('组件更新完成事件');
        },
        /*  组件被激活 类似小程序onshow */
        activated: function () {
            console.log('组件被激活');
            let that = this;
            App.request("/role/findPer").callSuccess(function (resp) {
                that.perData = JSON.parse(resp.data);
            });
            that.findRole();
            this.$nextTick(() => {
                this.cardHeight = App.MainVueApp.pageHeight - 205;
            });
        },
        /*  组件未被激活 类似小程序ondestroy */
        deactivated: function () {
            console.log('组件未激活');
        }
    });

})()