<script>
 import Rete from 'rete';
 const sockets = require("../mixins/Sockets").default;
 const jsonConverter = require("tryte-utf8-json-codec");
 const MessageManager = require("../mixins/MessageManager").default;

 class TxBuilderComponent extends Rete.Component {
     constructor(){
         super("tx_builder");
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
         var inp2 = new Rete.Input("tag", "Tag", sockets.tagsSocket);
         var inp3 = new Rete.Input("msg", "Message", sockets.messageSocket);
         var inp4 = new Rete.Input("address", "Address", sockets.addressesSocket);
         var out1 = new Rete.Output("act_o", "Action", sockets.actionSocket);
         var out2 = new Rete.Output("msg_o", "Message", sockets.messageSocket);
         return node.addInput(inp1)
                    .addInput(inp2)
                    .addInput(inp3)
                    .addInput(inp4)
                    .addOutput(out1)
                    .addOutput(out2);
     }

     worker(node, inputs, data){
         const that = this;
         var smf = jsonConverter.tritifiedJSONFromObject(inputs['msg'][0]);
         if(smf.length > 2187){
             alert("can't send more than one tx at this time");
             this.locked = ['act_o'];
             return;
         }
         /*
         while(smf.length < 2187){
             smf = smf + "9";
         }
         */
         var address = "";
         if(typeof(inputs['address']) != 'undefined'
            && typeof(inputs['address'][0]) != 'undefined'){
             address = inputs['address'][0];
         }
         if(address == ""){
             while(address.length < 81){
                 address = address + "9";
             }
         }
         const tosend = {
             tag:inputs['tag'][0],
             address:address,
             message:smf
         }
         setTimeout(function(){
             that.component.task_to_run.reset();
         }, 0);
         var msgm = new MessageManager();
         msgm.publishMessage(tosend);
         msgm.kill();
         return {msg_o:tosend};
     }

     getView(){
         return {
             data:function(){toshow;}
         };
     } // vue component?
 }

 export default {
     name:'TxBuilderComponent',
     actions:[TxBuilderComponent],
 };
</script>
