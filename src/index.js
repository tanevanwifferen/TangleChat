const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("../app.config");

const app = express();
var expressWs = require('express-ws')(app);
app.use(bodyParser.json());
app.use(cors());


app.use(express.static('dist'));

const channels = require("./routes/api/channels");
app.use("/api/channels", channels);

const files = require("./routes/index");
app.use("/", files);

// const views = require("./routes/index");

const port = config.node_port;
app.listen(port, ()=> console.log(`Server started on port ${port}`));
