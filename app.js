require("dotenv").config();
require("./utils/passport_setup");

require("./models/match");
require("./models/referee");
require("./models/seats");
require("./models/stadium");
require("./models/team");
require("./models/user");
require("./models/referee");
require("./models/Ticket");
const http = require("http");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");

const passport = require("passport");
const express = require("express");

const AuthRouter = require("./routes/auth");
const MatchRouter = require("./routes/matches");
const SeatRouter = require("./routes/seats");
const StadiumRouter = require("./routes/stadium");
const UserRouter = require("./routes/user");
const TeamRouter = require("./routes/team");
const RefereeRouter = require("./routes/referee");
const TicketRouter = require("./routes/ticket");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const DB = require("./utils/db");

const sessionOptions = {
  secret: "MoAWasHere",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: process.env.ENV !== "DEV",
    sameSite: process.env.ENV !== "DEV" ? "Lax" : "None",
    secure: process.env.ENV !== "DEV",
    maxAge: 24 * 60 * 60 * 1000 * 30, // 30 days
  },
};

app.use(express.json());
// app.use(express.raw({ type: "application/octet-stream", limit: "5mb" }));

// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   })
// );

// app.use(session(sessionOptions));
// app.use(passport.initialize());
// app.use(passport.session());

app.use("/auth", AuthRouter);
app.use("/matches", MatchRouter);
app.use("/seats", SeatRouter);
app.use("/stadium", StadiumRouter);
app.use("/users", UserRouter);
app.use("/team", TeamRouter);
app.use("/referee", RefereeRouter);
app.use("/ticket", TicketRouter);

// app.enable("trust proxy");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.listen(process.env.PORT || 8080, () => {
//   console.log("Listening on port " + process.env.PORT);
// });
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow any origin
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["token"],
  },
});
io.on("connection", (socket) => {
  console.log("A user connected");

  // Emit an event to the connected client
  socket.emit("message", "Welcome to the seat reservation system");

  // Listen for seat reservation event
  socket.on("reserve-seat", (seatData) => {
    console.log("Seat reserved:", seatData);

    // Emit to all clients about the seat reservation
    io.emit("seat-reserved", seatData); // Broadcast to all clients
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(8080, () => {
  console.log("Server is running on port 5000");
});
