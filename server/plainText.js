var async = require('async');
var mysql = require('mysql');

var client = mysql.createConnection({
  user: 'root',
  password: 'ghkfkd',
  database: 'MOSAIQ'
})

client.query('SELECT body FROM news WHERE news_id="1668"',
  function(err, rows) {
    if
      (err) console.log(err);
    else {
      var body = rows[0].body;

      var regexp = /\<[^\<\>]+\>/g;
      body = body.replace(regexp, '');
      console.log(body);

      process.exit();
    }
  }
)
