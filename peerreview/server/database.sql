CREATE DATABASE if not exists revit CHARACTER SET utf8;

CREATE TABLE if not exists revit.reviews(
  id VARCHAR(64) NOT NULL,
  username VARCHAR(64) NOT NULL,
  link VARCHAR(64) NOT NULL
);

CREATE TABLE if not exists revit.feedback(
  id VARCHAR(64) NOT NULL,
  username VARCHAR(64) NOT NULL,
  comment VARCHAR(64) NOT NULL
);


-- Dummy data
use revit
INSERT INTO reviews (id, username, link)
VALUES ('123', 'value2', 'value3')

