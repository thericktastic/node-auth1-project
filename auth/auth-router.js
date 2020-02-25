const bcrypt = require("bcryptjs");
const router = require("express").Router();

const Users = require("../users/users-model");

// Registration Endpoint
router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

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

// Login Endpoint
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true; // stored in session - this is the only time .loggedIn should be touched
        req.session.username = user.username; // now the username can be accessed in the session memory
        res
          .status(200)
          .json({ message: `You are logged in, ${user.username}!` });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Error logging in" });
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({ you: "CANNOT LEAVE!" });
      } else {
        res.status(200).json({ you: "logged out successfully!" });
      }
    }); // destroy() will accept one parameter
  } else {
    res.end();
    // or res.status(200).json({ bye: "felicia" })
  }
});

module.exports = router;
