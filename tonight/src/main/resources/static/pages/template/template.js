(()=>{

    App.moule({
        data :function() {
            return {
                prop: "我是属性",
                tableHeight:0,
                deleteModal:false,
                selectionData:[],
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
        methods:{
            selectChagne(v){
               this.selectionData = v;
            },
            deleteBatch(){
                //获取选择记录
                if ( !this.selectionData.length ){
                    App.error('请选择记录');
                    return;
                }
                this.deleteModal=true;
            },
            confirmDelete(){
                var _this = this;
                App.post('/api/template/test').setData(_this.selectionData)
                    .setLoadArea(_this.$refs.deleteBtn).callSuccess( ()=> {
                    App.success('删除成功！');
                    _this.deleteModal = false
                });
            },
            edit(row){
                App.openModule("信息编辑","template/detail.html?edit",row);
            },
            del(row){
                this.$set(this,'selectionData',[row]);
                this.deleteModal = true;
            },
            create(){
                App.openModule("信息创建","template/detail.html?new");
            }
        },
        /* 组件创建完成事件  */
        created :function(){
            this.$nextTick(()=>{
                this.tableHeight = App.MainVueApp.pageHeight - 220
            })
        },
        /* 模板编译挂载完成事件 类似小程序onload */
        mounted :function(){
            console.log('模板编译挂载完成事件');
        },
        /* 组件更新完成事件 */
        updated:function(){
            console.log('组件更新完成事件');
        },
        /*  组件被激活 类似小程序onshow */
        activated :function(){
            console.log('组件被激活');
        },
        /*  组件未被激活 类似小程序ondestroy */
        deactivated :function() {
            console.log('组件未激活');
        }
    });

})()