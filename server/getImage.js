var http = require('http'),                                                
    Stream = require('stream').Transform,                                  
    fs = require('fs');                                                    

var url = 'http://imgnews.naver.net/image/015/2016/10/11/AA.12669371.1_99_20161011192203.jpg?type=w430';                    

http.request(url, function(response) {                                        
  var data = new Stream();                                                    

  response.on('data', function(chunk) {                                       
    data.push(chunk);                                                         
  });                                                                         

  response.on('end', function() {                                             
    fs.writeFileSync('image.png', data.read());                               
  });                                                                         
}).end();
