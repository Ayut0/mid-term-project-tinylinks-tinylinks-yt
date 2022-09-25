const { v4: uuidv4 } = require("uuid");
const users = require("../models/users.json");
const urls = require('../models/urls.json')
const bcrypt = require('bcrypt')
const { hashPassword } = require("../helpers/users");
const fs = require('fs');
const HttpError = require("../models/httpError");

const getUser = (name) => {
  const usersArray = Object.values(users);
  const user = usersArray.filter((user) => user.name === name);
  // console.log('loggedIn', user)
  return user;
}

const landingPage = (req, res) =>{
  const user = ''
  const message = ''
  res.render("login", {user: user, message: message})
}

const showLogin = (req, res) => {
  const user = ''
  const message = ''
  res.render("login", {user: user, message: message});
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
  if (!email || !isMatch){
    const user = ''
    return res.render("login.ejs", {user: user ,message: 'Invalid email or password'});
  } 
  if (isMatch) {
    console.log("teste");
    req.session.username = email.name;
    req.session.name = email.name;
    req.session.isLoggedIn = true;
    console.log('name', req.session.name, 'loggedIn', req.session.isLoggedIn)
    return res.redirect("/urls");
  }
  await res.send("invalid password");
};

const showRegister = (req, res) => {
  const user = ''
  res.render("register", {user: user});
};

const newUser = async (req, res, next) => {
  // console.log('body', req.body)
  const receivedMail  = req.body.email;
  const receivedName = req.body.name
  const receivedPassword = req.body.password
  const hashedPassword = await hashPassword(receivedPassword);
  const id = uuidv4()
  const usersArray = Object.values(users);
  // console.log('name', receivedName, 'receivedMail', receivedMail, 'password', req.body.password)

  if ((receivedMail === "")) {
    //http error 406 means the information given by user is not acceptable
    return next(
      new HttpError("E-mail is empty. Make sure you put valid email", 406)
    )
  }else if(receivedName === ''){
    return next(
      new HttpError("Please enter the username. Make sure you put valid username", 406)
    )
  }else if(receivedPassword === ''){
    return next(
      new HttpError("Password is empty. Make sure you put valid email", 406)
    )
  }

  const findMail = usersArray.filter((user) => receivedMail === user.email);

  if (findMail.length !== 0) {
    return next(
      new HttpError("E-mail already exists.", 406)
    )
  }

  users[id] = {
    id: id,
    name: receivedName,
    email: receivedMail,
    password: hashedPassword,
  };

  const updatedUsers = { ...users };

  fs.writeFileSync("models/users.json", JSON.stringify(updatedUsers, null, 2));

  req.session.name = receivedName;
  req.session.isLoggedIn = true;
  await res.redirect("/urls");
};


const isLoggedIn = async (req, res, next) =>{
  // console.log('session info' ,req.session, req.session.isLoggedIn);
  const loggedInUserName = req.session.name;
  // console.log('loggedInUser', loggedInUserName);
  if(!req.session.isLoggedIn){
    return res.redirect('/auth/login')
  }
  getUser(loggedInUserName)
  await next()
}

const restrictedView = async(req, res, next) =>{
  // console.log('session info' ,req.session, req.session.isLoggedIn);
  const loggedInUserName = req.session.name;
  // console.log('loggedInUser', loggedInUserName);
  const urlsArray = Object.values(urls)

  if(!loggedInUserName){
    return res.render('urls', {urls: urlsArray, user: ''})
  }
  
  await next();
}
const logout = async (req, res) => {
  req.session.isLoggedIn = false;
  req.session.username = '';
  req.session.name = '';
  await res.clearCookie("username");
  await res.redirect("/auth/login");
};

module.exports = {
  landingPage,
  showLogin,
  showRegister,
  loginUser,
  newUser,
  logout,
  isLoggedIn,
  getUser,
  restrictedView
};
