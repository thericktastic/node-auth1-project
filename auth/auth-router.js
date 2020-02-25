const bcrypt = require("bcryptjs");
const router = require("express").Router();

const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  let user = req.body;

  console.log("This is req.body in auth-router.js router.post: ", req.body)

  Users.add(user)
    .then(savedUser => {
      res.status(201).json(savedUser);
    })
    .catch(error => {
      console.log(
        "This is error in auth-router.js router.post(register): ",
        error
      );
      res.status(500).json({ error: "Error saving user" });
    });
});

module.exports = router;