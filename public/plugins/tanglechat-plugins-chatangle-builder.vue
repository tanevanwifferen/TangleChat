<script>
 import Rete from 'rete';
 const sockets = require("../mixins/Sockets").default;
 const InputControl = require("../mixins/InputControl").default;
 class ChatangleBuilderComponent extends Rete.Component {
     constructor(){
         super("chatangle_builder");
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
         var strControl = new InputControl("Name");
         return node.addControl(strControl)
                    .addInput(inp1)
                    .addInput(inp2)
                    .addOutput(out1)
                    .addOutput(out2);
     }

     worker(node, inputs, data){
         var name = node.data.Name;
         const that = this;
         setTimeout(function(){
             that.component.task_to_run.reset();
         }, 0);

         return {
             msg_o:{
                 app:'Chatangle',
                 apiVersion:1,
                 payload:{
                     name:name,
                     message:inputs['msg'][0]
                 }
             }
         };
     }

     getView(){
         return {
             data:function(){toshow;}
         };
     } // vue component?
 }

 export default {
     name:'ChatangleBuilderComponent',
     actions:[ChatangleBuilderComponent],
 };
</script>
