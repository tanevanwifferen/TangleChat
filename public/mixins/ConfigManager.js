const ls = require('local-storage');
const config = require("../../app.config");

class ConfigManager{
    getConfigs(){
        var data = ls('channels');
        if(data == null){
            data = config.default_channels;
            ls('channels', data);
        }
        return data;
    }

    setConfig(newConfig){
        let configs = this.getConfigs();
        console.log(newConfig);
        if(typeof(newConfig.id) === 'number'){
            for(var i = 0; i<configs.length; i++){
                let elt = configs[i];
                if(configs[i].id == newConfig.id){
                    configs[i] = newConfig;
                    return ls('channels', configs);
                }
            }
        }
        var maxId = 0;
        for(var i = 0; i < configs.length; i++){
            if(configs[i].id >= maxId){
                maxId = configs[i].id;
            }
        }
        newConfig.id = maxId + 1;
        configs.push(newConfig);
        return ls('channels', configs);
    }

    deleteConfig(toRemove){
        var id = toRemove;
        if(typeof(toRemove) === "object"){
            if(typeof(toRemove["id"]) === 'number'){
                id = toRemove.id;
            }
        }
        if(typeof(id) !== "number"){
            throw "error: can't delete this config";
        }
        let configs = this.getConfigs();
        let toset = [];
        for(var i = 0; i < configs.length; i++){
            let config = configs[i];
            if(config.id != id){
                toset.push(config);
            }
        }
        return ls('channels', toset);
    }
}

export default ConfigManager;
