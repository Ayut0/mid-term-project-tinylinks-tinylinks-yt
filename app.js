const express = require('express');
const app = express();
const PORT = 3000;
const cookieSession = require('cookie-session')
const urlRoute  = require ('./routes/urls.js');
const authRoute = require ('./routes/auth.js');
const { landingPage } = require('./controllers/auth')

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(
    cookieSession({
        name: 'session',
        keys: ['key1']
    })
)
app.get('/', landingPage)
app.use('/auth', authRoute);
app.use('/urls', urlRoute);
// app.use(bodyParser.json())

//error handling
app.use((error, req, res, next) =>{
    if(res.headerSent){
        return next(error);
    }
    console.log(error);
    // error 500 means the server encounters an unexpected condition (Internal server error)
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred'})
})

app.listen(PORT, ()=> console.log(`server is running on ${PORT}`))
