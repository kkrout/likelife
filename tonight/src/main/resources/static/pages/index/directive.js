/**
 * 滚动条指令
 */
/**
 * @description 自动判断该更新PerfectScrollbar还是创建它
 * @param {HTMLElement} el - 必填。dom元素
 */
const el_scrollBar = (el,value,settings) => {
    //在元素上加点私货，名字随便取，确保不会和已有属性重复即可，我取名叫做_ps_
    if (el._ps_ instanceof PerfectScrollbar) {
        el._ps_.update();
    } else {
        if ( value !== undefined ){
            //el上挂一份属性
            el._ps_ = new PerfectScrollbar(el, { wheelSpeed:0.5, suppressScrollX: value+"" == '1' , suppressScrollY: value+"" == '0' });
        }else{
            el._ps_ = new PerfectScrollbar(el, { wheelSpeed:0.5 });
        }
        //使用jquery.resize监听改变
        $(el).resize(function(){
            this._ps_ && this._ps_.update();
        })
    }
};

function ScrollFindEl(arg,el){
    if(arg === "table"){
        el = el.querySelector(".el-table__body-wrapper");
        if(!el){
            return console.warn("未发现className为el-table__body-wrapper的dom");
        }
        //判断是否超过高度
        var ch = $(el).children().height();
        var he = $(el).height();
        if ( ch > he ){
            $(el).scrollTop(0);
        }

    }else if ( arg == "itable" ){
        el = el.querySelector(".ivu-table-body");
        if(!el){
            return console.warn("未发现className为ivu-table-body的dom");
        }
    }else if ( arg == "card" ){
        el = el.querySelector(".el-card__body");
        if(!el){
            return console.warn("未发现className为ivu-table-body的dom");
        }
    }else if ( arg == "modal" ){
        el = el.querySelector(".ivu-modal-body");
        if(!el){
            return console.warn("未发现className为ivu-table-body的dom");
        }
    }
    return el;
}

//接着，自定义Vue指令,指令名你自己随便编一个，我们假定它叫scrollBar
Vue.directive("scroll", {
    //使用inserted钩子函数（初次创建dom）获取使用自定义指令处的dom
    inserted(el, binding, vnode) {
        const { arg,value} = binding;

        el = ScrollFindEl(arg,el);
        //判断其样式是否存在position 并且position为"fixed", "absolute"或"relative"
        //如果不符合条件，抛个错误。当然你也可以抛个警告然顺便给其position自动加上"relative"
        //为什么要这么做呢，因为PerfectScrollbar实现原理就是对dom注入两个div，一个是x轴一个是y轴，他们两的position都是absolute。
        //对css稍有常识的人都知道，absolute是相对于所有父节点里设置了position属性的最近的一个节点来定位的，为了能够正确定位，我们要给其设置position属性
        const rules = ["fixed", "absolute", "relative"];
        if (!rules.includes(window.getComputedStyle(el, null).position)) {
            console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join("、")}`)
        }
        //el上挂一份属性
        vnode.context.$nextTick(
            () => {
                el_scrollBar(el,value);
            }
        )
    },
    //更新dom的时候
    componentUpdated(el, binding, vnode, oldVnode) {
        try {
            const { arg ,value} = binding;

            el = ScrollFindEl(arg,el);

            //vnode.context其实就是vue实例，这里其实无需实例也直接用Vue的静态方法
            //故而也可以写成Vue.nextTick
            vnode.context.$nextTick(
                () => {
                    el_scrollBar(el,value);
                }
            )
        } catch (error) {
            console.error(error);
            el_scrollBar(el,value);
        }
    }
})

Vue.directive('echart',{
    inserted(el, binding, vnode) {
        var chart = el.echart;
        const { arg,value,expression} = binding;

        vnode.context.$nextTick(()=>{
            if ( !chart ){
                var chart = echarts.init(el,'infographic');
                el.echart = chart;
            }
            chart.setOption(value);
            vnode.context.$watch(expression,(v)=>{
                el.echart.setOption(v)
            })
        })
    },
    componentUpdated(el, binding, vnode, oldVnode) {
        var chart = el.echart;
        const { arg,value,expression} = binding;

        vnode.context.$nextTick(()=>{
            if ( !chart ){
                var chart = echarts.init(el,'infographic');
                el.echart = chart;
            }
            chart.setOption(value);
        })
    }
});
