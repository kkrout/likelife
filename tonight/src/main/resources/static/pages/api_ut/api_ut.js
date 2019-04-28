(() => {

    App.moule({
        data: function () {
            return {
                tableHeight: 0,
                /*数据表格里的数据*/
                testTableData: [{
                    id: '',
                    classes: '',
                    secondClass: '',
                    name: '',
                    url: '',
                    className: '',
                    methodName: '',
                    restType: '',
                    paramType: '',
                    person: '',
                    describe: '',
                    inputParam: '',
                    outputParam: '',
                    restTemplateDto:'',
                }],

                /*分页栏的 当前页*/
                tableCurrentPage: 1,
                /*分页栏的 每页行数*/
                tablePageSize:10,
                /*分页栏的总条数*/
                tableTotal:0,

                /*查询弹出框状态*/
                visible: false,
                /*查询API对应的form表单*/
                form: {
                    id: '',
                    secondClass: '',
                    name: '',
                    url: '',
        /*            className: '',*/
                    methodName: '',
        /*            restType: '',*/
                    person: '',
                    currentPage:'',
                    pageSize:'',
                },
                options1:[],
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    id: 'value',
                },
            }
        },
        methods: {
            /*查询API*/
            findApi(){
                let that = this;
                that.form.currentPage=that.tableCurrentPage;
                that.form.pageSize=that.tablePageSize;
                App.request("/api/findApi").post().setData(that.form).callSuccess(function(resp){
                    that.testTableData =resp.data;
                });
                App.request("/api/total").post().setData(that.form).callSuccess(function (resp) {
                    that.tableTotal=resp.data;
                })

            },


            /*分页栏对应的函数*/
            handleSizeChange(val) {
                this.tablePageSize=val;
                //console.log(`每页 ${val} 条`);
                this.findApi();
            },
            handleCurrentChange(val) {
                this.tableCurrentPage=val;
                // console.log(`当前页: ${val}`);
                this.findApi();
            },

            /* 添加API 打开窗口*/
            insertAPI() {
                App.openModule("insertAPI", "添加API", "api/insert/insert.html")
            },
            /*查询API 提交的函数*/
            onSubmit() {
                this.tableCurrentPage=1;
                this.visible=false;
                this.findApi();
            },
            /*重置查询*/
            resetForm() {
                let that = this;
                this.form.name='';
                this.form.url='';
           /*     this.form.className='';*/
                this.form.methodName='';
                this.form.person='';
                this.form.currentPage='';
                this.form.pageSize='';
                that.tableCurrentPage=1;
                that.visible=false;
                that.findApi();
            },
            /*删除API*/
            deleteRow(row) {
                let that = this;
                that.$confirm('此操作将永久删除该API信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    App.request("/api/removeApi",{id:row.id}).callSuccess(function (resp){
                        if(resp.data){
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.findApi();
                        }else{
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
            /*编辑API*/
            testHandleClick(testRow) {
                App.putData("test", testRow);
                App.openModule("api_test", "单元测试", "api_ut/api_test.html");
            },
            /*表格类别显示状态转换*/
            classes(val) {
                let that = this;
                for (let i = 0; i < that.options1.length; i++) {
                    if ((that.options1[i].value) === val.classes) {
                        return that.options1[i].label;
                    }
                }
                return '未匹配类型';
            },

            nodeClick(data, Node) {
                let that = this;
                that.form.id='';
                that.form.secondClass='';
                that.form.currentPage = 1;
                that.form.pageSize = that.tablePageSize;
                if (Node.level===2) {
                    that.form.secondClass = data.label;
                    that.form.id = Node.parent.key;
                    App.request("/api/getClass").setData(that.form).post().callSuccess(function (resp) {
                        that.testTableData = resp.data[0];
                        that.tableTotal = resp.data[1];
                    });
                }/* else if(Node.level===1){
                    App.request("/api/findApiClassList",{classes:data.value}).callSuccess(function (resp) {
                        for (let i = 0; i < that.options1.length; i++) {
                            if (that.options1[i].value == data.value) {
                                that.$set(that.options1[i], 'children', resp.data)
                            }
                        }
                    });
                }*/
            },

            onLoad(){
                window.location.reload();
            },

        },
        /* 组件创建完成事件  */
        created: function () {
            console.log('组件创建完成事件');
        },
        /* 模板编译挂载完成事件 类似小程序onload */
        mounted: function () {
            let that=this;
            App.request("/app/findAppClasses").callSuccess(function (resp) {
                that.options1=resp.data;
            });
            this.$nextTick(() => {
                this.tableHeight = App.MainVueApp.pageHeight - 180
            });
            console.log('模板编译挂载完成事件');
        },
        /* 组件更新完成事件 */
        updated: function () {
            console.log('组件更新完成事件');
        },
        /*  组件被激活 类似小程序onshow */
        activated: function () {
            console.log('组件被激活');
            this.findApi();
        },
        /*  组件未被激活 类似小程序ondestroy */
        deactivated: function () {
            console.log('组件未激活');
        }
    });

})()