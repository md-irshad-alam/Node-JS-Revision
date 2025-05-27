const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const connection = require("./src/config/db");
const { route, moviesRoute } = require("./src/routes");
const cookiesParser = require("cookie-parser");
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookiesParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const rateLimit = new Map();
const windowSize = 60 * 1000; // 1 minute
const maxRequests = 50;

app.use((req, res, next) => {
  const ip = req.socket.remoteAddress;
  console.log(`Request from IP: ${ip}`);
  const currentTime = Date.now();

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, startTime: currentTime });
    return next();
  }
  const data = rateLimit.get(ip);
  const timePassed = currentTime - data.startTime;

  if (timePassed < windowSize) {
    if (data.count >= maxRequests) {
      return res.status(429).send("Too many requests, please try again later.");
    } else {
      data.count++;
      rateLimit.set(ip, data);
      return next();
    }
  } else {
    rateLimit.set(ip, { count: 1, startTime: currentTime });
    return next();
  }
});
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", route);
app.use("/api/movies", moviesRoute);
app.listen(port, async () => {
  await connection();
  console.log("server is live....");
});
