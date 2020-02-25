const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      console.log("This is error in users-router.js router.get: ", error);
      res.status(500).json({ error: "Error retrieving users" });
    });
});

module.exports = router;