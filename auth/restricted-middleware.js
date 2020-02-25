const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

module.exports = (req, res, next) => {
  let { username, password } = req.headers;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(({ name, message, stack }) => {
        // error is destructured into name, message, and stack
        res.status(500).json({ name, message, stack });
      });
  } else {
    res.status(400).json({ error: "You shall not pass!" });
  }
};
