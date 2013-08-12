var _ = require('underscore');

var Game = function() {
  this.x = 4;
  this.y = 4;

  // generate cards
  this.cards = [];
  for (x = 0; x < this.x; x++) {
    for (y = 0; y < this.y; y++) {
      this.cards.push([x, y].toString());
    }
  }
  this.valuesByCard = {};

  // generate card values
  chr = 97;
  inc = 0;
  shuffledCards = _.shuffle(this.cards);
  for (i = 0; i < shuffledCards.length; i++) {
    this.valuesByCard[shuffledCards[i]] = String.fromCharCode(chr);
    chr += inc++ % 2;
  }

  this.lastCard = null;
  this.ended = false;
}

Game.prototype.guess = function(card) {
  if (this.ended) return null;
  if (card[0] >= this.x || card[1] >= this.y) return null;
  value = this.valuesByCard[card];
  if (this.lastCard) {
    if (value == this.valuesByCard[this.lastCard]) {
      this.cards = _.difference(this.cards, [card, this.lastCard])
    }
    this.lastCard = null;
  }
  else {
    this.lastCard = card;
  }
  return value;
}

Game.prototype.end = function(cards) {
  if (this.ended) return false;  // game already ended
  this.ended = true;
  return this.cards.length == 2 && _.difference(this.cards, cards).length == 0;
}

module.exports = Game;
