const express = require('express');
const router = express.Router();
const creatorController = require('../controller/creatorController');

router.post('/creators', creatorController.createCreator);
router.get('/creators', creatorController.getAllCreators);
router.get('/creators/:id', creatorController.getCreatorById);
router.put('/creators/:id', creatorController.updateCreatorById);
router.delete('/creators/:id', creatorController.deleteCreatorById);

module.exports = router;
