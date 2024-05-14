const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const instructorController = require('../controllers/instructorController');

router.post('/signup', instructorController.signupInstructor);
router.post('/login', instructorController.loginInstructor);

router.get('/:instructorId/profile', instructorController.viewInstructorProfile);
router.put('/:instructorId/profile', auth.authenticate, instructorController.updateInstructorProfile);

router.post('/courses', auth.authenticate, instructorController.addNewCourse);
router.get('/:instructorId/courses', instructorController.getAllCoursesByInstructorId);
router.get('/course/:courseId', instructorController.getCourseById);
router.post('/course/:courseId/content', instructorController.addCourseContent);

router.get('/courses', instructorController.getAllCourses);
router.put('/course/:courseId/status', instructorController.updateCourseStatus);

module.exports = router;
