var dbm = require('db-migrate');
var type = dbm.dataType;
var fs = require('fs');
var path = require('path');

exports.up = function(db, callback) {
  db.createTable('questions', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    question: 'string',
    countdown: 'int',
    category: 'int',
    answers: 'string',
    correctAnswer: 'string'
  }, seed(callback));

  function seed(callback) {
    var filePath = path.join(__dirname + '/seeds/questions.sql');
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return console.log(err);
      db.runSql(data, function(err) {
        if (err) return console.log(err);
        callback();
      });
    });
  }
};

exports.down = function(db, callback) {
  db.dropTable('questions', callback);
};
