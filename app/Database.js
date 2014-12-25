var Database = function () {
  'use strict';
  var mysql = require('mysql');
  this.Connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'quiz2014'
  });
};

Database.prototype.Query = function Query(sql, callback) {
  var data;
  console.log(sql);
  this.Connection.query(sql, function(err, rows, fields) {
    if (err) throw err;
    callback(rows);
  });
}

exports.Database = function () {
  return new Database();
};

