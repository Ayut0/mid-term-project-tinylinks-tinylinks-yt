const urls = require('../models/urls.json')
const HttpError = require('../models/httpError')
const fs = require('fs');
const { getUser } = require('./auth');

const showUrl = (req, res) => {
    //Have to display urls based on logged in user. I did not set middleware fot this function in routes
    const urlsArray = Object.values(urls)
    const loggedInUserName = req.session.name
    console.log('user', loggedInUserName)
    const user = getUser(loggedInUserName)
    let urlsCreatedByUser;
    if(user){
        urlsCreatedByUser = urlsArray.filter((url) => url.userId === user[0].id)
    }
    res.render('urls', {urls: Object.values(urls), user: user})
}

const generateRandomUrl = () =>{
    const result = Math.random().toString(36).substring(2,8);
    console.log(result)
    return result
}

//Read current urls
const getUrls = () =>{
    const urlsData = fs.readFileSync('models/urls.json', 'utf-8');
    console.log('urlData', urlsData);
    return urlsData;
}

//Update urls
const updateUrls = (updateUrlsList) =>{
    fs.writeFileSync('models/urls.json', JSON.stringify(updateUrlsList, null, 2))
}

const createUrl = (req, res) =>{
    console.log('req', req.session.username)
    const loggedInUserName = req.session.username
    const user = getUser(loggedInUserName)
    console.log('user' ,user)
    const urls = getUrls()
    // console.log('urls', urls)
    res.render('newUrl')
}

//function to generate new shortened url
const generateNewUrl = async (req, res) =>{
    console.log('registered new url', req.body);
    //Future, adding a Validation if input values are empty and there is already the same url or name in JSON
    const shortUrl = generateRandomUrl();
    const urlsArray = Object.values(urls);
    const id = urlsArray.length + 1
    const loggedInUserName = req.session.name;
    const user = getUser(loggedInUserName);
    const userId = user[0].id;
    const creator = user[0].name

    urls[shortUrl] = {
        id: id,
        userId: userId,
        shortUrl: shortUrl,
        creator: creator,
        ...req.body,
    }
    // console.log('After update', urls);
    const updatedUrlsList = {
        ...urls,
    }
    updateUrls(updatedUrlsList);
    await res.redirect(`/urls/${shortUrl}`)
}

//Single
const singleUrl = (req, res, next) =>{
    const urlId = req.params.id;
    const urlList = Object.values(urls);
    const url = urlList.find((url) => url.shortUrl === urlId);

    if(!url){
        return next(
            new HttpError('seems like you have no url matches the id', 404)
        )
    }
    res.render('singleUrl.ejs', {url: url})
}

//Edit
const editUrl = async (req, res) =>{
    const urlId = req.params.id;
    const target = urls[urlId];
    const updatedTarget = { ...target, ...req.body };

    urls[urlId] = updatedTarget
    updateUrls(urls);
    await res.redirect('/urls')
}

//delete
const deleteUrl = async (req, res, next) =>{
    const urlId = req.params.id;
    console.log('id', urlId)
    console.log('before delete', urls)
    delete urls[urlId];
    console.log('after deleted', urls);
    updateUrls(urls);

   await res.redirect('/urls')
}
//Make sure if the shortened url exists
const redirectToRealUrl = (req, res, next) =>{
    const urlId = Number(req.params.id);
    const urlList = Object.values(urls);
    const url = urlList.find((url) => url.id === urlId);

    if(!url){
        return next(
            new HttpError('Hmm... we failed to find the URL', 404)
        )
    }

    res.redirect(url.longUrl)
}

module.exports = { showUrl, createUrl, generateNewUrl, singleUrl, editUrl, redirectToRealUrl, generateRandomUrl, getUrls, deleteUrl }