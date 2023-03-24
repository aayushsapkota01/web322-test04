const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const app = express();
const exphbs = require("express-handlebars");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "yagjwylp",
  "yagjwylp",
  "djFNNSTBbRV4qsm9Y4ijZuZ0WuiMTnA6",
  {
    host: "isilo.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

let users = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: Sequelize.STRING,
    email: Sequelize.STRING,
    created_at: Sequelize.DATE,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// Load styles from public folder
app.use(express.static("./public/"));

// Define a custom Handlebars helper function to format dates
const hbs = exphbs.create({
  helpers: {
    formatDate: function (date) {
      return date.toLocaleDateString();
    },
  },

  extname: ".hbs",
});

// Register handlebars as the rendering engine for views
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Use body-parser middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the HTML form
app.get("/update-user", (req, res) => {
  const id = req.query.id;
  users
    .findAll({
      where: {
        id: id,
      },
    })
    .then(function (results) {
      res.render("edit", { users: results[0], layout: false });
    });
});

// Update user data in database
app.post("/update-user", (req, res) => {
  const name = req.body.name;
  const id = req.body.id;
  const email = req.body.email;

  sequelize.sync().then(function () {
    users
      .update(
        {
          name: name,
          email: email,
        },
        {
          where: { id: id },
        }
      )
      .then(function () {
        res.redirect("/");
      });
  });
});

// Delete user data in database
app.get("/delete-user", (req, res) => {
  const id = req.query.id;

  sequelize.sync().then(function () {
    users
      .destroy({
        where: { id: id },
      })
      .then(function () {
        res.redirect("/");
      });
  });
});

// Handle form submission
app.post("/insert-user", (req, res) => {
  const { name, email } = req.body;

  users
    .create({
      name: name,
      email: email,
    })
    .then(function () {
      console.log("User created");

      res.redirect("/");
    });
});

app.get("/", (req, res) => {
  sequelize.sync().then(function () {
    users
      .findAll({
        // attributes: ['fName']
      })
      .then(function (results) {
        res.render("index", { users: results, layout: false });
      });
  });
});

// Start the serverx
app.listen(8000, () => {
  console.log("Server started on http://localhost:8000");
});
