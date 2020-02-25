const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const sessionConfig = {
  name: "session-cookie",
  secret: "dont show it to anyone",
  resave: false, //
  saveUninitialized: true, // related to GDPR compliance - front end application should prompt user to let them know cookies are used and allow user to decide whether or not cookies are ok
  cookie: {
    // now that the user has said yes to cookies, how long do we allow their cookie to last
    // even with a good cookie, the server can still bounce you out if the session ends or is destroyed
    maxAge: 1000 * 60 * 10,
    secure: false, // should be true in production
    httpOnly: true // true means JS can't touch the cookie - important because browser extensions run on JS, so we don't want vulnerabilities to be introduced by allowing JS to interact with the cookie
  }
};

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(session(sessionConfig)); // turn on the session middleware
  // at this point there is a req.session object created by express-session
};
