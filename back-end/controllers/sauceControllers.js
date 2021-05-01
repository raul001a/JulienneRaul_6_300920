const Sauce = require('../models/sauce');
const fs = require('fs');

// create one sauce
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

// find one sauce
exports.findOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};  



// function to check if logged user is same as the one who created the sauce 

const jwt = require('jsonwebtoken');

function isOwner(sauceUserId, loggedUserId) {
    const token = loggedUserId.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (userId === sauceUserId) {
        return true;
    }
    else {
        return false;
    }
}

// check if logged user is same as sauce creator. if yes, delete the sauce
exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (isOwner(sauce.userId, req.headers.authorization)) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            }
            else return res.status(401).json({ error: 'utilisateur incorrect' })
        })
        .catch(error => res.status(500).json({ error }));
};


/* other way to check if logged user is same as sauce creator, without using isOwner
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
            else return res.status(401).json({ error: 'utilsateur incorrect' })
        })
        .catch(error => res.status(500).json({ error }));
};

*/

// update sauce checking the owner of the sauce with isOwner (delete old sauce picture) 
exports.updateOneSauce = (req, res, next) => {
    let sauceObject;
    console.log(req.body);
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => { 
            if (isOwner(sauce.userId, req.headers.authorization)) {
                if (req.file) {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) throw err;
                        console.log('Fichier supprimé !');
                    })
                    sauceObject =
                    {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    };

                }
                else {
                    sauceObject = { ...req.body };
                }
                return sauce
            }
            else return res.status(401).json({ error: 'utilisateur incorrect' })
        })
        .then(sauce => {
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

/* update sauce without checking the owner of the sauce (delete old sauce picture) 
exports.updateOneSauce = (req, res, next) => {
    let sauceObject;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if (err) throw err;
                    console.log('Fichier supprimé !');
                })
                sauceObject =
                    {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                };
                
            }
            else {
                sauceObject = { ...req.body };
             }
           return sauce 
        })
        .then(sauce => {
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                .catch(error => res.status(400).json({ error }));  })
        .catch(error => res.status(500).json({ error }));
};
*/



/* another way to update sauce without checking the owner of the sauce (delete old sauce picture)
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
*/


// get all sauce
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


// like or dislike sauce
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

