const showLogin = (req, res) => {
  res.render("login");
};

const showRegister = (req, res) => {
  res.send("test register");
};

module.exports = { showLogin, showRegister };
