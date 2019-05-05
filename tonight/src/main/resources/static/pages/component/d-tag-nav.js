Vue.component('d-tag-nav', {
    template: `
        <div class="tag-nav-wrapper">
            <div class="tag-nav-body">
               <div class="tag-nav">
                    <span>首页</span>
                    <div class="tag-nav-bar" ></div>
               </div>   
            </div>
        </div>
    `,
    props:{
        capacity:{
            type:Number,
            default: 9
        }
    },

});