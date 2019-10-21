const Rete = require('rete');
export default {
    actionSocket: new Rete.Socket('Action'),
    messageSocket: new Rete.Socket('Message'),
    tagsSocket: new Rete.Socket('Tags'),
    addressesSocket: new Rete.Socket('Addresses'),
};
