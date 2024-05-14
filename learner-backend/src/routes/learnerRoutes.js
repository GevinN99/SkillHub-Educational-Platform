const express = require('express');
const router = express.Router();
const learnerController = require('../controllers/learnerController');
const auth = require('../middleware/auth');

router.post('/register', learnerController.createLearner);
router.post('/login', learnerController.learnerLogin);

router.get('/profile', auth.authenticate, learnerController.viewLearnerProfile);
router.put('/profile', auth.authenticate, learnerController.updateLearnerProfile);

router.get('/all-courses', auth.authenticate, learnerController.getAllCourses);
router.get('/all-learners', learnerController.getAllLearners);
router.post('/enroll-course', auth.authenticate, learnerController.enrollCourse);
router.get('/enrollments/:learnerId', auth.authenticate, learnerController.getEnrollmentsByLearnerId);
router.delete('/enrollments', auth.authenticate, learnerController.unenrollCourse);
router.put('/enrollments/progress', auth.authenticate, learnerController.updateProgress);
router.delete('/:learnerId', learnerController.deleteLearner);

router.get(
    "/enrollments/course/:courseId/learner/:learnerId",
    learnerController.getEnrollmentByCourseIdAndLearnerId
);

router.post("/add-to-cart", auth.authenticate, learnerController.addToCart);
router.get("/cart/:learnerId", learnerController.getAllCartContents);
router.delete("/cart/:learnerId/:courseId", learnerController.removeCartContent);



module.exports = router;
