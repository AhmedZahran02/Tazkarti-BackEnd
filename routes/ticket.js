const { Router } = require("express");
const router = Router();
const { verifyToken, authorizeRoles } = require("../utils/lib");

const TicketController = require("../controllers/ticket");

router.get("/:userId", verifyToken, TicketController.getTickets);
router.delete("/:ticketId", verifyToken, TicketController.deleteTicket);

module.exports = router;
