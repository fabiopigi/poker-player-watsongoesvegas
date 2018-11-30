const fetch = require('node-fetch');

class Player {
  static get VERSION() {
    return '0.1';
  }





  static betRequest(gameState, bet) {

    const rankingUrl = "http://rainman.leanpoker.org/rank";
    const cards = gameState.community_cards.concat(gameState.players[gameState.in_action].hole_cards);

    let fetchRequest = fetch(rankingUrl, { method: 'GET', body: cards })
      .then(res => res.json())
      .then(json => {
        console.log(json);

        let betValue = gameState.current_buy_in - gameState.players[gameState.in_action]['bet']

        let rank = json.rank;
        if(rank > 1 ) {
          betValue = betValue + gameState.minimum_raise + 1;
        }

        bet(betValue);
      });


  }

  static showdown(gameState) {
  }
}

module.exports = Player;
