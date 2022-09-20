const { v4: uuidv4 } = require("uuid");
const users = require("../models/users.json");
const { hashPassword } = require("../helpers/users");

const showLogin = (req, res) => {
  res.render("login");
};

const loginUser = async (req, res) => {
  const receivedEmail = req.body.email;
  const receivedPassword = req.body.password;
  const email = users[receivedEmail];

  let isMatch;
  if (email) {
    isMatch = await bcrypt.compare(receivedPassword, email.password);
  }
  if (!email || !isMatch) return res.render("login.ejs");
  if (isMatch) {
    console.log("teste");
    req.session.username = email.username;
    return res.redirect("/urls");
  }
  res.send("invalid password");
};

const showRegister = (req, res) => {
  res.render("register");
};

const newUser = async (req, res) => {
  const receivedMail = req.body.email;
  const hashedPassword = hashPassword(req.body.password);
  const dataEmail = "";

  if ((receivedMail == "") | (hashedPassword == "")) {
    res.send("E-mail or password are empty.");
  }

  function checkMail() {
    fs.readFile("users.json", "utf-8", (err, data) => {
      if (err) throw err;
      dataEmail = data;
    });
  }

  checkMail();

  const findMail = dataEmail.filter((email) => receivedMail == email);

  if (findMail != "") {
    res.send("E-mail already exists.");
  }

  const newUser = {
    id: uuidv4(),
    email: receivedMail,
    password: hashedPassword,
  };
  const updatedUsers = [...jsonData.users, newUser];

  fs.writeFile("users.json", JSON.stringify({ users: updatedUsers }), (err) => {
    response.setHeader("content-type", "application/json");
    response.write(JSON.stringify(newUser));
    response.end();
  });

  console.log("users", users);
  req.session.username = receivedUsername;

  res.redirect("/urls");
};

const logout = (req, res) => {
  res.clearCookie("username");
  res.redirect("/login");
};

module.exports = {
  showLogin,
  showRegister,
  loginUser,
  newUser,
  logout,
};
