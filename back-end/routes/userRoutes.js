const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userControllers');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);



// route pour tester mongosanitize 
router.get('/', userCtrl.findOneUser);

module.exports = router;