const urls = require('../models/urls.json')

const showUrl = (req, res) => {
    res.render('urls', {urls: Object.values(urls)})
}

const generateRandomUrl = () =>{
    const result = Math.random().toString(36).substring(2,8);
    console.log(result)
    // return result
}

const createUrl = (req, res) =>{
    generateRandomUrl();
    res.render('newUrl');
}

//function to generate new shortened url
const generateNewUrl = (req, res) =>{
    console.log('registered nw url', req.body);
    res.redirect('/urls')
}

//Single
const singleUrl = (req, res) =>{
    const urlId = Number(req.params.id);
    const urlList = Object.values(urls);
    const url = urlList.find((url) => url.id === urlId);

    url ?
    (res.render('singleUrl.ejs', {url: url}))
    :
    res.send('seems like you have no url matches the id');
}

const editUrl = (req, res) =>{
    console.log('Edit url', req.body)
    res.send('Edited')
}

//Make sure if the shortened url exists
const redirectToRealUrl = (req, res) =>{
    const urlId = Number(req.params.id);
    const urlList = Object.values(urls);
    const url = urlList.find((url) => url.id === urlId);

    url?
    (res.redirect(url.longUrl))
    :
    (res.send('Hmm... we failed to find the URL'));
}

module.exports = { showUrl, createUrl, generateNewUrl, singleUrl, editUrl, redirectToRealUrl, generateRandomUrl }