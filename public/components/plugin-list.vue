<template>
    <div class="plugin_manager_wrapper">
        <table class="enabled_plugins">
            <thead>
                <tr>
                    <th colspan='2' style='text-align:center'>
                        Enabled plugins
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="plugin in config.plugins">
                    <td>
                        <button v-on:click="delPlugin(plugin)">X</button>
                    </td>
                    <td>
                        <span>{{ plugin }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="plugin_list">
            <thead>
                <tr>
                    <th colspan='2' style='text-align:center'>
                        Installed on server
                    </th>
                </tr>
            </thead>
            <tr v-for="plugin in server_plugins">
                <td>
                    <button v-on:click="addPlugin(plugin)"><--</button>
                </td>
                <td style="text-align:right">
                    <span>{{ plugin }}</span>
                </td>
            </tr>
        </table>
    </div>
</template>

<style>
 .plugin_manager_wrapper{
     display:grid;
     grid-template-columns:60% 40%;
     grid-template-areas:'enabled available';
 }
 .enabled_plugins {
     grid-area:'enabled';
 }

 .plugin_list {
     grid-area:'available';
 }
</style>
<script>
 const pluginmgr = require("../mixins/PluginManager").default;
 export default {
     props:['config'],
     data:()=>{
         return {
             server_plugins: []
         };
     },
     methods:{
         addPlugin(plugin){
             if(this.config.plugins.indexOf(plugin) == -1){
                 this.config.plugins.push(plugin);
             }
         },
         delPlugin(plugin){
             var index = this.config.plugins.indexOf(plugin);
             if(index != -1){
                 this.config.plugins.splice(index, 1);
             }
         },
     },
     created:function(){
         var q = this;
         pluginmgr.getPlugins().then((p)=>{
             var sp = q.server_plugins;
             p = p.data.filter(x => sp.indexOf(x) == -1);
             for(var i in p){
                 q.server_plugins.push(p[i]);
             }
         });
     }
 }
</script>
