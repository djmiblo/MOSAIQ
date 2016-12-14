var http = require('http');
var express = require('express');
var xml = require('xml');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');
require("jsdom").env("", function(err, window) {
  if (err) {
    console.error(err);
    return;
  }

  $ = require("jquery")(window);
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

if (process.argv.length < 3) {
  console.log('Usage: node plainText.js <password>');
  process.exit();
}

function decodeStr(str) {
  var regexp = /<[^<>]+>/g;
  str.replace(regexp, '');
  return $('<div/>').html(str).text();
}

var allNews = [];
var DBpassword = process.argv[2];

function calcLen(str) {
  return parseInt(str.length / 8);
}

function selectNews(date, callback) {
  var client = mysql.createConnection({
    user: 'root',
    password: DBpassword,
    database: 'MOSAIQ'
  })

  client.query('SELECT type, headline, body FROM news WHERE date=?', [date],
    function(err, rows) {
      if (err)
        console.log(err);
      else {
        allNews = [];
        rows.forEach(function(value) {
          value.body = decodeStr(body);
          allNews.push(value);
        })
        callback();
      }
    })
}

app.get('/', function(req, res) {
  var date = req.query.date;
  selectNews(date, function() {
    res.set({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*'
    })

    if (allNews.length != 0)
      res.json(allNews);
    else {
      res.json({
        error: "no data for " + date
      });
    }
  })
})

http.createServer(app).listen(41211, function() {
  console.log('Server Running at localhost:41211');
})
