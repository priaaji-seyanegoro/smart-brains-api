const handleSignin = (req, res, db, bcrypt, validationResult) => {
  const { email, password } = req.body;
  //   if (!email || !password) {
  //     return res.status(400).json("incorrect form submission");
  //   }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json("unable to getting user"));
      } else {
        res.status(400).json("Email or Password Wrong");
      }
    })
    .catch(err => res.status(400).json("wrong credential"));
};

module.exports = {
  handleSignin: handleSignin
};
