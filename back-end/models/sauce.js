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
    dislikes: { type: Number }, // v�rifier une valeur par d�fault  default: 0
    usersLiked: { type: String }, // v�rifier [{ type: String }] 
    usersDisliked: { type: String }, // v�rifier [string]
});

module.exports = mongoose.model('Sauce', sauceSchema);


