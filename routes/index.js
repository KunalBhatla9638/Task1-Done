const express = require("express");
const {
  notFoundPage,
  welcome,
  getUsers,
  postUser,
  getUser,
  patchUpdateUser,
  getUserLogging,
  deleteUser,
  postUpload,
} = require("../controllers/userControllers");

const { uploadImageMiddleW } = require("../middleware/uploadImage");
const { authenticateMiddleW } = require("../middleware/authentication");
const router = express();

router.get("/", welcome);
router.post("/addUser", postUser);
router.post("/login", getUserLogging);
router.get("/users", authenticateMiddleW, getUsers);
router.get("/users/:id", authenticateMiddleW, getUser);
router.patch("/users/update/:id", authenticateMiddleW, patchUpdateUser);
router.delete("/users/delete/:id", authenticateMiddleW, deleteUser);
router.post("/upload", authenticateMiddleW, uploadImageMiddleW, postUpload);

//Page Not Found
// router.get("*", UserController.notFoundPage);
// router.post("*", UserController.notFoundPage);

module.exports = router;
