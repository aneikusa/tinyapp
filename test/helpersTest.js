const { assert } = require('chai');

const { getUserByEmail } = require('../helper-functions.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    // return user === expectedUserID;
    assert.strictEqual(user.id, expectedUserID)
  });
  
  it('should return a blank "" if user is not in the database', function() {
    const user = getUserByEmail(testUsers, "notauser@example.com");
    const expectedUserID = "";
    return user === expectedUserID;
  });
});