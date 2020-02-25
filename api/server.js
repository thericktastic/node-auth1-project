const express = require("express");

const apiRouter = require("./api-router.js");
const configureMiddleware = require("./configure-middleware");

// 
const server = express();

// We pass the express server to configureMiddleware to apply all middleware in the configMiddleware.js file
configureMiddleware(server);

// 
server.use("/api", apiRouter);

// this code allows us to check whether the server is online
server.get("/", (req, res) => {
    console.log(req.session)
    res.json({ api: "Let's do this" })
})

module.exports = server;