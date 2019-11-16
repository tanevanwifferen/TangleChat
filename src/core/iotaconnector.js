const kut = require("iota.crypto.js");
const iota = require("@iota/core");
console.log(iota);
const composeAPI = iota.composeAPI;
const config = require("../../app.config.js");
const zmq = require("zeromq/v5-compat");

const url = config.iota_host;
const api_port = config.iota_api_port;
const iotaApi = composeAPI({
    provider: 'http://' + url + ':' + api_port
});

iotaApi.getNodeInfo()
    .then((e)=>{})
    .catch(error => {
        console.log(`Request error: ${error.message}`);
    });

sock = zmq.socket("sub");
sock.connect("tcp://" + url + ":"+config.iota_rpc_port);
module.exports = {iota:iotaApi, socket:sock};
// ANNOUNCEMENTS99999999999999
// CHATANGLE999999999999999999
