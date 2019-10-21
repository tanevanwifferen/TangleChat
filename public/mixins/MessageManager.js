var socket = null;
class MsgManagerBackend {
    constructor(){
        this.subscriptions = {};
        const instance = this;
        if(socket == null){
            socket = new WebSocket("ws://" + window.location.host + "/api/channels");
            var messageInterval = null;
            var messages = [];
            socket.onmessage = function(msg){
                // console.log(msg);
                if(msg.data == "ping"){
                    socket.send("pong");
                    return;
                }
                if(messageInterval != null){
                    clearTimeout(messageInterval);
                    messageInterval = null;
                }
                var txs = JSON.parse(msg.data);
                for(var txid in txs){
                    var tx = txs[txid];
                    var tag = tx.tag;
                    if(!instance.subscriptions[tag]){
                        continue;
                    }

                    var handlers = instance.subscriptions[tag];
                    const newhandlers = [];
                    for(var h in handlers){
                        var handler = handlers[h];
                        if(handler.isDead){
                            continue;
                        }
                        newhandlers.push(handler);
                    }
                    if(newhandlers.length == 0){
                        socket.send(JSON.stringify({action:"unsubscribe", query:tag}));
                    }
                    instance.subscriptions[tag] = newhandlers;
                    messages.push(tx);
                }

                messageInterval = setTimeout(async function(){
                    var tosend = messages;
                    messages = [];
                    for(var s in tosend){
                        const q = s;
                        var handlers = instance.subscriptions[tag];
                        for(var h in handlers){
                            const r = handlers[h];
                            if(r.isDead){
                                continue;
                            }
                            r.handler.reset();
                            // console.log(Object.assign({},tosend[q]));
                            function sleep(ms) {
                                return new Promise(resolve => setTimeout(resolve, ms));
                            }
                            await r.handler.run(Object.assign({}, tosend[q], true, [], true));
                            await sleep(10);
                        }
                    }
                    messageInterval = null;
                },10);
            };
        }
    }

    publish(msg){
        const tosend = {
            action:"publish",
            tx:msg
        };
        socket.send(JSON.stringify(tosend));
    }

    getsubscriptions(filter){
        if(!this.subscriptions[filter]){
            return 0;
        }
        return this.subscriptions[filter].filter(x => !x.isDead).length;
    }

    addSubscription(filter, handler){
        var isTag = /^[A-Z9]{27}$/;
        if(isTag.test(filter)){
            if(!this.subscriptions[filter]){
                this.subscriptions[filter] = [];
            }
            const handlers = this.subscriptions[filter];
            const ids = handlers.map(x => x.id);
            if(ids.indexOf(handler.id) == -1){
                this.subscriptions[filter].push(handler);
            }
        } else {
            throw "Can't subscribe to anything but tags right now";
        }
        if(this.getsubscriptions(filter) == 1){
            socket.send(JSON.stringify({action:"subscribe", query:filter}));
        }
    }

    removeSubscription(filters, handler){
        if(!Array.isArray(filters)){
            filters = [filters];
        }
        for(var idx in filters){
            let filter = filters[idx];
            let handlers = this.subscriptions[filter];
            let newHandlers = [];
            for(var i = 0; i<handlers.length; i++){
                let curHandler = handlers[i];
                if(curHandler.id == handler.id){
                    continue;
                }
                newHandlers.push(curHandler);
            }
            this.subscriptions[filter] = newHandlers;
            if(this.getsubscriptions(filter) == 0){
                socket.send(JSON.stringify({action:"unsubscribe", query:filter}));
                if(typeof(this.subscriptions[filter] != 'undefined')){
                    delete this.subscriptions[filter];
                }
            }
        }
    }
}

class Counter{
    constructor(){
        this.i = 0;
    }

    getId(){
        this.i += 1;
        return this.i;
    }
}
const backend = new MsgManagerBackend();
const counter = new Counter();

class MessageManager {
    constructor(handler){
        if(typeof(handler) == 'undefined'){
            handler = null;
        }
        this.id = counter.getId();
        this.handler = handler;
        this.isDead = false;
        this.subscriptions = [];
    }

    subscribe(filter){
        if(this.handler == null){
            alert("unable to subscribe using this MessageManager, no handler provided.");
            return;
        }
        if(typeof(filter) != 'string'){
            if(Array.isArray(filter)){
                for(var i = 0; i<filter.length; i++){
                    this.subscribe(filter[i]);
                }
                return;
            }
            throw "filter must be a string";
        }
        // TODO: check valid tag or address
        this.subscriptions.push(filter);
        backend.addSubscription(filter, this);
    }

    handleMessage(msg){
        if(this.handler != null){
            this.handler(msg);
        }
    }

    publishMessage(msg){
        backend.publish(msg);
    }

    kill(){
        for(var i = 0; i < this.subscriptions.length; i++){
            backend.removeSubscription(this.subscriptions[i], this);
        }
        this.isDead = true;
    }
}

export default MessageManager;
