const urls = require('../models/urls.json')

const showUrl = (req, res) => {
    res.render('urls', {urls: Object.values(urls)})
}

module.exports = { showUrl }