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
var countType = {};


function countMinType(callback) {
  var client = mysql.createConnection({
    user: 'root',
    password: DBpassword,
    database: 'MOSAIQ'
  })

  client.query('SELECT type, COUNT(*) FROM news WHERE type<>"" GROUP BY type',
    function(err, rows) {
      if (err)
        console.log(err);
      else {
        countType = {
          '경제': 0,
          '국제': 0,
          '기술': 0,
          '문화': 0,
          '사회': 0,
          '스포츠': 0,
          '정치': 0,
        };

        rows.forEach(function(value) {
          countType[value.type] = value['COUNT(*)'];
        })

        callback();
      }
    }
  )
}

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

        console.log(countType['정치']);
        console.log(countType['국제']);
        console.log(countType['경제']);
        console.log(countType['기술']);
        console.log(countType['문화']);
        console.log(countType['스포츠']);
        console.log(countType['사회']);

        rows.forEach(function(value) {
          if (countType[value.type] > 0) {
            value.body = decodeStr(value.body);
            allNews.push(value);
            countType[value.type]--;
          }
        })
        callback();
      }
    })
}


countMinType(
  function() {
    var min = Infinity;
    Object.keys(countType).forEach(function(type) {
      if (min > countType[type])
        min = countType[type];
    })
    Object.keys(countType).forEach(function(type) {
      countType[type] = min;
    })

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
  }
);
