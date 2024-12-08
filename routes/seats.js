const { Router } = require("express");
const router = Router();
const { verifyToken, authorizeRoles } = require("../utils/lib");

const SeatController = require("../controllers/seats");

router.get("/match/:matchId", verifyToken, SeatController.getMatchSeats);
router.post("/reserve", verifyToken, SeatController.reserveSeat);
router.patch("/cancel/:seatId", verifyToken, SeatController.cancelReservation);

module.exports = router;
