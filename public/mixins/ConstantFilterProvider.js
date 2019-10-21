import Rete from 'rete';
const Vue = require('vue/dist/vue.js');
const sockets = require("../mixins/Sockets").default;
const InputControl = require("./InputControl").default;

class ConstantFilterProviderComponent extends Rete.Component{
    constructor(){
        super("Constant filter provider");
        this.task = {
            outputs:{
                act:'option',
                filters:'output'
            },
            init(tsk){
                // tsk.reset();
                setTimeout(()=>{
                    tsk.run();
                }, 100);
            }
        };
    }

    builder(node){
        var out1 = new Rete.Output("act", "Action", sockets.actionSocket);
        var out2 = new Rete.Output("filters", "Tags", sockets.tagsSocket);
        var numControl = new InputControl("filter");
        return node.addControl(numControl).addOutput(out1).addOutput(out2);
    }

    worker(node, inputs){
        var text = node.data.filter;
        // outputs['filters'] = text;
        // this.toexec.run(text);
        return {filters:text};
    }
}
export default ConstantFilterProviderComponent;
// export default {
//     actions:[ConstantFilterProviderComponent]
// };
