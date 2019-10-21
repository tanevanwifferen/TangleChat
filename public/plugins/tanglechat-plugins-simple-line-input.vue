<template>
    <div>
        <form onsubmit="return false">
        <input v-model="message"></input>
        <button v-on:click="publishStuff">Submit</button>
        </form>
    </div>
</template>
<script>
 import Rete from 'rete';
 const sockets = require("../mixins/Sockets").default;

 // 'singleton' that changes when a new instance is created.
 // it is the only way I can imagine to transfer data from
 // vue to rete and back.
 var instance_to_call = null;

 class SimpleInputComponent extends Rete.Component {
     constructor(){
         super("simple_input");
         const that = this;
         this.task = {
             outputs:{
                 act: "option",
                 msg: "output"
             },
             init(task){
                 instance_to_call = task;
             }
         };
     }

     builder(node){
         var act = new Rete.Output("act", "Action", sockets.actionSocket);
         var msg = new Rete.Output("msg", "Message", sockets.messageSocket);
         return node.addOutput(act).addOutput(msg);
     }

     worker(node, inputs, data){
         if(data == ""){
             this.closed=['act'];
             return;
         }
         this.closed=[];
         return {msg:data}
     }

     getView(){
         return {
             data:function(){toshow;}
         };
     } // vue component?
 }

 var vm = {
     data(){
         return {
             message:""
         }
     },
     methods:{
         publishStuff(){
             var msg = this.message;
             this.message = "";
             instance_to_call.run(msg);
         }
     },
     name:"SimpleInputComponent",
     minormodes:{
         input:[{
             name:'SimpleInputComponent',
             component:SimpleInputComponent
         }]
     }
 }

 export default vm;
</script>
