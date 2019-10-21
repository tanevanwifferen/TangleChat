<script>
 import Rete from 'rete';
 const sockets = require("../mixins/Sockets").default;
 const InputControl = require("../mixins/InputControl").default;
 class JsonSelectComponent extends Rete.Component {
     constructor(){
         super("json_select");
         const that = this;
         this.task = {
             outputs:{
                 act_o:"option",
                 msg_o:"output"
             },
             init(task){
                 that.task_to_run = task;
             }
         };
     }

     builder(node){
         var inp1 = new Rete.Input("act", "Action", sockets.actionSocket);
         var inp2 = new Rete.Input("msg", "Message", sockets.messageSocket);
         var out1 = new Rete.Output("act_o", "Action", sockets.actionSocket);
         var out2 = new Rete.Output("msg_o", "Message", sockets.messageSocket);
         var strControl = new InputControl("Selector");
         return node.addControl(strControl)
                    .addInput(inp1)
                    .addInput(inp2)
                    .addOutput(out1)
                    .addOutput(out2);
     }

     worker(node, inputs, data){
         var val = node.data.Selector;
         var selectors = val.split('.');
         for(var i = 0; i < selectors.length; i++){
             if(selectors[i] !== ""){
                 if(typeof(data[selectors[i]] != 'undefined')){
                     data = data[selectors[i]];
                 } else {
                     return;
                 }
             }
         }
         const that = this;
         setTimeout(function(){
             that.component.task_to_run.reset();
         }, 0);
         return {msg_o:data};
     }

     getView(){
         return {
             data:function(){toshow;}
         };
     } // vue component?
 }

 export default {
     name:'JsonSelectComponent',
     actions:[JsonSelectComponent],
 };
</script>
