const express = require('express');
const router = express.Router();
const { register, login, getProfile ,renderIndex, renderRegistro, renderLogin, renderHome, logout, updateUser, renderProfileU} = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.get('/index',renderIndex);
router.get('/register',renderRegistro);
router.post('/register', register);
router.get('/login', renderLogin);
router.post('/login', login);
router.get('/home',auth,renderHome);
router.get('/logout',logout);
router.get('/perfil',auth,getProfile);
router.get('/update',auth,renderProfileU);
router.put('/update',auth,updateUser);


module.exports = router;