var express = require('express');
var mkdirp = require('mkdirp');
var async = require('async');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mysql = require('mysql');
var jQuery;
require("jsdom").env("", function(err, window) {
  if (err) {
    console.error(err);
    return;
  }

  jQuery = require("jquery")(window);
});


function crawlNews() {
  var url = '';
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


  function setURL() {
    var date = process.argv[2];
    var regexp = /^\d{8}$/;
    if (date == null)
      url = 'http://m.news.naver.com/newspaper/home.nhn';
    else if (date.match(regexp) !== null)
      url = 'http://m.news.naver.com/newspaper/home.nhn?date=' + date;
    else
      url = 'http://m.news.naver.com/newspaper/home.nhn';
  }

  function completeURL(url) {
    return 'http://m.news.naver.com' + url;
  }

  function filterAd(publisher, $) {
    if (publisher === '전자신문') {
      $('#dic_area a').has('strong').remove();
    } else if (publisher === '동아일보') {
      var replaced = $('#dic_area').html()
      .replace(/\[&#xB3D9;&#xC544;&#xC77C;&#xBCF4;\]<br></g, '');
      $('#dic_area').html(replaced);
      $('#dic_area strong').has('a').remove();
    } else if (publisher === '아시아경제') {
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
      var replaced = $('#dic_area').html()
      .replace(/<a\ href\=\"http\:\/\/www\.dt\.co\.kr.+&#xC139;&#xC158;\ &#xBC14;&#xB85C;&#xAC00;&#xAE30;<\/a>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '한겨레') {
      var replaced = $('#dic_area').html()
      .replace(/&#x25B6;\ &#xBC1C;&#xB784;&#xD55C;.+\[&#xC601;&#xC0C1;&#xB274;&#xC2A4;\]<\/a><br>/g, '')
      $('#dic_area').html(replaced);
    } else if (publisher === '머니투데이') {
      var replaced = $('#dic_area').html()
      .replace(/<a\ href=\"http:\/\/tom\..+the\ 300&apos;\]<\/a>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '경향신문') {
      var replaced = $('#dic_area').html()
      .replace(/\=\"\"/g, '')
      .replace(/&#x25B6;\ &#xACBD;&#xD5A5;.+&#xBD81;\]<\/a><br>/g, '');
      $('#dic_area').html(replaced);
      replaced = $('#dic_area').html()
      .replace(/&#x25B6;\ <a.+&#xBCF4;&#xAE30;\]<\/a><br>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '코리아타임스') {
    } else if (publisher === '한국경제') {
      var replaced = $('#dic_area').html()
      .replace(/<br>\[<a\ href=\"http:\/\/www\.hankyung\.com.+&#xC2E0;&#xCCAD;<\/a>\]/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '국민일보') {
      var replaced = $('#dic_area').html()
      .replace(/<b><a\ href=\"http:\/\/www\.kmib.+&#xBC14;&#xB85C;&#xAC00;&#xAE30;\]<\/font><\/a><\/b>/g, '');
      $('#dic_area').html(replaced);
      replaced = $('#dic_area').html()
      .replace(/<a\ href=\"http:\/\/www\.mission.+&#xBC14;&#xB85C;&#xAC00;&#xAE30;\]<\/font><\/b><\/a><br>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '한국일보') {
      var replaced = $('#dic_area').html()
      .replace(/\[<a\ href=\"http:\/\/www\.hankookilbo\.com\/\">&#xC544;&#xC9C1;.+&#xCE5C;&#xAD6C;&#xB9FA;&#xAE30;<\/a>\]<br>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '파이낸셜뉴스') {
      var replaced = $('#dic_area').html()
      .replace(/<strong><a\ href=\"http:\/\/pas\.fnnews.+<\/strong>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '매일경제') {
      var replaced = $('#dic_area').html()
      .replace(/<a\ href=\"https:\/\/www\.facebook\.com\/maekyungsns\/.+&#xD504;&#xB9AC;&#xBBF8;&#xC5C4;\]<\/a><br>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '서울경제') {
      var replaced = $('#dic_area').html()
      .replace(/<ul><li><a\ href=\"http:\/\/www\.sedaily.+&#xD398;&#xC774;&#xC2A4;&#xBD81;\]<\/a><\/li><\/ul><br>/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '조선일보') {
      var replaced = $('#dic_area').html()
      .replace(/\[<a\ href=\"http:\/\/www\.chosun.+&#xBC14;&#xB85C;&#xAC00;&#xAE30;<\/a>\]/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '세계일보') {
      var replaced = $('#dic_area').html()
      .replace(/&#x25B6;\[.+&#xB4F1;&#xB85D;/g, '');
      $('#dic_area').html(replaced);
    } else if (publisher === '헤럴드경제') {
      var replaced = $('#dic_area').html()
      .replace(/<br><a\ href=\"http:\/\/www\.englishqbig.+&#xAE4C;&#xC694;\?<\/a>/g, '')
      .replace(/<br><br>/g, '<br>');
      $('#dic_area').html(replaced);
    } else if (publisher === '이데일리') {
    } else {
      console.log('error at filterAd');
    }
  }

  async.waterfall([
    function scrapePublisher(callback) {
      setURL();
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

            data.publishers[newsName] = {
              nlink: completeURL(newsLink),
              articles: []
            }
          });

          /*
           * save date of the news to var date
           */
          $('span._date_title').each(function() {
            var dateGot = $(this).clone().children().remove().end().text()
                       .replace(/^\s+|\s+$/g, '').replace(/\./g, '-').replace(/-.$/g, '');
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
            callback(err);
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
                  articleData.body = $('#dic_area').html().
                    replace(/data\-src/g, 'src').
                    replace(/(\<img.+)(\>)/g, '$1\/$2').
                    replace(/(\<br)(\>)/g, '$1\/$2');

                  data.publishers[publisherName].articles.push(articleData);

                  trdCallback(null);
                } else {
                  trdCallback('error in trdCallback');
                }
              })
            },
            function(err) {
              if (!err) {
                sndCallback(null);
              } else {
                console.log(err);
                sndCallback('error in sndCallback');
              }
            }
          )

        },
        function(err) {
          if (!err) {
            fstCallback(null);
          } else {
            fstCallback(err);
          }
        }
      )

    },
    function insertDB(fstCallback) {
      var client = mysql.createConnection({
        user: 'root',
        password: 'ghkfkd',
        database: 'MOSAIQ'
      })

      var date = data.date;

      var leftPublishers = [];
      jQuery.each(data.publishers, function(name, newsInfo) {
        var pubInfo = {};
        pubInfo['name'] = name;
        pubInfo['articles'] = newsInfo.articles.slice();
        leftPublishers.push(pubInfo);
      })

      async.whilst(
        function() {
          return leftPublishers.length > 0;
        },
        function(sndCallback) {
          var publisher = leftPublishers.pop();

          async.whilst(
            function() {
              return publisher.articles.length > 0;
            },
            function(trdCallback) {
              var name = publisher.name;
              var article = publisher.articles.pop();
              var headline = article.headline;
              var body = article.body;
              var alink = article.alink;

              client.query('INSERT INTO news (date, publisher, headline, body, link) VALUES (?,?,?,?,?)', [
                date, name, headline, body, alink
              ], function(err, data) {
                if (err) {
                  console.log(err);
                  trdCallback('error while querying MySQL');
                }
                else
                  trdCallback(null);
              })
            },
            function(err) {
              if (err)
                sndCallback(err);
              else
                sndCallback(null);
            }
          )
        },
        function(err) {
          if (err)
            fstCallback(err);
          else
            fstCallback(null);
        }
      )
    },
    function saveToFile(callback) {
      fs.writeFile(data.date + '.json', JSON.stringify(data, null, 2),
        function(err) {
         if (err)
            callback(err);
          else {
            callback(null);
          }
        });
    }
  ], function(err) {
    if (err) {
      console.log(err);
      process.exit();
    }
    else {
      console.log('waterfall ended successfully!');
      process.exit();
    }
  })
}

crawlNews();
