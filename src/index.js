import express from "express";
import debug from "debug";
import chalk from "chalk";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const PORT = process.env.PORT || 4000;
app.use(morgan("dev"));
app.use(express.static("public"));
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/art", (req, res) => {
  res.render("artPreview");
});

app.get("/front", (req, res) => {
  res.render("frontPage");
});

app.get("/signin", (req, res) => {
  res.render("signIn");
});
app.get("/signup", (req, res) => {
  res.render("signUp");
});
app.get("/favourite", (req, res) => {
  res.render("favourite");
});

app.get("/post", (req, res) => {
  res.render("postArt");
});

app.get("/edit", (req, res) => {
  res.render("editPost");
});

app.get("/message", (req, res) => {
  res.render("message");
});

app.get("/inbox", (req, res) => {
  res.render("inbox", {
    read: true,
    messages: [
      {
        art: "Da vi ci",
        price: "$500.00",
        date: "10/10/2019",
        name: "Kolade Anifowoshe"
      },
      {
        art: "Forest Live",
        price: "$10,00.00",
        date: "19 hours ago",
        name: "Adeniji Adefisayo"
      },
      {
        art: "Running Water",
        price: "$5,00.00",
        date: "10 mins ago",
        name: "Dayo Ariyo"
      }
    ]
  });
});

app.listen(PORT, debug("app:")(chalk.red(`Server running on port ${PORT}`)));
