const express = require("express");
const morgan = require("morgan");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const users = require("./database");
const urlDatabase = require("./database");
const {
  getUserByEmail,
  urlsForUser, 
  generateRandomString
} = require('./helpers');

const PORT = 3000; // default port 3000
const app = express();
;

app.use(cookieSession({
  name: "session",
  keys: ["supersecretKey", "anotherSuperSecretKet","df1718d9-9064-436d-bf71-f52fc9b7ee48"],
  maxAge: 60 * 60 * 1000 //Cookie will expire in 1hr
}));

app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Get Routes landing pages
 app.get("/urls", (req, res) => {
  const user = users[req.session.userId];// Retrieve the user object using userId cookie value
   if (!user) {
    res.render("home", { user });
  } else {
    const filteredUrls = urlsForUser(user.id, urlDatabase);
    const templateVars = {
      urls: filteredUrls,
      user: user
    };
    res.render("urls_index", templateVars);
  }

});

app.get("/urls/new", (req, res) => {
  const user = users[req.session.userId];

  if (!user) {
    res.redirect('/login');
  } else {
    res.render("urls_new", { user });
  }
});

// GET /urls/:id
app.get("/urls/:id", (req, res) => {
  const user = users[req.session.userId];
  const url = urlDatabase[req.params.id];
  if (!url) {
    res.status(404).send('<h1>URL not found</h1>');
  } else if (!user) {
    res.status(401).send('<h1>Please log in or register to view this URL</h1><a href="/login">Login</a><br/><br/><a href="/register">Register</a><br/>');
  } else if (url.userID !== user.id) {
    res.status(403).send('<h1>You do not have permission to access this URL</h1>');
  } else {
    res.render("urls_show", {user, shortURL: req.params.id, longURL: url.longURL });
  }
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (!longURL) {
    res.status(404).send("Short URL does not exist.");
  } else {
  res.redirect(longURL);
  }
});

app.get("/login", (req, res) => {
  const user = users[req.session.userId];
  if (user) {
    res.redirect('/urls');
  } else {
    res.render("login", {user: req.session.user});
  }
});


app.get("/register", (req, res) => {
  const user = users[req.session.userId];
  if(user){
    res.redirect('/urls')
  }else{
  res.render("registration",{user:req.session.user});
  }
});

// Post Routes //

 // POST /urls
app.post("/urls", (req, res) => {
  const user = users[req.session.userId];
  if (!user) {
    res.status(403).send('<h1> You need to be logged in to shorten URLs.</h1><a href="/login">Login</a>');
  } else {
    const longURL  = req.body.longURL;
    const shortURL = generateRandomString();

    
    urlDatabase[shortURL] = {
      longURL,
      userID: user.id
    };

    res.redirect(`/urls/${shortURL}`);
  }
});


app.post("/urls/:id", (req, res) => {
  const user = users[req.session.userId];
  const url = urlDatabase[req.params.id];
 
  if (!user) {
    res.status(403).send("Please login or register.");
  } else if (!url || url.userID !== user.id) {
    res.status(403).send("You do not own this URL.");
  } else {
    url.longURL = req.body.longURL;
    res.redirect(`/urls`);

  }
});

app.post("/urls/:id/delete", (req, res) => {
  const user = users[req.session.userId];
  const url = urlDatabase[req.params.id];

  if (!url) {
    res.status(403).send("Please login or register.");
  } else if (!user) {
    res.status(403).send("You do not own this URL.");
  } else if (url.userID !== user.id) {
  res.status(403).send('You do not have permission to delete this URL');
  }else {
    // Delete the URL logic
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  }

});

app.post("/register", (req, res) =>{
  const { email, password } = req.body;

  // Check if email or password are empty

  if (!email || !password) {
    res.status(400).send("Email and password cannot be empty.");
    return;
  }

  // Check if the email is already in use
   const foundUser = getUserByEmail(email, users);
  if (foundUser) {
    return res.status(400).send("Email is already registered.");
    }

    //hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log(hashedPassword);
  
    // create a new user object with the hashed password
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email,
    password: hashedPassword
  };

  req.session.userId = userId;

  // Redirect to the /urls page
  res.redirect("/urls");
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if email or password are empty
  const foundUser = getUserByEmail(email, users);
  if (!foundUser) {
    return res.status(403).send(" Invalid Email and password.");
    }

  // Check if the email exists in the users object
  const user = getUserByEmail(email);

  if (!user) {
    res.status(403).send("User with this email does not exist.");
    return;
  }
  const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);
  // Check if the provided password matches the user's password
  if (!isPasswordCorrect) {
   return res.status(403).send("Incorrect password.");
    
  }
  req.session.userId = foundUser.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
