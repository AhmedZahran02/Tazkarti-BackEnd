const { Router } = require("express");
const router = Router();
const { verifyToken, authorizeRoles } = require("../utils/lib");

const UserContoller = require("../controllers/user");
const { verifyToken, authorizeRoles } = require("../utils/lib");

router.patch("/update", verifyToken, UserContoller.updateUser);

router.get(
  "/get-all",
  verifyToken,
  authorizeRoles(["admin"]),
  UserContoller.getUsers
);

module.exports = router;
