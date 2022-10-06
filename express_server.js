const express = require("express");
const app = express();

const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')

const {
  generateRandomString,
  getUserByEmail,
} = require("./helper-functions");

app.set("view engine", "ejs"); // setting ejs as view engine
app.use(express.urlencoded({ extended: true })); // parse the body
app.use(cookieParser());

// function generateRandomString () {
//   return Math.random().toString(36).slice(2);
// }; // console.log(generateRandomString()); 

// function getUserByEmail (usersObject, email) {
//   for (const user in usersObject) {
//     if (usersObject[user].email === email) {
//       return usersObject[user];
//     }
//   }
//   return null;
// }; // returns object if email exists

const users = {}; //object that stores user information

const urlDatabasee = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabasee);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { 
    user: user,
    urls: urlDatabasee 
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user: user,
  };
  if(!user) {
   return res.redirect("/login");
  } 
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user: user,
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user: user,
  }
  res.render("registration", templateVars);
});

app.get("/login", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {
    user: user,
  }
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
}); //redirecting to longURL

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
}); // delete route and redirect to urls

app.post("/urls/:id/update", (req,res)=>{
  let idTOUpdate = req.params.id;
  urlDatabase[idTOUpdate]=req.body.longURL;
  res.redirect("/urls");
  });

app.post("/login", (req, res) => {
  if (getUserByEmail(users, req.body.email) === null) {
    res.status(403).send('No accounts for this email exist');
  } else if (getUserByEmail(users, req.body.email).password !== req.body.password) {
    res.status(403).send('Incorrect password');
  } else {
  res.cookie("user_id", getUserByEmail(users, req.body.email).id);
  res.redirect("/urls");
  }
}); // login - made sure to double check redirect

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
}); // logout

app.post("/register", (req, res) => {
const userID = generateRandomString();
const userEmail = req.body.email;
const userPassword = req.body.password;

if (!userEmail || !userPassword) {
  res.status(400).send('Incorrect entry. Missing email or password.');
} else if (getUserByEmail(users, userEmail) !== null) {
  res.status(400).send("This email already exists");
} else {
  users[userID] = {
    id: userID,
    email: userEmail,
    password: userPassword
  };

  res.cookie("user_id", userID);
  res.redirect("/urls");
}

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});