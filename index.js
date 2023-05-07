var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const session = require("express-session");
// var rea =require('react')
const app = express();
const path = require("path");
const port = process.env.PORT || 3030;

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "Keep it secret",
    name: "uniqueSessionID",
    saveUninitialized: false,
  })
);

mongoose.connect("mongodb://127.0.0.1:27017/Onlinefoodordering", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

app.post("/signup", async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var confirmpassword = req.body.confirmpassword;

  var data = {
    username: username,
    password: password,
    confirmpassword: confirmpassword,
  };
  if (password !== confirmpassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  await db.collection("users").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    console.log("Record Inserted Successfully");
  });

  return res.redirect("signupsucess.html");
});
app.post("/login", async (req, res) => {
  try {
    const check = await db
      .collection("users")
      .findOne({ username: req.body.username });
    const users = await db.collection("users").find().toArray();
    let passwordMatched = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].password === req.body.password) {
        passwordMatched = true;
        break;
      }
    }
    if (passwordMatched) {
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      return res.status(200).json({ message: "Success" });
    } else {
      return res.status(403).json({ message: "Invalid credentials" });
    }
  } catch {
    res.send("catch password:");
  }
});

app.get("/logout", async (req, res) => {
  req.session.loggedIn = false;
  req.session.username = null;
  return res.status(200).json({ message: "Success" });
});

app.post("/contactus", async (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;

  var data = {
    name: name,
    email: email,
    message: message,
  };
  const check = await db
    .collection("users")
    .findOne({ username: req.body.username });
  const users = await db.collection("users").find().toArray();
  let emailexist = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === req.body.email) {
      emailexist = true;
      break;
    }
  }
  if (emailexist) {
    await db.collection("contactus").insertOne(data, (err, collection) => {
      if (err) {
        throw err;
      }
      console.log("Record Inserted Successfully");
    });
    res.redirect("contactsuccess.html");
  } else {
    return res.redirect("contactlogin.html");
  }
});

app
  .get("/", (req, res) => {
    res.set({
      "Allow-access-Allow-Origin": "*",
    });
    res.redirect("/pages/home.html");
    // res.sendFile(path.join(__dirname+'/public/pages/home.html'));
  })
  .listen(port);

console.log("Listening on PORT " + port);
