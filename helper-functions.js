const generateRandomString = () => {
  return Math.random().toString(36).slice(2);
}; // console.log(generateRandomString());

const getUserByEmail = (usersObject, email) => {
  for (const user in usersObject) {
    if (usersObject[user].email === email) {
      return usersObject[user];
    }
  }
  return null;
}; // returns object if email exists

const urlsForUser = (userId, urlDatabase) => {
  const urls = {};
  for (const id in urlDatabase) {
    const url = urlDatabase[id];
    if (url.userID === userId) {
      urls[id] = url;
    }
  }
  return urls;
};


module.exports = { generateRandomString, getUserByEmail, urlsForUser};