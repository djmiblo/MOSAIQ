var mysql = require('mysql');
var json2csv = require('json2csv');
var fs = require('fs');
require("jsdom").env("", function(err, window) {
  if (err) {
    console.error(err);
    return;
  }

  $ = require("jquery")(window);
});

if (process.argv.length < 3) {
  console.log('Usage: node plainText.js <DB password>');
  process.exit();
}

function decodeStr(str) {
  var regexp = /<[^<>]+>/g;
  str.replace(regexp, '');
  regexp = /\\n/g;
  str.replace(regexp, '');
  regexp = /\\t/g;
  str.replace(regexp, '');
  regexp = /\\\"/g;
  str.replace(regexp, '');
  return $('<div/>').html(str).text();
}

var allNews = [];
var DBpassword = process.argv[2];

function selectNews(callback) {
  var client = mysql.createConnection({
    user: 'root',
    password: DBpassword,
    database: 'MOSAIQ'
  })

  client.query('SELECT type, headline, body FROM news WHERE type<>""',
    function(err, rows) {
      if (err)
        console.log(err);
      else {
        allNews = [];
        rows.forEach(function(value) {
          value.body = decodeStr(value.body);
          allNews.push(value);
        })
        callback();
      }
    })
}

selectNews(function() {
  var fields = ['type', 'headline', 'body'];
  var csv = json2csv({ data: allNews, fields: fields });

  fs.writeFile('file.csv', csv, function(err) {
    if (err)
      console.log(err);
    else
      console.log('file saved!');
  })
})
