const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bcrypt = require("bcryptjs");

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

const urlsForUser = (id) => {
  const userURLs = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  };

// Get Routes //

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  if (!userId) {
    res.status(403).send("Please login or register.");
  } else {
    const userURLs = urlsForUser(userId);
    const templateVars = { urls: urlDatabase, username: req.cookies["user_id"]};
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  } else {
  const templateVars = { urls: urlDatabase, username: req.cookies["user_id"]};
  res.render("urls_new" , templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const userId = req.cookies["user_id"];
  const userURLs = urlsForUser(userId);
  if (!userId) {
    res.status(403).send("Please login or register.");
  } else if (!userURLs[shortURL]) {
    res.status(403).send("You do not own this URL.");
  } else {
 const templateVars = { id: req.params.id, longURL: urlDatabase,username: req.cookies["user_id"]};
  res.render("urls_show", templateVars);
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
  res.render("login");
});


app.get("/register", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase,username: req.cookies["user_id"]};
  res.render("registration",templateVars);
});

// Post Routes //

 app.post("/urls", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.status(403).send("You need to be logged in to create a new URL.");
  } else {
 console.log(req.body); 
  res.send("Ok"); 
  }
});

app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  const userId = req.cookies["user_id"];
  const userURLs = urlsForUser(userId);
  if (!userId) {
    res.status(403).send("Please login or register.");
  } else if (!userURLs[shortURL]) {
    res.status(403).send("You do not own this URL.");
  } else {
    // Delete the URL logic
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const userId = req.cookies["user_id"];
  const userURLs = urlsForUser(userId);
  if (!userId) {
    res.status(403).send("Please login or register.");
  } else if (!userURLs[shortURL]) {
    res.status(403).send("You do not own this URL.");
  } else {
    // Update the URL logic
    res.redirect(`/urls/${shortURL}`);
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
  if (getUserByEmail(email)) {
    res.status(400).send("Email is already registered.");
    return;
  }

  // Generate a unique user ID
  const user_id = generateSixRandomChars();
  const hashedPassword = bcrypt.hashSync(password, 10);
  // Create a new user object
  const newUser = {
    id: user_id,
    email,
    password: hashedPassword,
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
  if (!bcrypt.compareSync(user.password !== password)) {
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
