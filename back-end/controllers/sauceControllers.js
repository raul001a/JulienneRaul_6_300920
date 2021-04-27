const Sauce = require('../models/sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};


exports.findOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};  



// pour vérifier que l'userId de la personne connectée est le même que celui qui a créé la sauce 

const jwt = require('jsonwebtoken');

// pas réussi à m'en servir
function isOwner(sauceUserId) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (userId === sauceUserId) {
        return true;
    }
    else {
        return false;
    }
}



/* met à jour et enlève l'ancienne photo*/

exports.updateOneSauce = (req, res, next) => {
    let sauceObject;
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if (err) throw err;
                    console.log('Fichier supprimé !');
                });
            })
            .catch(error => res.status(500).json({ error }));
        sauceObject =
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        };
        
    }
else {
        sauceObject = { ...req.body };
        
}
Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};
   



exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const token = req.headers.authorization.split(' ')[1];
            console.log(token);
            console.log(sauce.userId);
            const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            const userId = decodedToken.userId;
            if (userId === sauce.userId) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            }  
            else console.log("utilisateur non autorisé")
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeSauce =
    (req, res, next) => {
        console.log(req.body.userId);
        console.log(req.body.like)
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                console.log(sauce)
                if (req.body.like === 1) {
                    Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
                        .then(() => res.status(200).json({ message: 'like ajouté !' }))
                        .catch(error => res.status(400).json({ error })); 
                }
                if (req.body.like === -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } })
                        .then(() => res.status(200).json({ message: 'dislike ajouté !' }))
                        .catch(error => res.status(400).json({ error }));
                }
                if (req.body.like === 0) {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                            .then(() => res.status(200).json({ message: 'like supprimé !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                            .then(() => res.status(200).json({ message: 'like supprimé !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    
                }
            })
            .catch(error => res.status(400).json({ error }));
       
    };

