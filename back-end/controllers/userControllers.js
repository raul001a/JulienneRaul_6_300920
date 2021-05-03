const bcrypt = require('bcrypt');

const User = require('../models/user');
const jwt = require('jsonwebtoken');

const CryptoJS = require("crypto-js");



// cryptage du mail
const encryptedEmail = CryptoJS.AES.encrypt("julienne@yahoo.fr", "Secret Passphrase");
console.log("trst1" + encryptedEmail)
//décryptage du mail
const decryptedEmail = CryptoJS.AES.decrypt(encryptedEmail, "Secret Passphrase");
console.log("test2" + decryptedEmail.toString(CryptoJS.enc.Utf8));


// route pour récupérer les info d'un user 
exports.findOneUser = (req, res, next) => {
    console.log(req.body);
    User.findOne({ email: req.body.email })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
};



exports.signup = (req, res, next) => {
    // ask for a strongpassword via regExp 
    const userPassword = req.body.password;
    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,15}$/; 
    console.log(userPassword.match(regexp));
    let testPassword = userPassword.match(regexp); // renvoie null quand le regExp n'est pas ok

    /*
    let testRegExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,15}$', 'g');
    let testPasswordTest = testRegExp.test(userPassword); // renvoie true quand le regExp est OK
    console.log("test match" + testPassword);
    console.log("test new Regexp" + testPasswordTest);
    */
    if (testPassword) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error:'Utilisateur déjà existant' }));
            })
            .catch(error => res.status(500).json({ error }));
    }
    else res.status(401).json({ error: 'Votre mot de passe doit comprendre au moins 8 caractères dont au moins une majuscule et un caractère spécial !' });
};

exports.login = (req, res, next) => {
    
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {                        
                        return res.status(401).json( { error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_KEY,
                            { expiresIn: '24h' }
                        )
                    });                
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};