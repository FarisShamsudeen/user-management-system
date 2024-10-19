const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const userAuth = require('../Middleware/userAuth')

router.get('/login', userAuth.redirectIfLoggedIn, userController.loadLogin)
router.post('/login', userAuth.redirectIfLoggedIn, userController.userLogin)

router.get('/register', userAuth.redirectIfLoggedIn, userController.loadRegister)
router.post('/register', userAuth.redirectIfLoggedIn, userController.registerUser)


router.get('/home', userAuth.checkSession, userController.loadHome)

router.get('/logout', userAuth.checkSession, userController.logout)


module.exports = router