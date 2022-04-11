require('dotenv').config({ path: '../.env' });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const oauthBegin = require("./controllers/oauthBegin");
const asyncwrapper = require("./middlewares/asyncwrapper");
const { verifyZendeskAuth } = require("./middlewares/zendeskAuth");
const oauthCallback = require("./controllers/oauthCallback");
const { getTickets, createTicket } = require("./controllers/tickets");
const { verifyHappeoAuth } = require("./middlewares/happeoAuth");
var rateLimit = require('express-rate-limit');
const { getArticle, getSectionArticles } = require('./controllers/articles');
const { getSearch } = require('./controllers/search');
const { getCategories, getSections } = require('./controllers/sectionsAndCategories');

const app = express();

const limiter = new rateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 15
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/oauth/begin", asyncwrapper(oauthBegin));

app.get("/oauth/callback", asyncwrapper(oauthCallback));

app.get("/tickets", verifyHappeoAuth, verifyZendeskAuth, asyncwrapper(getTickets));

app.get("/articles/:id", verifyHappeoAuth, verifyZendeskAuth, asyncwrapper(getArticle));

app.get("/categories", verifyHappeoAuth, verifyZendeskAuth, asyncwrapper(getCategories));

app.get("/categories/:id/sections", verifyHappeoAuth, verifyZendeskAuth, asyncwrapper(getSections));

app.get("/sections/:sectionId/articles", verifyHappeoAuth, verifyZendeskAuth, asyncwrapper(getSectionArticles));

app.get("/search", verifyHappeoAuth, verifyZendeskAuth, asyncwrapper(getSearch));

app.post(
  "/tickets",
  verifyHappeoAuth,
  verifyZendeskAuth,
  asyncwrapper(createTicket)
);

app.use(function (req, res, next) {
  res.set("Cache-control", "no-cache");
  next();
});

// Serve any static files
app.use("/public", express.static(path.join(__dirname, "public")));

app.use((err, _req, res, _next) => {
  // TODO we have to implement proper error handling
  res.status(err.status || 500).send(err.message);
});


app.get("/oauth/result", limiter, function (req, res) {
  const { success } = req.query;

  if (success === "true") {
    res.sendFile(path.join(__dirname, "./public/success.html"));
  } else {
    res.sendFile(path.join(__dirname, "./public/error.html"));
  }
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Zendesk Happeo CustomWidget server example: listening on port ${port}`);
});
