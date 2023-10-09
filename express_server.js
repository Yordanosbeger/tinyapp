const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Functions //

const generateSixRandomChars = function() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = chars.charAt(Math.floor(Math.random() * chars.length));
    randomString += randomIndex;
  }

  return randomString;
};

// Database //

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  userRandomID: {id: "user3RrandomID", email: "user"
}
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Routes //

// Get Routes //

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_new" , templateVars);
});

app.get("/urls/:id", (req, res) => {
 const templateVars = { id: req.params.id, longURL: urlDatabase,username: req.cookies["username"]};
  res.render("urls_show", templateVars);
 });

app.get("/u/:id", (req, res) => {
  // const longURL = ...
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase,username: req.cookies["username"]};
  res.render("registration",templateVars);
});

// Post Routes //

 app.post("/urls", (req, res) => {
 console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/delete", (req, res) => {
const url = req.params.id 
delete urlDatabase[url];

  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const shortURL = generateSixRandomChars(); 
  const updatedLongURL = req.body.longURL;
  // Update the longURL in your database or data structure here
  // Redirect back to /urls after updating
  res.redirect(longURL);

});

app.post("/register", (req, res) =>{
  
  res.cookie('user_id', username);
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  const { username } = req.body;
  res.cookie('username', username);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
