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

const getUserByEmail = (email) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
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

// Get Routes //

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["user_id"]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["user_id"]};
  res.render("urls_new" , templateVars);
});

app.get("/urls/:id", (req, res) => {
 const templateVars = { id: req.params.id, longURL: urlDatabase,username: req.cookies["user_id"]};
  res.render("urls_show", templateVars);
 });

app.get("/u/:id", (req, res) => {
  
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  res.render("login");
});


app.get("/register", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase,username: req.cookies["user_id"]};
  res.render("registration",templateVars);
});

// Post Routes //

 app.post("/urls", (req, res) => {
 console.log(req.body); 
  res.send("Ok"); 
});

app.post("/urls/:id/delete", (req, res) => {
const url = req.params.id 
delete urlDatabase[url];

  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const shortURL = generateSixRandomChars(); 
  const updatedLongURL = req.body.longURL;
  res.redirect(longURL);
});

app.post("/register", (req, res) =>{
  const { email, password } = req.body;

  // Check if email or password are empty

  if (!email || !password) {
    res.status(400).send("Email and password cannot be empty.");
    return;
  }

  // Check if the email is already in use
  if (getUserByEmail(email)) {
    res.status(400).send("Email is already registered.");
    return;
  }

  // Generate a unique user ID
  const user_id = generateSixRandomChars();

  // Create a new user object
  const newUser = {
    id: user_id,
    email,
    password,
  };

  // Add the new user to the users object
  users[user_id] = newUser;

  // Set the user_id cookie
  res.cookie("user_id", user_id);

  // Redirect to the /urls page
  res.redirect("/urls");
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if email or password are empty
  if (!email || !password) {
    res.status(403).send("Email and password cannot be empty.");
    return;
  }

  // Check if the email exists in the users object
  const user = getUserByEmail(email);

  if (!user) {
    res.status(403).send("User with this email does not exist.");
    return;
  }

  // Check if the provided password matches the user's password
  if (user.password !== password) {
    res.status(403).send("Incorrect password.");
    return;
  }

  // Set the user_id cookie with the matching user's ID
  res.cookie("user_id", user.id);

  // Redirect to the /urls page
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
