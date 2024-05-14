const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.post('/signup', adminController.adminSignup);
router.post('/login', adminController.adminLogin);

router.get('/profile', auth.authenticate, adminController.viewAdminProfile);
router.put('/profile', auth.authenticate, adminController.updateAdminProfile);

router.get('/all-courses', auth.authenticate, adminController.getAllCourses);
router.get('/all-students', adminController.getAllStudents);
router.put('/course/:courseId/status', adminController.updateCourseStatus);
router.delete('/learner/:learnerId', adminController.deleteLearner);

module.exports = router;
