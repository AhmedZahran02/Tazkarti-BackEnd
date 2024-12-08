const { Router } = require("express");
const router = Router();

const AuthController = require("../controllers/auth");
const { verifyToken, authorizeRoles } = require("../utils/lib");

router.get("/", (req, res, next) => {
  res.json({ message: "Welcome to the Auth API!" });
});
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.signIn);
router.patch(
  "/activate/:username",
  verifyToken,
  authorizeRoles(["admin"]),
  AuthController.approvNewUser
);
router.delete("/remove/:username", verifyToken, AuthController.removeUser);
router.get("/cities", AuthController.getCities);

module.exports = router;
