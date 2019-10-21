var Vue = require("vue/dist/vue.js");
var bbl = require("@babel/polyfill");
Vue.component('homepage', function (resolve) {
    require(["../components/homepage.vue"], resolve);
});


const app = new Vue({
    el: "#app",
    data:{
        components:[],
        component:''
    }
});
