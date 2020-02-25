const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexStore = require("connect-session-knex")(session); // remember to curry and pass the session

// needed for storing sessions in the database
const knex = require("../database/dbConfig.js");

const sessionConfig = {
  name: "session-cookie",
  secret: "dont show it to anyone",
  resave: false, //
  saveUninitialized: true, // related to GDPR compliance - front end application should prompt user to let them know cookies are used and allow user to decide whether or not cookies are ok
  cookie: {
    // now that the user has said yes to cookies, how long do we allow the user's cookie to last
    // even with a good cookie, the server can still bounce you out if the session ends or is destroyed
    maxAge: 1000 * 60 * 10,
    secure: false, // should be true in production
    httpOnly: true // true means JS can't touch the cookie - important because browser extensions run on JS, so we don't want vulnerabilities to be introduced by allowing JS to interact with the cookie
  },
  store: new KnexStore({
    // this library sits between the session library and whatever storage mechanism I'm using
    knex, // same as knex: knex, referring to the importing of dbConfig.js
    tablename: "sessions",
    createTable: true, // if "tablename: sessions" doesn't exist, this line gives permission to create it
    sidfieldname: "sid", // name of column for session id = sid
    clearInterval: 1000 * 60 * 10 // every 10 minutes, check to see if any sessions have expired
  })
};

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(session(sessionConfig)); // turns on the session middleware
  // at this point there is a req.session object created by express-session
};
