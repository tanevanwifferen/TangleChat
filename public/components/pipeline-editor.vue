<template>
    <div id="rete" class="node-editor" style="height:500px;"></div>
</template>

<script>
 import Rete from 'rete';
 import ConnectionPlugin from 'rete-connection-plugin';
 import TaskPlugin from 'rete-task-plugin';
 import VueRenderPlugin from 'rete-vue-render-plugin';
 import ContextMenuPlugin from 'rete-context-menu-plugin';

 const MessageStream = require("../mixins/MessageStream").default;
 const ConstantFilterProvider = require("../mixins/ConstantFilterProvider").default;
 const pluginManager = require("../mixins/PluginManager").default;


 const JsRenderPlugin = {
     install(editor, params = {}) {
         editor.on("rendercontrol", ({ el, control }) => {
             if (control.render && control.render !== "js") return;

             control.handler(el, editor);
         });
     }
 };

 export default {
     name:"pipeline-editor",
     props:["config"],
     methods:{
         updateEngine(){
             var plugins = [
                 ConnectionPlugin,
                 VueRenderPlugin,
                 TaskPlugin,
                 JsRenderPlugin,
             ];
             for(var i = 0; i < plugins.length;i++){
                 this.editor.use(plugins[i]);
             }
             this.editor.use(ContextMenuPlugin, {
                 searchBar: false,
                 delay: 100,
                 allocate(component) {
                     return ['Submenu'];
                 },
                 rename(component) {
                     return component.name;
                 },
                 items: {
                     'Click me'(){ console.log('Works!') }
                 }
             });
             var components = [
                 new MessageStream(),
                 new ConstantFilterProvider(),
             ];
             for(var i = 0; i < components.length;i++){
                 this.editor.register(components[i]);
                 this.engine.register(components[i]);
             }

             console.log(this.config.plugins);
             const asyncs = [];
             for(var i = 0; i<this.config.plugins.length; i++){
                 var pluginId = this.config.plugins[i];
                 console.log(pluginId);
                 let req = import("../plugins/" + pluginId + ".vue");
                 asyncs.push(req);
                 req.then((p)=>{
                     p = p.default;
                     console.log(p);
                     for(var i in p.actions){
                         var plugin = p.actions[i];
                         var r = new plugin();
                         this.editor.register(r);
                         this.engine.register(r);
                     }
                     if(typeof(p.minormodes) != 'undefined'){
                        var minor_categories = Object.keys(p.minormodes);
                        for(var i = 0; i< minor_categories.length; i++){
                            var category = minor_categories[i];
                            var plugins = p.minormodes[category];
                            for(var j = 0; j < plugins.length; j++){
                                var plugin = plugins[j];
                                if(typeof(plugin.component) != 'undefined'){
                                    var r = new plugin.component();
                                    this.editor.register(r);
                                    this.engine.register(r);
                                }
                            }
                        }
                     }
                 });;
             }


             const that = this;
             Promise.all(asyncs).then(async function(){
                 try{
                     that.editor.fromJSON(that.config.graph);
                 } catch(e){
                     //swallow
                 }
                 that.editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async function() {
                     that.config.graph = that.editor.toJSON();
                     await that.engine.abort();
                     await that.engine.process(that.config.graph);
                 });
                 that.editor.trigger("process");
             });
         }
     },
     mounted(){
         const container = document.querySelector('#rete');
         this.editor= new Rete.NodeEditor('demo@0.1.0', container);
         this.engine= new Rete.Engine('demo@0.1.0', container);
         this.updateEngine();
     },
     destroyed(){
         if(this.editor){
             this.editor.destroy();
             this.engine.destroy();
             delete this.editor;
             delete this.engine;
         }
     },
     updated(){
         if(this.editor){
             this.editor.destroy();
             this.engine.destroy();
             delete this.editor;
             delete this.engine;
         }
         const container = document.querySelector('#rete');
         this.editor= new Rete.NodeEditor('demo@0.1.0', container);
         this.engine= new Rete.Engine('demo@0.1.0', container);
         this.updateEngine();
     }
 };
</script>
