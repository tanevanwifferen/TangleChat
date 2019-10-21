<template>
    <div id="wrapper">
        <component id="sidebar" name="tane"
                   v-bind:is="'sidebar'"
                   v-on:selected="handleConfig"></component>
        <div v-if="components != []" style="height:100%">
            <div v-for='component in components'>
                <button v-on:click="selectedcomponent = component">{{ component }}</button>
            </div>
            <div v-if="selectedcomponent != ''" style="height:90%">
                <div v-show="selectedcomponent == 'configEditor'">
                    <component id="content"
                                name="tane"
                                v-bind:channel="config"
                                v-bind:is="'configEditor'"></component>
                </div>
                <div v-if="selectedcomponent != '' && selectedcomponent != 'configEditor'">
                    <div style="overflow:scroll; height:80%">
                        <component id="content"
                                v-bind:viewmanager="viewManager"
                                v-bind:channel="config"
                                v-bind:is="selectedcomponent"></component>
                    </div>
                    <div style="height:20%;">
                        <div v-for="minormode in viewManager.getViews('input')">
                            <component v-bind:is="minormode"></component>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// dynamic import
 // const Sidebar = ()=>import("./sidebar.vue");
 import Rete from 'rete';
 const Sidebar = ()=>import("./sidebar.vue");
 const ConfigEditor = ()=>import("./config-editor.vue");
 const Vue = require("vue/dist/vue.js");

 class ViewManager{
     constructor(){
         this.views = {};
     }
     registerView(category, name){
         if(typeof(this.views[category]) =='undefined'){
             this.views[category] = [];
         }
         if(this.views[category].indexOf(name) == -1){
             this.views[category].push(name);
         }
     }

     getViews(category){
         if(typeof(this.views[category]) == 'undefined'){
             return [];
         }
         return this.views[category];
     }
 }

 export default {
     components:{
         sidebar:Sidebar,
         configEditor:ConfigEditor
     },
     data:function(){
         return {
             selectedcomponent:'',
             components:[],
             config:null,
             viewManager:new ViewManager()
         }
     },
     methods:{
         handleConfig:function(newcfg){
             this.config = newcfg.cfg;
             this.components= [];
             this.selectedcomponent = '';
             const tasks = [];
             const plugins = [];
             for(var q in this.config.plugins){
                 var p = this.config.plugins[q];
                 var promise = import("../plugins/" + p + ".vue");
                 tasks.push(promise);
                 promise.then((p)=>{
                     if(p == null || typeof(p) == 'undefined'){
                         debugger;
                     }
                     p = p.default;
                     if(typeof(p.minormodes) != 'undefined'){
                         const categories = Object.keys(p.minormodes);
                         for(var i = 0; i < categories.length; i++){
                             var category = categories[i];
                             var minormodes = p.minormodes[category];
                             for(var j = 0; j < minormodes.length; j++){
                                 var minormode = minormodes[j];
                                 Vue.component(minormode.name, p);
                                 this.viewManager.registerView(category, minormode.name);
                             }
                         }
                     }
                     if(typeof(p.majormodes) != 'undefined'){
                         for(var i = 0; i < p.majormodes.length; i++){
                             var name = p.name;
                             Vue.component(name, p);
                             plugins.push(name);
                         }
                     }
                 });
             }
             const that = this;
             Promise.all(tasks).then(function(){
                 for(var i = 0; i<plugins.length; i++){
                     that.components.push(plugins[i]);
                     if(i == 0){
                         that.selectedcomponent = plugins[i];
                     }
                 }
                 that.components.push('configEditor');
             });
         }
     }
 }
</script>
<style>
 #wrapper {
     height:100%;
     display:grid;
     grid-template-rows:80px auto;
     grid-template-areas:
         'header'
         'content';
 }

 #sidebar {
     grid-area:header;
     margin:8px;
 }

 #content {
     margin:8px;
     grid-area:content;
     width:100%;
     height:100%;
 }

 @media (min-width: 769px) {
     #wrapper {
         grid-template-columns: 200px auto;
         grid-template-rows: auto;
         grid-template-areas: 'header content';
     }

     #sidebar {
         max-height:100%;
         max-width:200px;
     }
 }
</style>
