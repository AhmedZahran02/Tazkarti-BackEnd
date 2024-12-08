require("dotenv").config();

require("./models/Match");
require("./models/Referee");
require("./models/Seats");
require("./models/Stadium");
require("./models/Team");
require("./models/User");
require("./models/Ticket");
const http = require("http");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");

const express = require("express");

const AuthRouter = require("./routes/Auth");
const MatchRouter = require("./routes/matches");
const SeatRouter = require("./routes/seats");
const StadiumRouter = require("./routes/stadium");
const UserRouter = require("./routes/user");
const TeamRouter = require("./routes/team");
const RefereeRouter = require("./routes/referee");
const TicketRouter = require("./routes/ticket");
const { Server } = require("socket.io");
const allowedOrigins = ["https://not-tazkarti.vercel.app"];

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);
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
