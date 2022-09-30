const express = require("express");
const app = express();

const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs"); // setting ejs as view engine
app.use(express.urlencoded({ extended: true })); // parse the body
app.use(cookieParser());

function generateRandomString() {
  return Math.random().toString(36).slice(2);
} 
// console.log(generateRandomString()); 


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // const templateVars = {username: req.cookies["username"]};
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
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
  res.cookie("username", req.body.username);
  res.redirect("/urls");
}); // login

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
}); // logout

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
