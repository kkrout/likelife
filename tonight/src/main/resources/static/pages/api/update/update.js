(() => {

    App.moule({
        data: function () {
            return {
                /*添加API对应的form表单*/
                form: {},
                defaultOpen: [1, 2, 3],


                inputParam: [],
                outputParam: [],

                labelPosition: 'right',
                activeName: 'first',
                activeName2: 'first',

                options: [],
            }
        },
        /*确认添加API*/
        methods: {
            onSubmit() {
                var that = this;
                App.request("/api/updateApi").post().setData(this.form).callSuccess(function (resp) {
                    if (resp.data) {
                        that.form = {};
                        that.inputParam = [{
                            index: 1,
                            paramName: '',
                            paramProperty: '',
                            paramType: 'String',
                            paramMessage: '',
                            subordinate: [{
                                index: 1,
                                paramName: '',
                                paramProperty: '',
                                paramType: 'String',
                                paramMessage: '',
                                subordinate: [{
                                    index: 1,
                                    paramName: '',
                                    paramProperty: '',
                                    paramType: 'String',
                                }],
                            }],
                        }];
                        that.outputParam = [{
                            index: 1,
                            paramName: '',
                            paramProperty: '',
                            paramType: 'String',
                            paramMessage: '',
                            subordinate: [{
                                index: 1,
                                paramName: '',
                                paramProperty: '',
                                paramType: 'String',
                                paramMessage: '',
                                subordinate: [{
                                    index: 1,
                                    paramName: '',
                                    paramProperty: '',
                                    paramType: 'String',
                                }],
                            }],
                        }];
                        that.$message({
                            type: 'success',
                            message: '修改API成功!'
                        });
                        setTimeout(function () {
                            App.closeCurrentTagNav();
                        }, 800)

                    } else {
                        that.$message({
                            type: 'error',
                            message: '修改API失败!'
                        });
                    }
                });


            },
            /*取消按钮*/
            cancel() {
                App.closeCurrentTagNav();
            },
            /**
             * 添加 行的响应
             */
            addTableRowButton(scope) {
                scope.push({
                    index: 1,
                    paramName: '',
                    paramProperty: '',
                    paramType: 'String',
                    paramMessage: '',
                    subordinate: [{
                        index: 1,
                        paramName: '',
                        paramProperty: '',
                        paramType: 'String',
                        paramMessage: '',
                        subordinate: [{
                            index: 1,
                            paramName: '',
                            paramProperty: '',
                            paramType: 'String',
                        }],
                    }],
                });
            },
            /*删除输入参数行*/
            deleteTableRowButton(row, data) {
                for (let i = 0; i < data.length; i++) {
                    if (row === data[i]) {
                        data.splice(i, 1);
                    }
                }
            },
            /*确认使用普通格式输入 输入参数*/
            inputConfirm() {
                let that = this;

                let iLength = that.inputParam.length;
                let i = 0;
                do {
                    if (that.inputParam[i].paramName == null || that.inputParam[i].paramName.length === 0) {
                        that.inputParam.splice(i, 1);
                        i = 0;
                        --iLength;
                        continue;
                    }
                    let j = 0;
                    let jLength = that.inputParam[i].subordinate.length;
                    do {
                        if (that.inputParam[i].subordinate[j].paramName == null || that.inputParam[i].subordinate[j].paramName.length === 0) {
                            that.inputParam[i].subordinate.splice(j, 1);
                            j = 0;
                            --jLength;
                            continue;
                        }
                        let kLength = that.inputParam[i].subordinate[j].subordinate.length;
                        let k = 0;
                        do {
                            if (that.inputParam[i].subordinate[j].subordinate[k].paramName == null || that.inputParam[i].subordinate[j].subordinate[k].paramName.length === 0) {
                                that.inputParam[i].subordinate[j].subordinate.splice(k, 1);
                                k = 0;
                                --kLength;
                            }
                            ++k;
                        } while (k < kLength);
                        ++j;
                    } while (j < jLength);
                    ++i;
                } while (i < iLength) ;


                that.form.inputParam = that.inputParam;
                that.$message({
                    type: 'success',
                    message: '确认成功!'
                });
            },
            /*确认使用普通格式输入 输出参数*/
            outputConfirm() {
                let that = this;

                let iLength = that.outputParam.length;
                let i = 0;
                do {
                    if (that.outputParam[i].paramName == null || that.outputParam[i].paramName.length === 0) {
                        that.outputParam.splice(i, 1);
                        i = 0;
                        --iLength;
                        continue;
                    }
                    let j = 0;
                    let jLength = that.outputParam[i].subordinate.length;
                    do {
                        if (that.outputParam[i].subordinate[j].paramName == null || that.outputParam[i].subordinate[j].paramName.length === 0) {
                            that.outputParam[i].subordinate.splice(j, 1);
                            j = 0;
                            --jLength;
                            continue;
                        }
                        let kLength = that.outputParam[i].subordinate[j].subordinate.length;
                        let k = 0;
                        do {
                            if (that.outputParam[i].subordinate[j].subordinate[k].paramName == null || that.outputParam[i].subordinate[j].subordinate[k].paramName.length === 0) {
                                that.outputParam[i].subordinate[j].subordinate.splice(k, 1);
                                k = 0;
                                --kLength;
                            }
                            ++k;
                        } while (k < kLength);
                        ++j;
                    } while (j < jLength);
                    ++i;
                } while (i < iLength) ;

                that.form.outputParam = that.outputParam;
                that.$message({
                    type: 'success',
                    message: '确认成功!'
                });
            },

            rowStyle({row, rowIndex}) {
                let that = this;
                if (row.paramType == 'Object') {
                }
                else {

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
            that.form = App.getData("row");
            that.inputParam = App.getData("row").inputParam;
            that.outputParam = App.getData("row").outputParam;
            App.request("/app/findAppClasses").callSuccess(function (resp) {
                that.options = resp.data;
            });
            if (that.inputParam === "[]" || that.inputParam === null || that.inputParam === '' || that.inputParam === []) {
                that.inputParam = [{
                    index: 1,
                    paramName: '',
                    paramProperty: '',
                    paramType: 'String',
                    paramMessage: '',
                    subordinate: [{
                        index: 1,
                        paramName: '',
                        paramProperty: '',
                        paramType: 'String',
                        paramMessage: '',
                        subordinate: [{
                            index: 1,
                            paramName: '',
                            paramProperty: '',
                            paramType: 'String',
                        }],
                    }],
                }];
            } else {
                let input = JSON.parse(that.inputParam);
                that.inputParam = [];
                for (let i = 0; i < input.length; i++) {
                    that.inputParam.push({
                        index: 1,
                        paramName: input[i].paramName,
                        paramProperty: input[i].paramProperty,
                        paramType: input[i].paramType,
                        paramMessage: input[i].paramMessage,
                    });
                    if (input[i].subordinate.length === 0 || input[i].subordinate === "[]" || input[i].subordinate === null || input[i].subordinate === '' || input[i].subordinate === []) {
                        that.inputParam[i].subordinate = [{
                            index: 1,
                            paramName: '',
                            paramProperty: '',
                            paramType: 'String',
                            paramMessage: '',
                            subordinate: [{
                                index: 1,
                                paramName: '',
                                paramProperty: '',
                                paramType: 'String',
                            }],
                        }];
                    } else {
                        that.inputParam[i].subordinate = [];
                        for (let j = 0; j < input[i].subordinate.length; j++) {
                            that.inputParam[i].subordinate.push({
                                index: 1,
                                paramName: input[i].subordinate[j].paramName,
                                paramProperty: input[i].subordinate[j].paramProperty,
                                paramType: input[i].subordinate[j].paramType,
                                paramMessage: input[i].subordinate[j].paramMessage,
                            });
                            if (input[i].subordinate[j].subordinate.length === 0 || input[i].subordinate[j].subordinate === "[]" || input[i].subordinate[j].subordinate === null || input[i].subordinate[j].subordinate === '' || input[i].subordinate[j].subordinate === []) {
                                that.inputParam[i].subordinate[j].subordinate = [{
                                    index: 1,
                                    paramName: '',
                                    paramProperty: '',
                                    paramType: 'String',
                                    paramMessage: '',
                                }];
                            } else {
                                that.inputParam[i].subordinate[j].subordinate = [];
                                for (let k = 0; k < input[i].subordinate[j].subordinate.length; k++) {
                                    that.inputParam[i].subordinate[j].subordinate.push({
                                        index: 1,
                                        paramName: input[i].subordinate[j].subordinate[k].paramName,
                                        paramProperty: input[i].subordinate[j].subordinate[k].paramProperty,
                                        paramType: input[i].subordinate[j].subordinate[k].paramType,
                                        paramMessage: input[i].subordinate[j].subordinate[k].paramMessage,
                                    });
                                }
                            }
                        }
                    }
                }
            }
            if (that.outputParam === "[]" || that.outputParam === null || that.outputParam === '' || that.outputParam === []) {
                that.outputParam = [{
                    index: 1,
                    paramName: '',
                    paramProperty: '',
                    paramType: 'String',
                    paramMessage: '',
                    subordinate: [{
                        index: 1,
                        paramName: '',
                        paramProperty: '',
                        paramType: 'String',
                        paramMessage: '',
                        subordinate: [{
                            index: 1,
                            paramName: '',
                            paramProperty: '',
                            paramType: 'String',
                        }],
                    }],
                }];
            } else {
                let output = JSON.parse(that.outputParam);
                that.outputParam = [];
                for (let i = 0; i < output.length; i++) {
                    that.outputParam.push({
                        index: 1,
                        paramName: output[i].paramName,
                        paramProperty: output[i].paramProperty,
                        paramType: output[i].paramType,
                        paramMessage: output[i].paramMessage,
                    });
                    if (output[i].subordinate.length === 0 || output[i].subordinate === "[]" || output[i].subordinate === null || output[i].subordinate === '' || output[i].subordinate === []) {
                        that.outputParam[i].subordinate = [{
                            index: 1,
                            paramName: '',
                            paramProperty: '',
                            paramType: 'String',
                            paramMessage: '',
                            subordinate: [{
                                index: 1,
                                paramName: '',
                                paramProperty: '',
                                paramType: 'String',
                            }],
                        }];
                    } else {
                        that.outputParam[i].subordinate = [];
                        for (let j = 0; j < output[i].subordinate.length; j++) {
                            that.outputParam[i].subordinate.push({
                                index: 1,
                                paramName: output[i].subordinate[j].paramName,
                                paramProperty: output[i].subordinate[j].paramProperty,
                                paramType: output[i].subordinate[j].paramType,
                                paramMessage: output[i].subordinate[j].paramMessage,
                            });
                            if (output[i].subordinate[j].subordinate.length === 0 || output[i].subordinate[j].subordinate === "[]" || output[i].subordinate[j].subordinate === null || output[i].subordinate[j].subordinate === '' || output[i].subordinate[j].subordinate === []) {
                                that.outputParam[i].subordinate[j].subordinate = [{
                                    index: 1,
                                    paramName: '',
                                    paramProperty: '',
                                    paramType: 'String',
                                    paramMessage: '',
                                }];
                            } else {
                                that.outputParam[i].subordinate[j].subordinate = [];
                                for (let k = 0; k < output[i].subordinate[j].subordinate.length; k++) {
                                    that.outputParam[i].subordinate[j].subordinate.push({
                                        index: 1,
                                        paramName: output[i].subordinate[j].subordinate[k].paramName,
                                        paramProperty: output[i].subordinate[j].subordinate[k].paramProperty,
                                        paramType: output[i].subordinate[j].subordinate[k].paramType,
                                        paramMessage: output[i].subordinate[j].subordinate[k].paramMessage,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        },
        /*  组件未被激活 类似小程序ondestroy */
        deactivated: function () {
            console.log('组件未激活');

        }

    });

})();