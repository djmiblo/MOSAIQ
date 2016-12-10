var express = require('express');
var mkdirp = require('mkdirp');
var async = require('async');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var jQuery;
require("jsdom").env("", function(err, window) {
  if (err) {
    console.error(err);
    return;
  }

  jQuery = require("jquery")(window);
});


function crawlNews() {
  var url = 'http://m.news.naver.com/newspaper/home.nhn';
  var data = {
    date: '',
    publishers: {
      /*
      SampleNews: {
        nlink: '<link_to_news_home>',
        articles: [{
          headline: '',
          body: '<body_of_article>',
          images: [<href_to_image>],
          alink: '<link_to_article>'
        }]
      }
      */
    }
  }



  function completeURL(url) {
    return 'http://m.news.naver.com' + url;
  }

  //filterPublisher = ['전자신문', '동아일보', '아시아경제', '서울신문', '문화일보', '중앙일보', '경향신문', '세계일보', '코리아헤럴드'];
  filterPublisher = ['코리아헤럴드'];
  function filterAd(publisher, $) {
    if (publisher === '전자신문') {
      // has to be fixed to regex filter
      $('#dic_area a').has('strong').remove();
    } else if (publisher === '동아일보') {
      /*
       * If there is a bug, it will be here!!!!!!!!!!!
       */
      var replaced = $('#dic_area').html()
      .replace(/\[&#xB3D9;&#xC544;&#xC77C;&#xBCF4;\]<br></g, '');
      $('#dic_area').html(replaced);
      $('#dic_area strong').has('a').remove();
      /*
       * If there is a bug, it will be here!!!!!!!!!!!
       */
    } else if (publisher === '아시아경제') {
      // has to be fixed to regex filter
      $('#dic_area a').has('b').remove();
    } else if (publisher === '서울신문') {
      var replaced = $('#dic_area').html()
      .replace(/\[&#xC11C;&#xC6B8;&#xC2E0;&#xBB38;\]/g, '')
      .replace(/&#x25B6;\ \[/g, '')
      .replace(/\],\ &#xC7AC;&#xBBF8;&#xC788;&#xB294;\ &#xC138;&#xC0C1;\[/g, '')
      .replace(/\]\ <br>/g, '')
      .replace(/\]\ \[/g, '')
      .replace(/<\/a>\]/g, '<\/a>');
      $('#dic_area').html(replaced);
      $('#dic_area a').each(function() {
        if ($(this).attr('href') === 'http://www.seoul.co.kr/news/wellmadeNews.php')
          $(this).remove();
        else if ($(this).attr('href') === 'http://nownews.seoul.co.kr')
          $(this).remove();
        else if ($(this).attr('href') === 'http://contents.seoul.co.kr/')
          $(this).remove();
        else if ($(this).attr('href') === 'http://www.facebook.com/TheSeoulShinmun')
          $(this).remove();
      })
    } else if (publisher === '문화일보') {
      var replaced = $('#dic_area').html()
      .replace(/<b>\[\ .+\]<\/b>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '중앙일보') {
      var replaced = $('#dic_area').html()
      .replace(/&#x25B6;SNS.+<\/a><br>/g, '<br>');
      $('#dic_area').html(replaced);
    } else if (publisher === '코리아헤럴드') {
      var replaced = $('#dic_area').html()
      .replace(/\[<a.+&#xC2A4;&#xBD81;<\/a>\]\ <br>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '디지털타임스') {
    } else if (publisher === '한겨레') {
    } else if (publisher === '머니투데이') {
    } else if (publisher === '경향신문') {
      var replaced = $('#dic_area').html()
      .replace(/\=\"\"/g, '')
      .replace(/&#x25B6;\ &#xACBD;&#xD5A5;.+&#xBD81;\]<\/a><br>/g, '');
      $('#dic_area').html(replaced);
      console.log($('#dic_area').html().replace(/\=\"{2}/g, ''));
      replaced = $('#dic_area').html()
      .replace(/&#x25B6;\ <a.+&#xBCF4;&#xAE30;\]<\/a><br>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '코리아타임스') {
    } else if (publisher === '한국경제') {
    } else if (publisher === '국민일보') {
    } else if (publisher === '한국일보') {
    } else if (publisher === '파이낸셜뉴스') {
    } else if (publisher === '매일경제') {
    } else if (publisher === '서울경제') {
    } else if (publisher === '조선일보') {
    } else if (publisher === '세계일보') {
      var replaced = $('#dic_area').html()
      .replace(/&#x25B6;\[.+&#xB4F1;&#xB85D;/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '헤럴드경제') {
    } else {
      console.log('error at filterAd');
    }
  }

  async.waterfall([
    function scrapePublisher(callback) {
      request(url, function(error, response, html) {
        if (!error) {
          var $ = cheerio.load(html);

          /*
           * get every publishers' name and link
           */
          $('.offc_ct').each(function() {
            var newsName = $(this).find('img').attr('alt');
            var newsLink = $(this).children('.offc_ct_wraplink').attr('href');

            // continue if news has not published yet
            if (typeof newsLink === "undefined") {
              return true;
            }

            /*
             * test code
             */
            jQuery.each(filterPublisher, function(idx, val) {
              if (newsName === val) {
                data.publishers[newsName] = {
                  nlink: completeURL(newsLink),
                  articles: []
                }
              }
            })
            /*
             * test code
             */
          });

          /*
           * save date of the news to var date
           */
          $('span._date_title').each(function() {
            var dateGot = $(this).clone().children().remove().end().text()
                       .replace(/^\s+|\s+$/g, '').replace(/\./g, '-');
            data.date = dateGot;
          })

          callback(null);
        } else {
          callback('error while getting publisher');
        }
      })
    },
    function scrapeArticleLink(callback) {
      var leftPublisher = [];

      jQuery.each(data.publishers, function(name, info) {
        leftPublisher.push([name, info.nlink]);
      })

      async.whilst(
        function tester() { 
          return leftPublisher.length > 0;
        },
        function scrapeEachLink(callback) {
          var dataProd = leftPublisher.pop();
          var name = dataProd[0];
          var nlink = dataProd[1];

          request(nlink, function(error, response, html) {
            if(!error) {
              var $ = cheerio.load(html);

              $('._persist_wrap').children().each(function() {
                if ( $(this).hasClass('newspaper_wrp') ) {
                  $(this).find('a').each(function() {
                    var alink = completeURL( $(this).attr('href') );
                    data.publishers[name].articles.push(alink);
                  })
                }
              })

              callback(null, 'success at scrapeEachLink');
            } else {
              callback('error in scrapeEachLink');
            }
          })
        }, 
        function(err, result) {
          if (!err) {
            callback(null);
          } else {
            console.log(err);
          }
        }
      )
    },
    function scrapeArticles(fstCallback) {
      var leftPublishers = {};
      jQuery.each(data.publishers, function(name, newsInfo) {
        leftPublishers[name] = newsInfo.articles.slice(0);
        newsInfo.articles = [];
      })

      async.whilst(
        function() {
          var hasLink = false;
          jQuery.each(leftPublishers, function(name, links) {
            if (links.length > 0)
              hasLink = true;
          })
          return hasLink;
        },
        function(sndCallback) {

          var leftArticles = [];
          var publisherName = '';
          jQuery.each(leftPublishers, function(name, links) {
            if (links.length > 0) {
              leftArticles = links;
              publisherName = name;
            }
          })

          async.whilst(
            function() {
              return leftArticles.length > 0;
            },
            function(trdCallback) {
              var link = leftArticles.pop();
              var articleData = { alink: link };

              request(link, function(error, response, html) {
                if (!error) {
                  var $ = cheerio.load(html);

                  articleData.headline = 
                    $('div.article_header_title_box > h2.subject').text();
                  filterAd(publisherName, $);
                  articleData.body = $('#dic_area').html();

                  data.publishers[publisherName].articles.push(articleData);

                  trdCallback(null, 'success at trdCallback');
                } else {
                  trdCallback('error in trdCallback');
                }
              })
            },
            function(err, result) {
              if (!err) {
                sndCallback(null, 'success at sndCallback');
              } else {
                console.log(err);
              }
            }
          )

        },
        function(err, result) {
          if (!err) {
            fstCallback(null);
          } else {
            console.log(err);
          }
        }
      )

    },
    function insertDB(callback) {
      var client = mysql.createConnection({
        user: 'root',
        password: 'ghkfkd',
        database: 'MOSAIQ'
      })

      var date = data.date;

      jQuery.each(data.publishers, function(key, value) {
        var publisher = key;

        jQuery.each(value.articles, function(idx, obj) {
          var headline = obj.headline;
          var body = obj.body;
          var alink = obj.alink;

          client.query('INSERT INTO news (date, publisher, headline, body, link) VALUES (?,?,?,?,?)', [
            date, publisher, headline, body, alink
          ], function(err, data) {
            if (err)
              console.log(err);
          })

        })
      })

      callback(null, 'DBtest');
    }
  ], function(err) {
    if (!err) {
      fs.writeFile(data.date + '.json', JSON.stringify(data, null, 2),
        function(err) {
          if (err)
            console.log(err);
        })
      console.log('waterfall ended successfully!');
    } else {
      console.log(err);
    }
  })
}




function callAt5() {
  var now = new Date();
  var millisTill5 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0, 0, 0) - now;
  if (millisTill5 < 0) {
       millisTill5 += 86400000; // it's after 5am, try 5am tomorrow.
  }
  setTimeout(function(){alert("It's 5am!")}, millisTill5);
}

setInterval(callAt5, 86400000);
