var http = require('http');

var Nails = require('./Nails');
var GameController = require('./GameController');

var routes = {
  "POST": [
    [ /^\/games\/$/, GameController.create ],
    [ /^\/games\/(\w+)\/end$/, GameController.end ],
  ],
  "GET": [
    [ /^\/games\/(\w+)\/cards\/(\d+),(\d+)$/, GameController.guess ],
  ],
}

server = http.createServer(function(request, response) {
  Nails.route(routes, request, response);
});
server.listen(8000);
