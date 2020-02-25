#### Creating from scratch


> npm init --y
<!-- Initialize package.json file -->
- make sure there's a script for:
"start": "node index.js"


<!-- Install dependencies -->
> npm i express
> npm i knex
> npm i sqlite3
> npm i dotenv
> npm i bcryptjs


> knex init
<!-- Initialize knex file -->
- change connection: { filename: ________ } to destination/location of database file
- add useNullAsDefault: true
- optional: add migrations and seeds directories
    migrations: {
      directory: "./data/database/migrations"
    },
    seeds: {
      directory: "./data/database/seeds"
    }


# create server.js file
const express = require("express");

const server = express();

server.get("/", (req, res) => {
    res.json({ api: "Let's do this" })
})

module.exports = server;



# create index.js file
const server = require("./data/api/server.js"); 

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`\n*** Running on port: ${port} ***\n`)
})


# create migrations file
knex migrate:make create_db_file

build out migration file
make sure the exports.down command is the opposite of exports.up

knex migrate:latest 


# create dbConfig.js file in .db3 directory
const knex = require("knex");

const configOptions = require("../knexfile.js").development;

module.exports = knex(configOptions);


<!-- Next, we set up a basic router to verify we have access to the database -->

# set up router for testing database file
const router = require("express").Router();

const db = require("../database/dbConfig.js");

router.get("/", (req, res) => {
    db.select("*").from("users").then(users => {
        console.log("This is users in router.get(all users): ", users)
        res.status(200).json(users)
    }).catch(error => {
        console.log("This is error in router.get(all users): ", error)
        res.status(500).json({ error: "Error retrieving users"})
    })
})

module.exports = router;

<!-- To accomplish the next step, the code above will need changing -->
<!-- No db import, no reference to db in the router.get -->

# setup router model for accessing db functions
const db = require("../database/dbConfig.js");

module.exports = {
    find
}

function find() {
    return db("users").select("id", "username", "password");
}

# set up router for authentication



#### Implementing Sessions/cookies

<!-- install session functionality -->
> npm i express-sesssion
> npm i connect-session-knex

# set up global middleware,
<!-- in this case the middleware is in its own file configure-middleware.js -->
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSession = require("connect-session-knex")(session); // remember to curry and pass the session

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


# Restricted middleware
<!-- set up restricted middleware to verify user has the cookie sent by the server as stored in req.session -->

module.exports = (req, res, next) => {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.status(401).json({ you: "shall not pass!" });
  }
};

<!-- install connect-session-knex -->
