class Player {
  static get VERSION() {
    return '0.1';
  }

  static betRequest(gameState, bet) {
    var betValue = gameState.current_buy_in - gameState.players[gameState.in_action]['bet'] + gameState.minimum_raise + 1;
    bet(betValue);
  }

  static showdown(gameState) {
  }
}

module.exports = Player;
