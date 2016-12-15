/**
 * Created by edchoi on 12/15/16.
 */
var google = require('googleapis');
var trainedmodels = google.prediction('v1.6').trainedmodels;
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

function auth (callback) {
  google.auth.getApplicationDefault(function (err, authClient) {
    if (err) {
      console.log('google auth error');
      process.exit();
      // return callback(err);
    }

    // The createScopedRequired method returns true when running on GAE or a
    // local developer machine. In that case, the desired scopes must be passed
    // in manually. When the code is  running in GCE or a Managed VM, the scopes
    // are pulled from the GCE metadata server.
    // See https://cloud.google.com/compute/docs/authentication for more
    // information.
    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
      // Scopes can be specified either as an array or as a single,
      // space-delimited string.
      authClient = authClient.createScoped([
        'https://www.googleapis.com/auth/prediction'
      ]);
    }
    callback(null, authClient);
  });
}


/**
 * @param {Object} phrase The phrase for which to predict sentiment,
 * e.g. "good morning".
 * @param {Function} callback Callback function.
 */
function predict (callback, client) {
  auth(function (err, authClient) {
    if (err) {
      return callback(err);
    }
    selectNews(client, authClient, function(authClient,allNews) {
      console.log('total number of articles: ' + allNews.length);
      callback(authClient, allNews, callback, client);
    });
  });
}

function predict_single(authClient, articles, callback, client) {
  var article = articles.pop();
  console.log('articles left: '+ articles.length);
  if (articles.length > -1) {
    trainedmodels.predict({
      auth: authClient,
      // Project id used for this sample
      project: 'the-option-102712',
      id: 'news-identifier-2',
      resource: {
        input: {
          // Predict sentiment of the provided phrase
          csvInstance: [article.headline, article.body]
        }
      }
    }, function (err, prediction) {
        if (err) {
          return console.log(err);
        }
        console.log(prediction.outputLabel);
        client.query('UPDATE news SET type=? WHERE news_id=?', [
          prediction.outputLabel, article.news_id
        ],
          function(err, rows) {
            if (err)
              console.log(err);
            else {
            }
        });
        callback(authClient, articles, callback, client);
      });
  } else {
    console.log('completed!');
  }
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

function selectNews(client, authClient, callback) {
  client.query('SELECT news_id, type, headline, body FROM news WHERE type=""',
    function(err, rows) {
      if (err)
        console.log(err);
      else {
        allNews = [];
        rows.forEach(function(value) {
          value.body = decodeStr(value.body);
          allNews.push(value);
        });
        console.log('News fetched!');
        callback(authClient, allNews, callback, client);
      }
    })
}

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './google.json';

var client = mysql.createConnection({
  user: 'root',
  password: DBpassword,
  database: 'MOSAIQ'
});
predict(predict_single, client);
