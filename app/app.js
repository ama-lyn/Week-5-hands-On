//EXPRESS JS
// npm init -y package.json
// npm install - package-lock.json
// mpm install lodash - managing the dependencies
// npm install express
// npm install -g nodemon install it globally
// npm install --save-dev nodemon (Saving it as a dev dependecy)

// *** in the package.json "scripts" :{ 'devStart' : "nodemon server.js"}
// while running npm run devStart

const express = require("express");
const app = express();

//rendering static file 
// create a folder called public, now app.use(express.static("public")

//aceesing form data don't forget app.use(express.urlencoded({extended: true}))

//<<<<<<<<<<<< HERE
// VIEW ENGINES Install ejs  npm i ejs

// Telling application to use a view engine
app.set("view engine", "ejs"); //name of setting, view engine using
// renaming file with ejs extension
// index.html >> index.ejs
// syntax highlighting  - ejs languange support

// defining a route
app.get("/intro", function (request, response) {
  response.send("Hello World");
});

// Another route
app.get("/about", (req, res) => {
  //normal text
  res.send("About page");
  // sending a status code
  res.sendStatus(500);
  //chaining status and a text string
  res.status(200).send("About page");
  //chaining status and a json object
  res.status(500).json({ message: "Error" });
  //file for user to download
  res.download("app.js");

  // rendering a html file (all files should be on view)
  // view engines ejs, pug CHECK UPP >>>>>>>>>>>>>
  res.render("about.html");

  // passing info from server to views
  res.render("about.html", { text: "world" });
  // accessing it in a view using ejs as templating language  e.g Hello <%= text %>
  // <%= locals.text || 'Default' %>  Passing around the error when the variables may not be defined

  //redirecting to another route
  res.redirect("/intro");
});


// code related to the user 
// put in a it's own folder
//folder called routes 
// file called user.js
// in the file code below and import express create a rounter const route = express.Router()
// now replace the app with router 
//export the file 


// now import it in this file 

app.get("/users", (req, res) => {
  res.send("users page");
});

app.get("/users/new", (req,res)=>{

    res.send("User New Form")
})
app.listen(4000);
