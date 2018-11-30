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

  static hasMultiple(cards, times) {
    var i;
    for (i = 0; i < cards.length; i++) {
      if(cards.filter(card => card.rank === cards[i].rank).length >= times){
        return true;
      }
    }
    return false;
  }

  static hasGoodStart(cards) {

    return this.hasMultiple(cards, 2) ||
      this.hasCard(cards, 'A') ||
      this.hasCard(cards, 'K') ||
      this.hasCard(cards, 'Q') ||
      this.sameColor(cards[0], cards[1]) ||
      this.consecutive(cards[0], cards[1]);
  }


  // GETS CALLED
  static betRequest(gameState, bet) {

    const cards = gameState.community_cards.concat(gameState.players[gameState.in_action].hole_cards);
    let betValue = gameState.current_buy_in - gameState.players[gameState.in_action]['bet'];


    // console.log(gameState);

    //Check initial cards on hand before comm flipped
    if (gameState.community_cards.length === 0) {
      if (this.hasGoodStart(cards)) {
        bet(betValue);
      } else {
        bet(0);
      }
    } else {
      // community cards are available, we check API
      const rankingUrl = "http://rainman.leanpoker.org/rank" + "?cards="+encodeURI(JSON.stringify(cards));
      // console.log(rankingUrl);
      let fetchRequest = fetch(rankingUrl , {method: 'GET'})
        .then(response => response.json())
        .then(json => {
          let rank = json.rank;


          //Flop
          if (gameState.community_cards.length === 3)     {
            // console.log(rank);
            if (rank > 1) {
              betValue = betValue + gameState.minimum_raise + 1;
            } else if (rank === 0) {
              betValue = 0;
            }


          // The Turn
          } else if (gameState.community_cards.length === 4)     {
            // console.log(rank);
            if (rank > 1) {
              betValue = betValue + gameState.minimum_raise + 1;
            } else if (rank === 0) {
              betValue = 0;
            }


          //The River
          } else if (gameState.community_cards.length === 5)     {
            // console.log(rank);
            if (rank > 1) {
              betValue = betValue + gameState.minimum_raise + 1;
            } else if (rank === 0) {
              betValue = 0;
            }

          }








          bet(betValue);
        })
        .catch(err => console.error(err));
    }

  }

  static showdown(gameState) {
  }
}

module.exports = Player;
