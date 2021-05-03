const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauceControllers');



router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.get('/:id', auth, sauceCtrl.findOneSauce );
router.put('/:id', auth, multer, sauceCtrl.updateOneSauce );
router.delete('/:id', auth, sauceCtrl.deleteOneSauce );
router.get('/', auth, sauceCtrl.getAllSauce);




module.exports = router;