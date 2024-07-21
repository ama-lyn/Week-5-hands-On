const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv"); // INSTALL THIS, YOU FORGOT....

app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

db.connect((err) => {
  if (err) return console.log("Error connecting to my MYSQL");

  console.log("Connected to MYSQL:", db.threadId);

  //CREATE DATABSE
  db.query("CREATE DATABASE IF NOT EXISTS expense_tracker", (err, result) => {
    //error creating database
    if (err) return console.log("Error creating database");
    //if no error creating db
    console.log("db expense_tracker cretaed/checked successfully");

    //SELECT THE expense_tracker DATABASE
    db.changeUser({ database: "expense_tracker" }, (err, result) => {
      //if error changing db
      if (err) return console.log("Error changing db");

      //if no error changing
      console.log("expense_tracker is in use");

      //CREATE TABLE
      const createUsersTable = `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(50) NOT NULL,
            password VARCHAR(255) NOT NULL
            )`;

      db.query(createUsersTable, (err, result) => {
        //if error creating a table
        if (err) return console.log("Error creating users table");
        //if no error creating a table
        console.log("users table created successfully");
      });
    });
  });
});

//user registration
//using a asycnhromous when can't estimate the time to get the feedback (using async funtion)
app.post("api/register", async (req, res) => {
  try {
    const users = `SELECT * FROM users WHERE email = ? `;
    db.query(users, [req.body.email], (err, data) => {
      //if email exists
      if (data.length > 0) return res.status(400).json("user already exists");

      //if email doesn't exist
       //password hashing
       const salt = bcrypt.genSaltSync(10)
       const hashedPassword = bcrypt.hashSync(req.body.password, salt)

      // create new  user
      const newUser = `INSERT INTO users (email, username, password) VALUES (?,?,?)`;
      value = [req.body.email, req.body.username, hashedPassword];
      

      db.query(newUser, [value], (err, data) => {
        if (err) return res.status(400).json("error creating user");

        //if it works successfully
        res.status(200).json("user created successfully");
      });
    });
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
});

//user login
app.post("api/login", async (req, res) => {
    try {
        const users = `SELECT * FROM users WHERE email = ? `
        db.query(users, [req.body.email], (err, data) => {
            //if user doesn't exist
            if(data.length === 0 ) return res.status(404).json('User not found!')
            //if user exists
            const isPasswordValid = bcrypt.compareSync(req.body.password, data[0].password)

            //password is not valid 
            if(!isPasswordValid) return res.status(404).json('Invalid password or email!') //secuirty reasons

            //passwords and email match 
            return res.status(200).json("Login successful!")
        })
    }
    catch(err){
        res.status(500).json("Internal Server Error");
    }
})

//running the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});




