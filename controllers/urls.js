const urls = require('../models/urls.json')
const HttpError = require('../models/httpError')
const fs = require('fs');

const showUrl = (req, res) => {
    res.render('urls', {urls: Object.values(urls)})
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
    const urls = getUrls()
    console.log('urls', urls)
    res.render('newUrl')
}

//function to generate new shortened url
const generateNewUrl = async (req, res) =>{
    console.log('registered new url', req.body);
    //Future, adding a Validation if input values are empty and there is already the same url or name in JSON
    const nameOfUrl = req.body.name;
    const url = req.body.url
    const shortUrl = generateRandomUrl();
    const userId = 1;
    const urlsArray = Object.values(urls);
    const id = urlsArray.length + 1

    urls[shortUrl] = {
        id: id,
        userId: userId,
        shortUrl: shortUrl,
        ...req.body,
    }
    // console.log('After update', urls);
    const updatedUrlsList = {
        ...urls,
    }
    updateUrls(updatedUrlsList);
    await res.redirect(`/urls/${id}`)
}

//Single
const singleUrl = (req, res, next) =>{
    const urlId = req.params.id;
    console.log('id', urlId)
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

module.exports = { showUrl, createUrl, generateNewUrl, singleUrl, editUrl, redirectToRealUrl, generateRandomUrl, getUrls }