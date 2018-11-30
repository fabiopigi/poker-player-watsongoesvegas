const fetch = require('node-fetch');

class Player {
  static get VERSION() {
    return '0.1';
  }



  static sameColor(card1, card2) {
    return card1.suit === card2.suit;
  }

  static consecutive(card1, card2) {
    if (!isNaN(card1.rank)) {
      return !isNaN(card2.rank)
        ? (parseInt(card1.rank) + 1 === parseInt(card2.rank) || parseInt(card2.rank) + 1 === parseInt(card1.rank))
        : card2.rank === 'J' || (card1.rank === '2' && card2.rank === 'A');
    } else {
      return !isNaN(card2.rank)
        ? card2.rank === 10
        : ((card1.rank === 'J' && card2.rank === 'Q')
          || (card1.rank === 'Q' && (card2.rank === 'K' || card2.rank === 'J'))
          || (card1.rank === 'K' && (card2.rank === 'A' || card2.rank === 'Q'))
          || (card1.rank === 'A' && card2.rank === 'K'));
    }
  }

  static hasGoodStart(cards) {
    return hasMultiple(cards, 2) || hasCard(cards, 'A') || hasCard(cards, 'K') || hasCard(cards, 'Q') || sameColor(cards[0], cards[1]) || consecutive(cards[0], cards[1]);
  }




  // GETS CALLED
  static betRequest(gameState, bet) {

    const rankingUrl = "http://rainman.leanpoker.org/rank";
    const cards = gameState.community_cards.concat(gameState.players[gameState.in_action].hole_cards);

    let fetchRequest = fetch(rankingUrl, { method: 'GET', body: cards })
      .then(res => res.json())
      .then(json => {
        console.log(json);

        let betValue = gameState.current_buy_in - gameState.players[gameState.in_action]['bet'];
        let rank = json.rank;

        if(rank > 1 ) {
          betValue = betValue + gameState.minimum_raise + 1;
        } else if (rank == 0) {
          betValue = 0;
        }

        bet(betValue);
      })
      .catch(err => console.error(err));;


  }

  static showdown(gameState) {
  }
}

module.exports = Player;
