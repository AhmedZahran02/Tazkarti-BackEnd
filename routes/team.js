const { Router } = require("express");
const router = Router();
const { verifyToken, authorizeRoles } = require("../utils/lib");

const TeamController = require("../controllers/team");

router.post("/add", verifyToken, TeamController.addTeam);
router.get("/get-all", verifyToken, TeamController.getAllTeams);

module.exports = router;
