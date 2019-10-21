<template>
    <div style="height:100%">
        <div>
            <button style="color:red" v-on:click="deleteChannel">Delete</button>
            <button style="color:green" v-on:click="saveChannel">Save</button>
        </div>
        <div>
            <span>
                Name:
            </span>
            <input v-model="channel.name" ></input>
        </div>
        <div>
            <button v-on:click="export_config">
                Export
            </button>
            <input v-model="export_str"></input>
            <button v-on:click="import_config">
                Import
            </button>
        </div>
        <plugin-list v-bind:config="channel"></plugin-list>
        <pipeline-editor v-bind:config="channel"></pipeline-editor>
    </div>
</template>
<script>
 const configmgr = require("../mixins/ConfigManager").default;
 const cfg = new configmgr;
 const pluginlist = ()=>import("./plugin-list.vue");
 const pipelineEditor = ()=>import("./pipeline-editor.vue");
 export default {
     data(){
         return {
             export_str:""
         };
     },
     props:[ 'channel' ],
     components:{
         pluginList:pluginlist,
         pipelineEditor:pipelineEditor
     },
     methods:{
         saveChannel:function(){
             var c = JSON.parse(JSON.stringify(this.channel));
             cfg.setConfig(c);
         },
         deleteChannel:function(){
             cfg.deleteConfig(this.channel.id);
         },
         export_config:function(){
             this.export_str = JSON.stringify(this.channel);
         },
         import_config:function(){
             var imported = JSON.parse(this.export_str);
             debugger;
             if(typeof(imported.id) != 'undefined'){
                 delete imported.id;
             }
             cfg.setConfig(imported);
         }
     },
     watch:{
         channel:function(val){
         }
     }
 }
</script>
