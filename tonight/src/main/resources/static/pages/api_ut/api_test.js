(() => {

    App.moule({
        data: function () {
            return {
                row: null,
                editableTabsValue: '2',
                editableTabs: [{
                    title: '单元测试',
                    name: '1',
                    content: 'Tab 1 content'
                }],
                message: undefined,
                dialogTip: undefined,
                lookButton: false,
                cookieButton: false,
                tabIndex: 1,
                value1: 0,
                profileData: [],
                rowData: {type: 0, paramType: 0},
                textarea3: "",
                activeName: 'row',
                options1: [{
                    value: 0,
                    label: 'GET'
                }, {
                    value: 1,
                    label: 'POST'
                }],
                options2: [{
                    value: 0,
                    label: "无"
                }, {
                    value: 1,
                    label: "requestBody"
                }, {
                    value: 2,
                    label: 'requesyParam'
                }, {
                    value: 3,
                    label: 'PathVarable'
                }],
                input: '',
                headerTableData: [{
                    index: 1,
                    key: "Content-Type",
                    value: "application/json"
                }, {
                    index: 1,
                    key: "",
                    value: ""
                }],
                cookieTableData: [{
                    index: 1,
                    key: "",
                    value: ""
                }],
                inputTableData: [],
                sendData: {
                    id: '',
                    url: '',
                    method: '',
                    headers: [],
                    cookies: [],
                    params: [],
                },
                paramLook: true,
                ContentTypeOptions: [
                    {value: '*/*', label: '*/*'},
                    {value: 'application/x-www-form-urlencoded', label: 'application/x-www-form-urlencoded'},
                    {value: 'application/json', label: 'application/json'},
                    {value: 'application/json;charset=UTF-8', label: 'application/json;charset=UTF-8'},
                ],
                ContentTypeLook: false,

                expandRowKeys: [],  //默认展开的一层数组
                insideExpandRowKeys:[], //默认展开的二层数组

                arrayObject:'', //记录打开行的数据
                arrayObjectDialog:false, //arrayObject弹出层
                arrayObjectDialogInput:'', //弹出层输入内容
            }
        },
        methods: {
            handleTabsEdit(targetName, action) {
                if (action === 'add') {
                    let newTabName = ++this.tabIndex + '';
                    this.editableTabs.push({
                        title: '单元测试',
                        name: newTabName,
                        content: 'New Tab content'
                    });
                    this.editableTabsValue = newTabName;
                }
                if (action === 'remove') {
                    let tabs = this.editableTabs;
                    let activeName = this.editableTabsValue;
                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.name === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.name;
                                }
                            }
                        });
                    }

                    this.editableTabsValue = activeName;
                    this.editableTabs = tabs.filter(tab => tab.name !== targetName);
                }
            },
            clickLook() {
                if (this.lookButton) {
                    this.lookButton = false;
                } else {
                    this.lookButton = true;
                }
            },
            deleteHeaderRow(index, rows) {
                rows.splice(index, 1);
            },
            addHeaderTableButton() {
                this.headerTableData.push({
                    index: 1,
                    key: "",
                    value: ""
                })
            },
            deleteCookieRow(index, rows) {
                rows.splice(index, 1);
            },
            addCookieTableButton() {
                this.cookieTableData.push({
                    index: 1,
                    key: "",
                    value: ""
                })
            },
            cookieLook() {
                if (this.cookieButton) {
                    this.cookieButton = false;
                } else {
                    this.cookieButton = true;
                }
            },
            /**
             * 发送
             */
            send() {
                let that = this;
                if (that.rowData.fixUrl == null || that.rowData.fixUrl == '') {
                    this.$message({
                        message: '请选择应用环境后再测试！',
                        type: 'warning'
                    });
                    return;
                }
                that.sendData.id = that.rowData.id;
                that.sendData.url = that.rowData.fixUrl + that.rowData.url;
                that.sendData.method = that.rowData.restType;
                that.sendData.headers = that.headerTableData;
                that.sendData.cookies = that.cookieTableData;
                that.sendData.params = that.inputTableData;
                //console.log(that.sendData);
                App.request("/web/unit/restTemplate").post().setData(that.sendData).callSuccess(function (res) {
                    that.message = JSON.parse(res.data);
                })
            },


            /**
             * Header某一单元格被单机时响应
             */
            HeaderCellClick(row, column) {
                let that = this;
                if (row.key === 'Content-Type' && column.label === 'value') {
                    that.ContentTypeLook = true
                    /*                    if (that.ContentTypeLook===true) {
                                            that.ContentTypeLook=false;
                                        }else{
                                            that.ContentTypeLook=true
                                        }*/
                }
            },

            /*表格参数单元格响应*/
            tableCellClick(row, column) {
                let that = this;
                if (row.paramType === 'Array(Base)' && column.label === "输入参数值") {
                    that.$notify({
                        title: '提示',
                        message: '  两个参数之间用英文 , 隔开，例：' +
                            ' abc,bcd,cde',
                        type: 'warning'
                    });
                }else if(row.paramType==='Array(Object)'){
                    that.arrayObject=row;
                    let copyDialogTip = $.extend( true , {} ,row);
                    let copyDialogTipString=JSON.stringify(copyDialogTip);
                    copyDialogTipString=copyDialogTipString.replace(/"index":1,/g, "");
                    copyDialogTipString=copyDialogTipString.replace(/"subordinate":\[\],/g, "");
                    copyDialogTipString=copyDialogTipString.replace(/"paramProperty":"",/g, "");
                    that.dialogTip=JSON.parse(copyDialogTipString);
                    that.arrayObjectDialogInput=JSON.stringify(row.input,null,"\t");
                    that.arrayObjectDialog=true;
                }
            },
            /**
             * 转换json按钮
             */
            toJson() {
                let that = this;
                if (typeof that.message == "string") {
                    that.message = JSON.parse(that.message);
                }
            },

            /*判断数组和Object*/
            cellStyle({row, column, rowIndex, columnIndex}){
                let that=this;
                if(row.paramType==='Object'){
                    if(column.label==='输入参数值'){
                        return "display:none"
                    }
                }else if(row.paramType==='Array(Object)'){
                    for (let i=0;i<that.expandRowKeys.length;i++){
                        if (that.expandRowKeys[i]===row.paramName){
                            that.expandRowKeys.splice(i,1);
                        }
                    }
                }
            },

            /*判断paramName是否为空*/
            rowStyle({row, rowIndex}){
                if (row.paramName==null || row.paramName==''){
                    return "display:none"
                }
            },

            /*鼠标悬停离开*/
            cellMouseLeave(row, column, cell, event){
                let that=this;
               /* if(column.label="输入参数值"){
                    for(let i=0;i<that.inputTableData.length;i++){
                        if (that.inputTableData[i].paramType==='Array(Object)'){
                            for
                        }
                    }
                }*/

            },

            /*
            返回行的key
             */
            row_key(row){
                return row.paramName;
            },

            /*
            弹出层的确认按钮
             */
            arrayObjectDialogSubmit(){
                let that=this;
                let dialogInput;
                try{
                    dialogInput=JSON.parse(that.arrayObjectDialogInput);
                    that.$set(that.arrayObject,"input",dialogInput);
                    that.arrayObjectDialogInput='';
                    that.$message({
                        message: '成功写入数据',
                        type: 'success'
                    });
                    that.arrayObjectDialog=false;
                }catch (e) {
                    that.$message.error('JSON字符串有误，请检查并修改！');
                }
               

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
            that.rowData=App.getData("test");
            let apiId=that.rowData.id;
            App.request("/user/findTestInfo",{"apiId":apiId}).callSuccess(function (resp) {
               that.rowData.restTemplateDto=resp.data;
                /**
                 * 处理参数显示
                 */
                if (that.rowData.inputParam != null && that.rowData.inputParam != '' && that.rowData.inputParam != '[]' && that.rowData.inputParam != []) {
                    that.inputTableData = JSON.parse(that.rowData.inputParam);
                }
                else {
                    that.paramLook = false;
                }

                /**
                 * 查找所有类别
                 */
                let obj;
                App.request("/app/findAppClasses").callSuccess(res => {
                    res.data.forEach(item => {
                        if (item.value == that.rowData.classes) {
                            obj = item.label;
                            App.request("/app/findProfileByName", {appName: obj}).callSuccess(res => {
                                that.profileData = res.data;

                                /**
                                 * 为查询过的赋予默认值
                                 */
                                if (that.rowData.restTemplateDto != null && that.rowData.restTemplateDto !== '') {
                                    /**
                                     * 请求环境默认值
                                     */
                                    if (that.rowData.restTemplateDto.url != null && that.rowData.restTemplateDto.url !== '') {
                                        for (let i = 0; i < that.profileData.length; i++) {

                                            if ((that.rowData.restTemplateDto.url).indexOf(that.profileData[i].url) !== -1) {
                                                that.rowData.fixUrl = that.profileData[i].url;
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    })
                });
                /**
                 * 为查询过的赋予默认值
                 */
                if (that.rowData.restTemplateDto != null && that.rowData.restTemplateDto !== '') {
                    /**
                     * 处理headers默认数据
                     */
                    if (that.rowData.restTemplateDto.headers != null && that.rowData.restTemplateDto.headers.length > 0) {
                        let headers = [];
                        for (let i = 0; i < that.rowData.restTemplateDto.headers.length; i++) {
                            if (that.rowData.restTemplateDto.headers[i].key != null && that.rowData.restTemplateDto.headers[i].key !== '' && that.rowData.restTemplateDto.headers[i].value != null && that.rowData.restTemplateDto.headers[i].value !== '') {
                                headers.push(that.rowData.restTemplateDto.headers[i]);
                            }
                        }
                        if (headers.length > 0) {
                            that.headerTableData = headers;
                        }
                    }

                    /**
                     * 处理cookies默认数据
                     */
                    if (that.rowData.restTemplateDto.cookies != null && that.rowData.restTemplateDto.cookies.length > 0) {
                        let cookies = [];
                        for (let i = 0; i < that.rowData.restTemplateDto.cookies.length; i++) {
                            if (that.rowData.restTemplateDto.cookies[i].key != null && that.rowData.restTemplateDto.cookies[i].key !== '' && that.rowData.restTemplateDto.cookies[i].value != null && that.rowData.restTemplateDto.cookies[i].value !== '') {
                                cookies.push(that.rowData.restTemplateDto.cookies[i]);
                            }
                        }
                        if (cookies.length > 0) {
                            that.cookieTableData = cookies;
                        }
                    }

                    /**
                     * 处理params默认数据
                     */
                    if (that.rowData.restTemplateDto.params != null && that.rowData.restTemplateDto.params.length > 0) {
                        for (let i = 0; i < that.rowData.restTemplateDto.params.length; i++) {
                            that.inputTableData[i].input = that.rowData.restTemplateDto.params[i].input;
                        }
                    }
                    /**
                     *返回信息默认值设置
                     */
                    if (that.rowData.restTemplateDto.responseEntity != null && that.rowData.restTemplateDto.responseEntity !== '') {
                        that.message = JSON.parse(that.rowData.restTemplateDto.responseEntity);
                    }
                }


                /*
                默认展开行的判断展开哪几行
                 */
                for (let i=0;i<that.inputTableData.length;i++){
                    if (that.inputTableData[i].subordinate.length>0){
                        that.expandRowKeys.push(that.inputTableData[i].paramName);
                        for (let j=0;j<that.inputTableData[i].subordinate.length;j++){
                            if (that.inputTableData[i].subordinate[j].subordinate.length>0){
                                that.insideExpandRowKeys.push(that.inputTableData[i].subordinate[j].paramName);
                            }
                        }
                    }
                }
            });


        },
        /*  组件未被激活 类似小程序ondestroy */
        deactivated: function () {
            console.log('组件未激活');
        }
    });

})()