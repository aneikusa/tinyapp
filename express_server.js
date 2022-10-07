const express = require("express");
const app = express();

const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session');
const password = "purple-monkey-dinosaur"; // found in the req.body object

const bcrypt = require("bcryptjs");

const {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
} = require("./helper-functions");

app.set("view engine", "ejs"); // setting ejs as view engine
app.use(express.urlencoded({ extended: true })); // parse the body
app.use(cookieSession({
  name: 'session',
  keys: ['thesecrettotheonepieceis'],
}));

const users = {}; //object that stores user information

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


// GET ROUTES

app.get("/", (req, res) => {
  const user = users[req.session["user_id"]];
  if (!user) { //redirect user to login if they are not logged in
    res.redirect("/login");
  }
  res.redirect("/urls"); //redirects user to urls if logged in already
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
//   const user = users[req.cookies["user_id"]];
//   const templateVars = {
//     user: user,
//     urls: urlDatabase,
//   };
//   res.render("urls_index", templateVars);
// });
  const userID = req.session["user_id"];
  const user = users[userID];
  const urls = urlsForUser(userID, urlDatabase);
  if (!user) {
    res.send("You are not logged in");
    return;
  }
  const templateVars = { urls, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session["user_id"]];
  const templateVars = {user};
  if (!user) {
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
//   const user = users[req.cookies["user_id"]];
//   const templateVars = {
//     user: user,
//     id: req.params.id,
//     longURL: urlDatabase[req.params.id],
//   };
//   res.render("urls_show", templateVars);
// });
  const userID = req.session["user_id"];
  const user = users[userID];
  const urls = urlsForUser(userID, urlDatabase);

  if (!user) {
    res.send("You are not logged in!");
    return;
  }
  if (!Object.keys(urlDatabase).includes(req.params.id)) {
    res.send("This link does not exist!");
    return;
  }
  if (!Object.keys(urls).includes(req.params.id)) {
    res.send("You don't have permission to view this page!");
    return;
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]["longURL"], user };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
//   const longURL = urlDatabase[req.params.id]
//   res.redirect(longURL);
// });
  if (urlDatabase[req.params.id] === undefined) {
    res.send("Error: Short Url cannnot be found");
    return;
  }
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const user = users[req.session["user_id"]];
  const templateVars = {
    user: user,
  };
  if (user) {
    res.redirect("/urls");
    return;
  }
  res.render("registration", templateVars);
});

app.get("/login", (req, res) => {
  const user = users[req.session["user_id"]];
  const templateVars = {
    user: user,
  };
  if (user) {
    res.redirect("/urls");
    return;
  }
  res.render("login", templateVars);
});
  


// URL POSTS

app.post("/urls", (req, res) => {
  const user = users[req.session["user_id"]];
  const databaseID = generateRandomString();
  if (user) {
    urlDatabase[databaseID] = {
      "longURL": req.body["longURL"],
      "userID": user.id
    };
    res.redirect("/urls/" + databaseID);
    return;
  }
  res.send("Error! Please login!");
}); //redirecting to longURL

app.post("/urls/:id/delete", (req, res) => {
//   delete urlDatabase[req.params.id];
//   res.redirect("/urls");
// }); // delete route and redirect to urls
  const userID = req.session["user_id"];
  const user = users[userID];
  const urls = urlsForUser(userID, urlDatabase);
  if (!user) {
    res.send("You are not logged in!");
    return;
  }
  if (!Object.keys(urlDatabase).includes(req.params.id)) {
    res.send("This link does not exist!");
    return;
  }
  if (!Object.keys(urls).includes(req.params.id)) {
    res.send("You don't have permission to view this page!");
    return;
  }
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req,res)=>{
  // let idTOUpdate = req.params.id;
  // urlDatabase[idTOUpdate]=req.body.longURL;
  // res.redirect("/urls");
  // });
  const userID = req.session["user_id"];
  const user = users[userID];
  const urls = urlsForUser(userID, urlDatabase);
  if (!user) {
    res.send("You are not logged in!");
    return;
  }
  if (!Object.keys(urlDatabase).includes(req.params.id)) {
    res.send("This link does not exist!");
    return;
  }
  if (!Object.keys(urls).includes(req.params.id)) {
    res.send("You don't have permission to view this page!");
    return;
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user };
  res.render("urls_show", templateVars);
});


app.post("/urls/:id/updateData", (req, res) => {
  urlDatabase[req.params.id].longURL = req.body["updatedlongURL"];
  res.redirect("/urls");
});


// LOGIN, LOGOUT AND REGISTER POST ROUTES

app.post("/login", (req, res) => {
  if (getUserByEmail(users, req.body.email) === null) {
    res.status(403).send('No accounts for this email exist');
  } else if (!bcrypt.compareSync(req.body.password, getUserByEmail(users, req.body.email).password)) {
    res.status(403).send('Incorrect password');
  } else {
    req.session.user_id = getUserByEmail(users, req.body.email).id;
    res.redirect("/urls");
  }
}); // login - made sure to double check redirect

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
}); // logout

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!userEmail || !userPassword) {
    res.status(400).send('Incorrect entry. Missing email or password.');
  } else if (getUserByEmail(users, userEmail) !== null) {
    res.status(400).send("This email already exists!");
  } else {
    users[userID] = {
      id: userID,
      email: userEmail,
      password: hashedPassword,
    };

    req.session.user_id = users[userID].id;
    res.redirect("/urls");
  }

});

// LISTENING PORT

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
