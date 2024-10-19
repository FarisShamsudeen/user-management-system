const express = require('express');
const router = express.Router();
const adminController = require('../Controller/adminController');
const adminAuth = require('../Middleware/adminAuth');

router.get('/login', adminAuth.isLogin, adminAuth.preventUserFromAdminPage, adminController.loadLogin);
router.post('/login', adminAuth.isLogin, adminAuth.preventUserFromAdminPage, adminController.adminLogin);

router.get('/dashboard', adminAuth.checkSession, adminController.loadDashboard);
router.post('/edit-user', adminAuth.checkSession, adminController.editUser);
router.post('/delete-user/:id', adminAuth.checkSession, adminController.deleteUser);
router.post('/add-user', adminAuth.checkSession, adminController.addUser);
router.get('/search-users', adminAuth.checkSession, adminController.searchUsers);

router.get('/logout', adminAuth.checkSession, adminController.logout);

module.exports = router;
