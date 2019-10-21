<template>
    <div style="display:grid; grid-rows:auto; grid-columns:100%; overflow:hidden;overflow-y:visible">
        <div style="max-width:100%;width:100%;white-space:nowrap;overflow:scroll;overflow-y:auto">
            <div class="configuation_sidebar_item"
                style="width:200px;"
                v-for="config in filteredConfigs">
                <div style="width:80px; display:inline-block; text-align:center">
                    <span style="max-width:80px; overflow:scroll; margin-left:auto; margin-right:auto">{{ config.name }}</span>
                </div>
                <button v-on:click="viewConfig(config)">view</button>
            </div>
        </div>
        <div>
            <input placeholder='search' v-model="search" ></input>
            <input placeholder='name' v-model="configName" ></input>
            <button v-on:click="createConfig">Add new</button>
            <input placeholder='import config' v-model="configImport" ></input>
            <button v-on:click="importConfig">Import config</button>
        </div>
    </div>
</template>
<script>

 const sb = require('../mixins/ConfigManager').default;

 export default{
     data () {
         return {
             search:"",
             configName: "",
             configImport: "",
             configurations: new sb().getConfigs()
         }
     },
     computed:{
         filteredConfigs:function(){
             if(this.search == ""){
                 return this.configurations;
             }
             return this.configurations.filter(x => x.name.toLowerCase().indexOf(this.search) != -1);
         }
     },
     methods:{
         editConfig:function(cfg){
             this.$emit('selected', {type:'edit', cfg: cfg});
         },
         viewConfig:function(cfg){
             this.$emit('selected', {type:'view', cfg: cfg});
         },
         createConfig:function(){
             let newcfg = {
                 name: this.configName,
                 plugins: [],
                 graph:[]
             };
             new sb().setConfig(newcfg);
             this.configurations = new sb().getConfigs();
             this.configName = "";
         },
         importConfig:function(){
             let newcfg = JSON.parse(this.configImport);
             if(typeof(newcfg.id) != 'undefined'){
                 delete newcfg.id;
             }
             if(this.configName != ""){
                 newcfg.name = this.configName;
             }
             new sb().setConfig(newcfg);
             this.configurations = new sb().getConfigs();
             this.configName = "";
             this.configImport = "";
         }
     },
     props:['name']
 }
</script>
<style>
 .configuation_sidebar_item{
     display:inline-block;
 }
 @media (min-width: 769px) {
    .configuation_sidebar_item{
        display:block;
    }
}
</style>
