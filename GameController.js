var crypto = require('crypto');
var querystring = require('querystring');

var _ = require('underscore');

var Nails = require('./Nails')
var Game = require('./Game');

var respond = Nails.respond;
var games = {};

module.exports = {

  create: function(request, response, match) {
    var id = crypto.randomBytes(8).toString('hex');
    games[id] = new Game();
    respond(
      response,
      201,
      {"Content-Type": "application/json"},
      JSON.stringify({
        id: id,
        width: games[id].x,
        height: games[id].y,
      })
    );
  },

  guess: function(request, response, match) {
    var game = games[match[1]];
    if (!game) respond(response, 404, {}, "game not found");
    var card = match[2] + "," + match[3]
    value = game.guess(card);
    if (!value) respond(response, 404, {}, "card not found: " + card);
    respond(response, 200, {}, value);
  },

  end: function(request, response, match) {
    var game = games[match[1]];
    if (!game) respond(response, 404, {}, "game not found");
    var body = "";
    request.on("data", function(chunk) { body += chunk; });
    request.on("end", function() {
      var processedData = {};
      var data = querystring.parse(body);
      _.each(['x1', 'y1', 'x2', 'y2'], function(k) {
        if (data[k] && (!isNaN(parseInt(data[k])))) {
          processedData[k] = data[k];
        }
        else {
          return respond(response, 400, {}, "non-int or missing field: " + k);
        }
      });
      var win = game.end([
        processedData.x1 + "," + processedData.y1,
        processedData.x2 + "," + processedData.y2
      ]);
      respond(
        response,
        200,
        {"Content-Type": "application/json"},
        JSON.stringify({
          success: win,
          message: win ? "for the win!" : "epic fail"
        })
      );
    });
  },

}
