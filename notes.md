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

<!-- To accomplish the next step, the code above will need changing
No db import, no reference to db in the router.get -->

# setup router model for accessing db functions
const db = require("../database/dbConfig.js");

module.exports = {
    find
}

function find() {
    return db("users").select("id", "username", "password");
}

# set up router for authentication
