const express = require("express");
const router = express.Router();
const testFolder = './public/plugins/';
const fs = require('fs');

const plugins = [
    "tanglechat-plugins-consolelog",
];
router.get('/plugins',(req,res,next)=>{
    fs.readdir(testFolder, (err, files) => {
        console.log(files);
        const topush = [];
        files.forEach(file => {
            file = file.replace(".vue", "").replace(".js", "");
            console.log(file);
            topush.push(file);
        });
        res.json(topush);
    });
});

router.get('/plugin/:pluginId',(req,res, next)=>{
    console.log("pluginId");
    const pluginId = req.params.pluginId;
    console.log(pluginId);
    if(plugins.indexOf(pluginId) == -1){
        res.WriteHead("404");
        return;
    }
    res.sendFile(pluginId + "/index.js", {root:__dirname+"/../../node_modules"});
});

module.exports = router;
