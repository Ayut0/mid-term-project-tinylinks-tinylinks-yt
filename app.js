const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const urlRoute  = require ('./routes/urls.js');
const authRoute = require ('./routes/auth.js');

app.set('view engine', 'ejs');

app.use('/auth', authRoute);
app.use('/urls', urlRoute);

app.listen(PORT, ()=> console.log('server is running'))
