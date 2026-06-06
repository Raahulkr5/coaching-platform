const router = require("express").Router();
const auth   = require("../middleware/authMiddleware");
const {
  getStats,
  getStudents,
  getCourses,
  createCourse,
  getRevenue,
  addStudent,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyCourses,
  enrollCourse,
  unenrollCourse,
  uploadProfilePhoto,
  updateProfile,
  deleteStudent,
  getPayments,
  createTest,
  getTests,
  deleteTest,
  submitTestResult,
  getMyTestResults,
  getAllTestResults,
} = require("../controllers/dashboardController");

// All dashboard routes require a valid JWT
router.get("/stats",    auth, getStats);
router.get("/students", auth, getStudents);
router.get("/courses",  auth, getCourses);
router.post("/courses", auth, createCourse);
router.get("/revenue",  auth, getRevenue);
router.get("/payments", auth, getPayments);
router.get("/my-courses", auth, getMyCourses);
router.get("/tests",    auth, getTests);
router.post("/tests",   auth, createTest);
router.delete("/tests/:id", auth, deleteTest);
router.post("/test-results", auth, submitTestResult);
router.get("/my-test-results", auth, getMyTestResults);
router.get("/all-test-results", auth, getAllTestResults);
router.post("/students", auth, addStudent);
router.delete("/students/:id", auth, deleteStudent);
router.post("/pay/create-order", auth, createRazorpayOrder);
router.post("/pay/verify",       auth, verifyRazorpayPayment);
router.post("/enroll",   auth, enrollCourse);
router.post("/unenroll", auth, unenrollCourse);
router.post("/profile-photo", auth, uploadProfilePhoto);
router.post("/update-profile", auth, updateProfile);

module.exports = router;
