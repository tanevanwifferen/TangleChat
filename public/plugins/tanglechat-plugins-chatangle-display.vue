<template>
    <div v-if="body.payload != null">
        <span class="message"><b>{{ name }}:</b> {{ message }}</span> <span class="timestamp">{{ time }}</span>
    </div>
</template>
<script>

 var vm = {
     props:['tx'],
     computed:{
         body(){
             if(typeof(this.tx.parsed_body) != 'undefined'){
                 return this.tx.parsed_body;
             }
             return {payload:null};
         },
         name(){return this.body.payload.name},
         message(){return this.body.payload.message},
         time(){
             var date = new Date(this.tx.attachmentTimestamp);
             // Hours part from the timestamp
             var hours = date.getHours();
             while(hours.length < 2){
                 minutes = "0" + minutes;
             }
             // Minutes part from the timestamp
             var minutes = date.getMinutes().toString();
             while(minutes.length < 2){
                 minutes = "0" + minutes;
             }
             return hours + ":" + minutes;
         }
     },
     minormodes:{
         display:[{
             name:'ChatangleDisplayComponent'
         }]
     }
 }

 export default vm;
</script>

<style>
 .timestamp{
     display: none;
     color:darkgray;
 }
 .message:hover + .timestamp{
     display: inline-block;
 }
</style>
