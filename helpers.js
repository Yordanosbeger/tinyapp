const getUserByEmail = (email, users) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};

//function that filters the URLs in the urlDatabase based on logged userID
const urlsForUser = (id, urlDatabase) => {
  const filteredUrls = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      filteredUrls[url] = urlDatabase[url];
    }
  }
  return filteredUrls;
};

const generateRandomString = function() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = chars.charAt(Math.floor(Math.random() * chars.length));
    randomString += randomIndex;
  }
  return randomString;
};
 module.exports = {getUserByEmail, generateRandomString, urlsForUser };