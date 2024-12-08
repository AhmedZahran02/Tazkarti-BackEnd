const { Router } = require("express");
const router = Router();
const { verifyToken, authorizeRoles } = require("../utils/lib");

const RefereeController = require("../controllers/referee");

router.post("/add", verifyToken, RefereeController.addReferee);
router.get(
  "/get-main-referees",
  verifyToken,
  RefereeController.getMainReferees
);
router.get("/get-linesmen", verifyToken, RefereeController.getLinesmen);

module.exports = router;
