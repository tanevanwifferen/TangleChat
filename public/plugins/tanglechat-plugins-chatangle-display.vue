<template>
    <div v-if="body.payload != null">
        <p><b>{{ name }}:</b> {{ message }}</p>
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
         message(){return this.body.payload.message}
     },
     minormodes:{
         display:[{
             name:'ChatangleDisplayComponent'
         }]
     }
 }

 export default vm;
</script>
