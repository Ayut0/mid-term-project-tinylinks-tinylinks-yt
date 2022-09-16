
const showLogin = (req, res) => {
    res.send('test login');
}

const showRegister = (req, res) => {
    res.send('test register');
}

module.exports = { showLogin , showRegister }