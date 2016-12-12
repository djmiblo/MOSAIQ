var async = require('async');
var mysql = require('mysql');
var $;
require("jsdom").env("", function(err, window) {
  if (err) {
    console.error(err);
    return;
  }

  $ = require("jquery")(window);
});

function decodeStr(str) {
  return $('<div/>').html(str).text();
}

var client = mysql.createConnection({
  user: 'root',
  password: 'ghkfkd',
  database: 'MOSAIQ'
})

client.query('SELECT body FROM news',
  function(err, rows) {
    if (err)
      console.log(err);
    else {
      var body = rows[50].body;

      var regexp = /\<[^\<\>]+\>/g;
      body = body.replace(regexp, '');
      body = decodeStr(body);

      regexp = /[^\s]+/g;
      var arr = body.match(regexp);

      var counts = {};
      arr.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

      var sortable = [];
      for (var word in counts)
        sortable.push([word, counts[word]])

      sortable.sort(function(a, b) {
          return b[1] - a[1]
      })

      console.log(sortable);

      process.exit();
    }
  }
)
