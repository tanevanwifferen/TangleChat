<template>
    <div>hoi?</div>
</template>
<script>
 import Rete from 'rete';
 const sockets = require("../mixins/Sockets").default;
 class ConsoleLogComponent extends Rete.Component {
     constructor(){
         super("console_log");
         this.task = {
             outputs:{}
         };
     }

     builder(node){
         var inp1 = new Rete.Input("act", "Action", sockets.actionSocket);
         var inp2 = new Rete.Input("msg", "Message", sockets.messageSocket);
         return node.addInput(inp1).addInput(inp2);
     }

     worker(node, inputs, data){
         var tolog = inputs["msg"] ? inputs["msg"][0] : null;
         if(tolog == null){
             return;
         }
         console.log(tolog);
     }

     getView(){
         return {
             data:function(){toshow;}
         };
     } // vue component?
 }

 export default {
     name:'ConsoleLogComponent',
     actions:[ConsoleLogComponent],
     majormodes:[{name:"ConsoleLogComponent", component:ConsoleLogComponent}]
 };
</script>
