const db = require('./authDB');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../../config/secret');


router.post('/register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    if (user) {
        db.add(user)
            .then(user => res.status(201).json(user[0]))
            .catch(err => res.status(500).json({ error: "There was an error while saving the user to the database" }))
    } else {
        res.status(401).json({errorMessage: 'Invalid Credentials'});
    }
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    if (username && password) {
        db.findBy({username})
            .first()
            .then(user => {
                if(user && bcrypt.compareSync(password, user.password)){
                    const token = generateToken(user);
                    res.status(200).json(token);
                }
            })
    } else {
        res.status(401).json({errorMessage: "Invalid Credentials"})
    }
});

function generateToken(user){
    const payload = {
        subject:user.id,
        username:user.username
    };
    const options ={
        expiresIn: '1d'
    };

    return jwt.sign(payload, secret.jwtSecret, options);
}

module.exports = router;