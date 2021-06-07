CREATE DATABASE if not exists revit CHARACTER SET utf8;


CREATE TABLE if not exists revit.user(
  id int PRIMARY KEY auto_increment,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL
);

CREATE TABLE if not exists revit.reviews(
  id VARCHAR(64) NOT NULL,
  username VARCHAR(64) NOT NULL,
  course VARCHAR(64) NOT NULL,
  link VARCHAR(64) NOT NULL
);

CREATE TABLE if not exists revit.feedback(
  id VARCHAR(64) NOT NULL,
  username VARCHAR(64) NOT NULL,
  comment VARCHAR(64) NOT NULL
);


-- Dummy data
use revit
INSERT INTO reviews (id, username, course, link)
VALUES ('abc123', 'UPxxxxxxx', 'Application Engineering', 'wwww.google.com')

-- use revit
-- INSERT INTO user (id, email, password);
-- VALUES (1, "munir", "test")
