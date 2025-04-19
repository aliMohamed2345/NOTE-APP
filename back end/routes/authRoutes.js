const express = require('express');
const { signUpController, logInController, logOutController, profileController } = require('../controllers/authControllers');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/sign-up', signUpController);
router.post('/log-in', logInController);
router.post('/log-out', logOutController);
router.get('/profile', verifyToken, profileController);
module.exports = router;