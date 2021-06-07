"use strict";

const mysql = require("mysql2");

const config = require("./config");

const sql = mysql.createConnection(config.mysql);

module.exports.checkLogin = (email, pass) => {
  return new Promise((resolve, reject) => {
    sql.query(
      sql.format("select * from user where email = ? and password = ?", [
        email,
        pass,
      ]),
      (err, result) => {
        if (err) {
          reject(["failed sql query", err]);
          return;
        }

        const retval = [];

        result.forEach((row) => {
          retval.push({
            email: row.email,
            pass: row.password,
          });
        });

        resolve(retval);
      }
    );
  });
};

module.exports.addUser = (email, password) => {
  return new Promise((resolve, reject) => {
    // now add the file to the DB
    const dbRecord = {
      email: email,
      password: password,
    };

    sql.query(sql.format("INSERT INTO user SET ?", dbRecord), (err, result) => {
      if (err) {
        reject(["failed sql insert", err]);
        return;
      }

      resolve({
        id: result.insertId,
        email: dbRecord.email,
        password: dbRecord.password,
      });
    });
  });
};
