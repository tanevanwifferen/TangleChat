const Vue = require("vue/dist/vue.js");
const axios = require("axios");

class PluginManager{
    getPlugins(){
        if(this.plugins == undefined){
            this.plugins = axios.get('/plugins');
            this.plugins.then((elts)=>{
                for(var e in elts.data){
                    var elt = elts.data[e];
                    Vue.component(elt, function (resolve) {
                        require(['../components/' + elt + ".vue"], resolve);
                    });
                }
            });
        }
        return this.plugins;
    }
}

const p = new PluginManager();
export default p;
