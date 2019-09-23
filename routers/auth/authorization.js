const jwt = require('jsonwebtoken');
const secret = require('../../config/secret');

module.exports = (req, res, next) => {
    //get token
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
            if (err) {
                req.user = {username: decodedToken.username};
                res.status(401).json({errorMessage: 'You shall not pass'});
            } else {
                req.user = {id: decodedToken.subject, username: decodedToken.username};
                next();
            }
        })
    } else {
        res.status(401).json({errorMessage: 'No credentials provided'})
    }

};