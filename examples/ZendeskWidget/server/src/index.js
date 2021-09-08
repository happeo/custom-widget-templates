const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const oauthBegin = require("./controllers/oauthBegin");
const asyncwrapper = require("./middlewares/asyncwrapper");
const { checkAuth } = require("./middlewares/auth");
const oauthCallback = require("./controllers/oauthCallback");
const { getTickets, createTicket } = require("./controllers/tickets");
const { verifyJwt } = require("./middlewares/jwt");

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/oauth/begin", asyncwrapper(oauthBegin));

app.get("/oauth/callback", asyncwrapper(oauthCallback));

app.get("/tickets", verifyJwt, checkAuth, asyncwrapper(getTickets));

app.post("/tickets", verifyJwt, checkAuth, asyncwrapper(createTicket));

app.use(function (req, res, next) {
  res.set("Cache-control", "no-cache");
  next();
});

// Serve any static files
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/oauth/result", function (req, res) {
  const { success } = req.query;

  if (success === "true") {
    res.sendFile(path.join(__dirname, "./public/success.html"));
  } else {
    res.sendFile(path.join(__dirname, "./public/error.html"));
  }
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Custom widget example: listening on port ${port}`);
});
