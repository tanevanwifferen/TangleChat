const MessageManager = require("./MessageManager").default;
const Rete = require("rete");
const sockets = require("./Sockets").default;
class MessageStream extends Rete.Component {
    constructor(){
        super("Messagestream");
        this.data.render = 'vue';
        console.log('initializing messagestream');
        const comp = this;
        this.enginehook = false;
        this.task = {
            outputs:{
                act_o: "option",
                msg: "output"
            },
            init(task){
                comp.task_to_run = task;
                comp.msgManager = new MessageManager(task);
            }
        };
    }

    builder(node){
        const in1 = new Rete.Input('act_i',
                                   'Action',
                                   sockets.actionSocket);
        const in2 = new Rete.Input('filters',
                                   'Tags',
                                   sockets.tagsSocket);
        const out_1 = new Rete.Output('act_o',
                                      'Action',
                                      sockets.actionSocket);
        const out_2 = new Rete.Output('msg',
                                      'Message',
                                      sockets.messageSocket);
        const comp = this;
        this.editor.on('destroy', function(){
            for(var i = 0; i < comp.fltrs.length; i++){
                comp.fltrs[i].msgManager.kill();
            }
        });
        return node
            .addInput(in1)
            .addInput(in2)
            .addOutput(out_1)
            .addOutput(out_2);

    }

    worker(node, inputs, data, engine){
        const newfilters = inputs.filters;
        if(this.component.fltrs == undefined){
            this.component.fltrs = [];
        }
        for(var id in this.component.fltrs){
            var filter = this.component.fltrs[id];
            var found = newfilters.indexOf(filter.name);
            if(found == -1){
                this.component.fltrs[found].msgManager.kill();
            }
        }
        const instance = this;
        for(var id in inputs.filters){
            var filter = inputs.filters[id];
            var isthere = this.component.fltrs.filter(x => x.name == filter);
            if(isthere.length == 0){
                const msgManager = new MessageManager(instance.component.task_to_run);
                msgManager.subscribe(filter);
                this.component.fltrs.push({
                    name:filter,
                    msgManager: msgManager
                });
            }
        }
        if(!data){
            this.closed = ['act_o'];
        } else {
            this.closed = [];
        }
        this.component.task_to_run.reset();
        return {msg:data};
    }
}

export default MessageStream;
