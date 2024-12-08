const { Router } = require("express");
const router = Router();
const { verifyToken, authorizeRoles } = require("../utils/lib");

const StadiumController = require("../controllers/stadium");

router.post("/add", verifyToken, StadiumController.addStadium);
router.get("/get-all", verifyToken, StadiumController.getAllStadiums);

module.exports = router;
