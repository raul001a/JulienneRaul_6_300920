const express = require('express');


const mongoose = require('mongoose');

const mongoSanitize = require('express-mongo-sanitize');

require('dotenv').config();

const sauceRoutes = require('./routes/sauceRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.MG_USERNAME}:${process.env.MG_PASSWORD}@${process.env.MG_CLUSTERNAME}.3ksjz.mongodb.net/${process.env.MG_DATABASENAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));




app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

/*
app.use(mongoSanitize({
    replaceWith: '_'
}));
*/

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;