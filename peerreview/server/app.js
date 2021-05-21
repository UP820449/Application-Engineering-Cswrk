const express = require("express");
const shortid = require("shortid");
const app = express();
const mysql = require("mysql2");
const config = require("./config");
const path = require("path");
const port = 8080;

// Mysql credentials
const connection = mysql.createConnection(config.mysql);

// Connects to mysql database
try {
  connection.connect();
} catch (e) {
  console.log("Oops something bad happened");
  console.log(e);
}

app.use(express.static("../public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/:id", (req, res) => {
  const id = req.params.id;
  const filteredTaggedReview = taggedReviews.filter((i) => i.id === id);
  res.json(filteredTaggedReview);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/api/reviews", (req, res) => {
  connection.query("SELECT * FROM reviews", (error, results) => {
    if (error)
      return res.json({
        error: error,
      });
    res.json(results);
  });
});

app.get("/api/taggedReviews", (req, res) => {
  connection.query("SELECT * FROM feedback", (error, results) => {
    if (error)
      return res.json({
        error: error,
      });
    res.json(results);
  });
});

app.get("/api/reviews/:id", (req, res) => {
  connection.query(
    "SELECT * FROM reviews WHERE id = ?",
    [req.params.id],
    (error, results) => {
      if (error) return res.json({ error: error });
      res.json(results);
    }
  );
});

app.get("/api/taggedReviews/:id", (req, res) => {
  connection.query(
    "SELECT * FROM feedback WHERE id = ?",
    [req.params.id],
    (error, results) => {
      if (error) return res.json({ error: error });
      res.json(results);
    }
  );
});

app.post("/api/taggedReviews", (req, res) => {
  connection.query(
    "INSERT INTO feedback (id, username, comment) VALUES (?,?,?)",
    [req.body.id, req.body.username, req.body.comment],
    (error, results) => {
      if (error)
        return res.json({
          error: error,
        });

      connection.query(
        "SELECT LAST_INSERT_ID() FROM feedback",
        (error, results) => {
          if (error)
            return res.json({
              error: error,
            });
          res.json({
            id: results[0]["LAST_INSERT_ID()"],
            username: req.body.username,
            link: req.body.comment,
          });
        }
      );
    }
  );
});

app.post("/api/reviews", (req, res) => {
  connection.query(
    "INSERT INTO reviews (id, username, link) VALUES (?,?,?)",
    [shortid.generate(), req.body.username, req.body.link],
    (error, results) => {
      if (error)
        return res.json({
          error: error,
        });

      connection.query(
        "SELECT LAST_INSERT_ID() FROM reviews",
        (error, results) => {
          if (error)
            return res.json({
              error: error,
            });
          res.json({
            id: results[0]["LAST_INSERT_ID()"],
            username: req.body.username,
            link: req.body.link,
          });
        }
      );
    }
  );
});

let reviews = [
  { id: "vcb", name: "up739292", link: "www.blahblahblah.com" },
  { id: "yqj", name: "UP800783", link: "www.joji.com" },
  { id: shortid.generate(), name: "Ajebutter22", link: "www.google.com" },
  { id: shortid.generate(), name: "Burna Boy", link: "www.duck.com" },
];

let taggedReviews = [
  {
    id: "vcb",
    name: "UP900893",
    comment: "good documentation and splitting of work",
  },
  {
    id: "vcb",
    name: "UP837362",
    comment:
      "good use of accessibility and ui. More work should be done to aachieve a higher grade. good use of accessibility and ui. More work should be done to aachieve a higher grade",
  },
  {
    id: "vcb",
    name: "UP738372",
    comment: "you should have paid attention to the work",
  },
  {
    id: "yqj",
    name: "UP900893",
    comment: "good documentation and splitting of work",
  },
  {
    id: "vcb",
    name: "UP837362",
    comment:
      "good use of accessibility and ui. More work should be done to aachieve a higher grade. good use of accessibility and ui. More work should be done to aachieve a higher grade",
  },
  {
    id: "vcb",
    name: "UP738372",
    comment: "you should have paid attention to the work",
  },
];
