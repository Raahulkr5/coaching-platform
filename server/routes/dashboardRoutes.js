const router = require("express").Router();
const auth   = require("../middleware/authMiddleware");
const {
  getStats,
  getStudents,
  getCourses,
  getRevenue,
  addStudent,
  processPayment,
  getMyCourses,
  enrollCourse,
  unenrollCourse,
  uploadProfilePhoto,
  updateProfile,
  deleteStudent,
  getPayments,
} = require("../controllers/dashboardController");

// All dashboard routes require a valid JWT
router.get("/stats",    auth, getStats);
router.get("/students", auth, getStudents);
router.get("/courses",  auth, getCourses);
router.get("/revenue",  auth, getRevenue);
router.get("/payments", auth, getPayments);
router.get("/my-courses", auth, getMyCourses);
router.post("/students", auth, addStudent);
router.delete("/students/:id", auth, deleteStudent);
router.post("/pay",      auth, processPayment);
router.post("/enroll",   auth, enrollCourse);
router.post("/unenroll", auth, unenrollCourse);
router.post("/profile-photo", auth, uploadProfilePhoto);
router.post("/update-profile", auth, updateProfile);

module.exports = router;
