var request = require('request');

request({
  url: 'http://shinia.net/gisa', //URL to hit
  qs: {date: '20161212'}, //Query string data
  method: 'GET', //Specify the method
  headers: { //We can define headers too
    'Content-Type': 'application/json',
  }
}, function(error, response, body){
  if(error) {
    console.log(error);
  } else {
    var obj = JSON.parse(body);
    console.log(obj[1300].publisher);
    console.log(obj[1300].headline);
  }
});
