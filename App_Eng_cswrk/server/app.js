const express = require("express");
var { nanoid } = require("nanoid");
const app = express();
const mysql = require("mysql2");
const config = require("./config");
const port = 8080;
const db = require("./databaseModel");

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
      res.json(results);
    }
  );
});

//New functionality (add user to db)
app.post("/api/users", addUser);

async function addUser(req, res) {
  try {
    const retval = await db.addUser(req.query.email, req.query.password);
    if (req.accepts("html")) {
      res.json(200);
    } else {
      res.json(retval);
    }
  } catch (e) {
    error(res, e);
  }
}

app.get("/api/login", validateLogin);
async function validateLogin(req, res) {
  try {
    const retval = await db.checkLogin(req.query.email, req.query.pass);

    if (retval.length === 1) {
      res.send(200);
    } else {
      res.send(401);
    }
  } catch (e) {
    error(res, e);
  }
}

app.post("/api/reviews", (req, res) => {
  console.log(req.body);
  connection.query(
    "INSERT INTO reviews (id, username, course, link) VALUES (?,?,?,?)",
    [nanoid(), req.body.username, req.body.course, req.body.link],
    (error, results) => {
      console.log(results, "results");
      if (error)
        return res.json({
          error: error,
        });
      res.sendStatus(204);
    }
  );
});

app.get("/review/:id", (req, res) => {
  console.log("new world");
  const id = req.params.id;
  connection.query(
    "SELECT * FROM feedback WHERE id = ?",
    [id],
    (error, results) => {
      if (error) return res.json({ error: error });
      let data = results;
      console.log(data, "data");
      connection.query(
        "SELECT * FROM reviews WHERE id = ?",
        [id],
        (error, results) => {
          if (error) return res.json({ error: error });
          console.log(results[0], "results");
          res.write(`<head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>RevIt</title>
          <link rel="stylesheet" href="/style.css" />
        </head>`);
          res.write(`<div>
        <button class="add-feedback btn">+</button>
        </div>
        <div class="modal-feedback">    
            <button class="btn plus-feedback">Done</button>
            <input class="uinput username" placeholder="Username" />
            <textarea class="uinput comment" placeholder="Your feedback..." rows="5" cols="33"></textarea>
          </div>
        <div class="card review-details" data-url=${results[0].id}>
        <div class='content'>
            <h4 class="label">Author</h4>
            <span>${results[0]?.username}</span>
          </div>
          <div class='content'>
            <h4 class="label">Assignment</h4>
            <p>${results[0]?.course}</p>
          </div>
          <div class='content'>
            <h4 class="label">Link</h4>
            <span><a href="https:${results[0]?.link}" target="_blank">${
            results[0]?.link
          }</a></span>
          </div>
          </div>
          <div>
          <h4 style="padding-left: 40px">Feedback</h4>
        <ul class="feedback-list">${data.map(
          (i) => `
          <li class='feedback-card '>
          <div class='feedback-card-content'>
          <h4 class="label">Author</h4>
          <span>${i.username}</span>
        </div>
        <div class='feedback-card-content'>
          <h4 class="label">Feedback</h4>
          <span>${i.comment}</span>
        </div></li>`
        )}</ul></div>`);
          res.write('<script src="/reviews.js"></script>');
          res.end();
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
