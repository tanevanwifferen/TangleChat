const express = require("express");
const ws = require("express-ws");
const iota = require("../../core/iotaconnector");
const iotaUtils = require("iota.crypto.js");
const TryteEncoderDecoder = require('tryte-utf8-json-codec');
const randomstring = require("crypto-random-string");


iota.socket.on('message', (msg)=>{
    var m = msg.toString();
    split = m.split(' ');
    topic = split[0];
    var co = split[1];
    var tx = iotaUtils.utils.transactionObject(co);
    try{
        tx.parsed_body = TryteEncoderDecoder.objectFromTritifiedJSON(tx.signatureMessageFragment);
    } catch(e){
        // swallow
    }
    for(var clientId in clients){
        var cl = clients[clientId];
        if(cl.subscriptions.indexOf(tx.tag) != -1){
            cl.websocket.send(JSON.stringify([tx]));
        }
    }
});
iota.socket.subscribe("tx_trytes");
const router = express.Router();

sessionId = 0;
clients = {};

setInterval(()=>{
    for(var clientId in clients){
        var cl = clients[clientId];
        var date = new Date().getTime();
        if(date - cl.lastpong > 10 * 60 * 1000){
            cl.websocket.send("closing ws");
            cl.websocket.terminate();
            delete clients[clientId];
        }
    }
}, 10000);

function publishTransaction(tx){
    var seed = randomstring({length: 81, characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9'});
    const transfers = [
        {
            value: 0,
            address: tx.address,
            message: tx.message,
            tag:tx.tag
        }
    ];
    console.log(transfers);
    iota.iota.prepareTransfers(seed, transfers)
        .then(trytes => {
            console.log(trytes);
            //return;
            return iota.iota.sendTrytes(trytes, 3/*depth*/, 14/*minimum weight magnitude*/);
        }).then((a)=>{console.log(a);console.log('send done');}).catch(console.log);
}

/* get all channels */
router.ws("/", (ws, res)=>{
    sessionId += 1;
    var sess = sessionId;
    console.log("new websocket connection");
    var subscriptions = [];
    var updateHandler = function(message){
        if(subscriptions.indexOf(message.Tag) > -1){
            ws.send(message);
        }
    };
    console.log("creating new client");
    clients[sess] = {
        lastpong:new Date().getTime(),
        handler:updateHandler,
        websocket:ws,
        subscriptions:[]
    };

    pingTimer = setInterval(()=>{
        ws.send('ping');
        console.log('ping');
    }, 9 * 60 * 1000);

    ws.on("close", req => {
        console.log("closing ws");
        clearInterval(pingTimer);
        delete clients[sess];
    });

    ws.on("message", (msg)=>{
        if(msg == "pong"){
            clients[sess].lastpong = new Date().getTime();
            return;
        }
        try{
            var converted = JSON.parse(msg);
            switch(converted.action){
            case "subscribe":
                if(typeof(converted.query) == "string"){
                    converted.query = {tags:[converted.query]};
                }
                topic = converted.query.tags || converted.query.addresses;
                if(clients[sess].subscriptions.indexOf(topic) == -1){
                    console.log(converted.query);
                    iota.iota.findTransactionObjects(converted.query)
                        .then(transactions => {
                            try{
                                transactions = transactions.map(tx => {
                                    try{
                                        tx.parsed_body = TryteEncoderDecoder.objectFromTritifiedJSON(tx.signatureMessageFragment);
                                    } catch(e){
                                        // swallow
                                    }
                                    return tx;
                                });
                                ws.send(JSON.stringify(transactions));
                            } catch(e){
                                if(e.toString().indexOf("WebSocket is not open") > -1){
                                    console.log("disconnected");
                                }
                            }
                        })
                        .catch(err => {
                            // ...
                            console.log(err);
                            ws.send(JSON.stringify(err));
                        });
                    clients[sess].subscriptions.push(topic[0]);
                }
                break;
            case "unsubscribe":
                topic = converted.query;
                subs = clients[sess].subscriptions;
                clients[sess].subscriptions = subs.filter((elt)=>elt != topic);
                break;
            case "publish":
                var tx = converted.tx;
                publishTransaction(tx);
            }
            console.log(`message from ${sess}: ${msg}`);
        } catch(e){
            ws.send("{Error:\"failed to parse input\"}");
            console.log(e);
        }
    });
    /*
    sessionId += 1;
    console.log(`connected from sessid: ${sessionId}`);
    client = new client(sessionId, ws, context);
    clients[sessionId] = client;
*/
});

module.exports = router;
