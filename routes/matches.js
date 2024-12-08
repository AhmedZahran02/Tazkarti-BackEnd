const { Router } = require("express");
const router = Router();
const { verifyToken, authorizeRoles } = require("../utils/lib");

const MatchController = require("../controllers/match");
router.post("/create", verifyToken, MatchController.createMatch);
router.patch("/edit", verifyToken, MatchController.editMatch);
router.get("/", MatchController.getAllMatches); // New route for getting all matches
router.get("/:matchId", MatchController.matchDetails);
router.get("/get-seats/:matchId", MatchController.fetchSeatingLayout); // New route for getting all matches

module.exports = router;
