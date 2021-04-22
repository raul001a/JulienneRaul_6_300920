const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true }, 
    likes: { type: Number },
    dislikes: { type: Number }, // vérifier une valeur par défault  default: 0
    usersLiked: { type: String }, // vérifier [{ type: String }] 
    usersDisliked: { type: String }, // vérifier [string]
});

module.exports = mongoose.model('Sauce', sauceSchema);


