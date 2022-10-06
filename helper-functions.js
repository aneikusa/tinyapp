function generateRandomString () {
  return Math.random().toString(36).slice(2);
}; // console.log(generateRandomString()); 

function getUserByEmail (usersObject, email) {
  for (const user in usersObject) {
    if (usersObject[user].email === email) {
      return usersObject[user];
    }
  }
  return null;
}; // returns object if email exists

module.exports = {generateRandomString, getUserByEmail};