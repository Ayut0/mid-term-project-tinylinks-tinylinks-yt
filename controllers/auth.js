const { v4: uuidv4 } = require("uuid");
const users = require("../models/users.json");
const bcrypt = require('bcrypt')
const { hashPassword } = require("../helpers/users");
const fs = require('fs');
const HttpError = require("../models/httpError");

const getUser = (name) => {
  const usersArray = Object.values(users);
  const user = usersArray.filter((user) => user.name === name);
  // console.log(user)
  return user;
}

const landingPage = (req, res) =>{
  res.render("login")
}

const showLogin = (req, res) => {
  res.render("login");
};

const loginUser = async (req, res) => {
  // console.log(req.body)
  const receivedEmail = req.body.email;
  const receivedPassword = req.body.password;
  const usersArray = Object.values(users);
  const email = usersArray.find((user) => user.email === receivedEmail)
  // console.log('usersArray', usersArray)
  console.log('email', email)
  let isMatch;
  if (email) {
    isMatch = await bcrypt.compare(receivedPassword, email.password);
  }
  console.log(isMatch)
  if (!email || !isMatch) return res.render("login.ejs");
  if (isMatch) {
    console.log("teste");
    req.session.username = email.name;
    req.session.isLoggedIn = true;
    console.log('name', req.session.name, 'loggedIn', req.session.isLoggedIn)
    return res.redirect("/urls");
  }
  await res.send("invalid password");
};

const showRegister = (req, res) => {
  res.render("register");
};

const newUser = async (req, res, next) => {
  console.log('body', req.body)
  const receivedMail  = req.body.email;
  const receivedName = req.body.name
  const receivedPassword = req.body.password
  const hashedPassword = await hashPassword(receivedPassword);
  const id = uuidv4()
  const usersArray = Object.values(users);
  console.log('name', receivedName, 'receivedMail', receivedMail, 'password', req.body.password)

  if ((receivedMail === "")) {
    // res.send("E-mail is empty.");
    //http error 406 means the information given by user is not acceptable
    return next(
      new HttpError("E-mail is empty. Make sure you put valid email", 406)
    )
  }else if(receivedName === ''){
    // res.send("Please enter the username");
    return next(
      new HttpError("Please enter the username. Make sure you put valid email", 406)
    )
  }else if(receivedPassword === ''){
    // res.send("Password is empty.");
    return next(
      new HttpError("Password is empty. Make sure you put valid email", 406)
    )
  }

  const findMail = usersArray.filter((user) => receivedMail === user.email);
  // console.log('filtered email', findMail)

  if (findMail.length !== 0) {
    // res.send("E-mail already exists.");
    return next(
      new HttpError("E-mail already exists.", 406)
    )
  }

  // console.log('Pass!!')
  users[id] = {
    id: id,
    name: receivedName,
    email: receivedMail,
    password: hashedPassword,
  };


  const updatedUsers = { ...users };
  // console.log('updated users', updatedUsers)

  fs.writeFileSync("models/users.json", JSON.stringify(updatedUsers, null, 2));

  req.session.name = receivedName;
  await res.redirect("/urls");
};

const logout = async (req, res) => {
  await res.clearCookie("username");
  await res.redirect("/auth/login");
};

const isLoggedIn = async (req, res, next) =>{
  console.log(req.session, req.session.isLoggedIn);
  if(!req.session.isLoggedIn){
    return res.redirect('/auth/login')
  }
  const loggedInUserName = req.session.name
  getUser(loggedInUserName)
  await next()
}

module.exports = {
  landingPage,
  showLogin,
  showRegister,
  loginUser,
  newUser,
  logout,
  isLoggedIn,
  getUser
};
