<template>
    <div>
        <p>List mode</p>
        <div v-for="message in sortedMessages">
            <div v-for="component in viewmanager.getViews('display')">
                <component v-bind:is="component"
                           v-bind:tx="message" />
            </div>
            <!--
            <p v-if="typeof(message.name) != 'undefined' && typeof(message.message) != 'undefined'">
                <b>{{ message.name }}:</b> {{ message.message }}
            </p>
            <p v-else>
                {{ JSON.stringify(message) }}
            </p>
            -->
        </div>
        <div id="scroller"></div>
    </div>
</template>
<script>
 import Rete from 'rete';
 const sockets = require("../mixins/Sockets").default;
 var msgs = [];
 var updateInterval = null;

 class ListModeComponent extends Rete.Component {
     constructor(){
         super("list_mode");
         this.task = {
             outputs:{}
         };
         msgs.splice(0,msgs.length);
     }

     builder(node){
         var inp1 = new Rete.Input("act", "Action", sockets.actionSocket);
         var inp2 = new Rete.Input("msg", "Message", sockets.messageSocket);
         return node.addInput(inp1).addInput(inp2);
     }

     worker(node, inputs){
         var data = inputs["msg"] ? inputs["msg"][0] : null;
         if(data == null){
             return;
         }
         msgs.push(data);
         var target = document.getElementById("scroller");
         if(target != null){
             target.parentNode.scrollTop = target.offsetTop;
         }
         // document.getElementById("scroller").scrollIntoView();
     }

     getView(){
         return {
             data:function(){toshow;}
         };
     } // vue component?
 }

 export default {
     data(){
         return {
             messages:msgs
         };
     },
     props:['viewmanager'],
     name:"ListModeComponent",
     computed:{
         sortedMessages(){
             var toreturn = this.messages;
             toreturn = toreturn.sort((x,y) => x.attachmentTimestamp - y.attachmentTimestamp);
             return toreturn;
         }
     },
     actions:[ListModeComponent],
     majormodes:[{name:'ListModeComponent', component:ListModeComponent}]
 };
</script>
