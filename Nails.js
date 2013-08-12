var url = require('url');

var respond = function(response, status, headers, data) {
  response.writeHead(status, headers);
  response.end(data);
}

var route = function(routes, request, response) {
  methodRoutes = routes[request.method];
  if (!methodRoutes) respond(response, 405, {}, "Method Not Allowed");
  parsedUrl = url.parse(request.url, true);
  for (var i = 0; i < methodRoutes.length; i++) {
    methodRoute = methodRoutes[i];
    if (match = url.parse(request.url).pathname.match(methodRoute[0])) {
      methodRoute[1](request, response, match);
      return;
    }
  }
  respond(response, 404, {}, "Not Found");
}

module.exports = {
  respond: respond,
  route: route,
}
