const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

router.route("/").get(UserController.getUsers).post(UserController.createUser);

router
  .route("/:id")
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

router.post("/login", UserController.loginUser);

module.exports = router;
