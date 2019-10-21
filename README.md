# TangleChat
If you manage to get this running, you are probably a developer, and we could
use your help.

# The goal:
To have a fully libre and free social network that runs using the IOTA gossip
protocol. It should be fully scriptable, extensible, customizable. For now only
public messages are supported, but encryption shouldn't be too hard to
implement. Don't create your own plugins until the api is fully finalized and
documented though, this is merely a proof of concept.

# TODO:
- symmetric encryption (group chats)
- asymmetric encryption (private messaging)
- API keys (multiple clients on one host)
- server-side scripts
- documentation

# Requirements:
- webpack
- nodejs
- npm
- an iota node, with RPC and HTTP api exposed

# To run:
`npm install`

`webpack`

`npm start`

Then visit `http://localhost:5000` in your browser.

# Configuration:
See app.config.js