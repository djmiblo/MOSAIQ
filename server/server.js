var http = require('http');
var express = require('express');
var xml = require('xml');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

var testData = JSON.parse(fs.readFileSync('2016-12-12.json', 'utf8'));
var allNews = [];

function calcLen(str) {
  return parseInt(str.length / 8);
}

function selectNews(date, callback) {
  var client = mysql.createConnection({
    user: 'root',
    password: 'ghkfkd',
    database: 'MOSAIQ'
  })

  client.query('SELECT date, publisher, headline, body, img FROM news WHERE date=?', [date],
    function(err, rows) {
      if (err)
        console.log(err);
      else {
        allNews = [];
        rows.forEach(function(value) {
          value.length = calcLen(value.body);
          value.img = value.img.split(',');
          allNews.push(value);
        })
        callback();
      }
    })
}

function ENtoKR(publisher) {
  if (publisher === 'donga') {
    return '동아일보';
  } else if (publisher === 'jeonja') {
    return '전자신문';
  } else if (publisher === 'asia') {
    return '아시아경제';
  } else if (publisher === 'seoul-shinmun') {
    return '서울신문';
  } else if (publisher === 'moonwha') {
    return '문화일보';
  } else if (publisher === 'jungang') {
    return '중앙일보';
  } else if (publisher === 'korea-herald') {
    return '코리아헤럴드';
  } else if (publisher === 'digital') {
    return '디지털타임스';
  } else if (publisher === 'hangyorae') {
    return '한겨레';
  } else if (publisher === 'money') {
    return '머니투데이';
  } else if (publisher === 'gyeonghyang') {
    return '경향신문';
  } else if (publisher === 'korea-times') {
    return '코리아타임스';
  } else if (publisher === 'hankook-finance') {
    return '한국경제';
  } else if (publisher === 'kookmin') {
    return '국민일보';
  } else if (publisher === 'hanguk-ilbo') {
    return '한국일보';
  } else if (publisher === 'financial') {
    return '파이낸셜뉴스';
  } else if (publisher === 'maeil') {
    return '매일경제';
  } else if (publisher === 'seoul') {
    return '서울경제';
  } else if (publisher === 'chosun') {
    return '조선일보';
  } else if (publisher === 'saegye') {
    return '세계일보';
  } else if (publisher === 'herald') {
    return '헤럴드경제';
  } else {
    return '';
  }
}

app.get('/news', function(req, res) {
  var date = req.query.date;
  selectNews(date, function() {
    if (allNews.length != 0)
      res.json(allNews);
    else {
      res.header("Content-Type",'application/json');
      res.json({
        error: "no data for " + date
      });
    }
  })
})

app.get('/:pub', function(req, res) {
  var idx = req.query.idx;
  var param = ENtoKR(req.params.pub);

  var output = '';
  output += '<!DOCTYPE html>';
  output += '<html>';
  output += '<head>';
  output += '    <title>Data HTML</title>';
  output += '</head>';
  output += '<body>';
  output += '<h1>';
  output += testData.publishers[param].articles[idx].headline;
  output += '</h1>';
  output += testData.publishers[param].articles[idx].body.replace(/data-src/g, "src")
  .replace(/\=\"{2}/g, '');
  output += '</body>';
  output += '</html>';

  res.send(output);
})


http.createServer(app).listen(41212, function() {
  console.log('Server Running at localhost:41212');
})
