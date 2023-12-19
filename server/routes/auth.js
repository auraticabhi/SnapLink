const express = require("express");
const auth = require('../controllers/auth')

const router = express.Router();

router.post('/register', auth.authControllers.register);
router.post('/login', auth.authControllers.login);

exports.default = router;