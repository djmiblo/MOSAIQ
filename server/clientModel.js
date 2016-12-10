var $;
require("jsdom").env("", function(err, window) {
  if (err) {
    console.error(err);
    return;
  }

  $ = require("jquery")(window);
});

$.ajax({
  url: 'localhost:41212/news',
  type: 'GET',
  
})
