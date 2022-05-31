const jwt = require('jsonwebtoken');
const { login } = require('./db');


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

function generateAccessToken(username, password) {
    ///Check if the password is correct
    if (!login(username, password)) {
        return null
    }

    /// Return valid token
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '18000s' })
}

module.exports = {
    generateAccessToken, authenticateToken
}