var game = new Phaser.Game(800, 600, Phaser.AUTO, "game");



var boot = function(game){
  console.log("%cCreated by Matt McFarland", "color:white; background:red");
};

boot.prototype = {

  preload: function () {
    this.game.load.image('stars', 'assets/images/stars.jpg');
    this.game.load.image("loading","assets/images/loading.png");
    this.game.load.image("brand","assets/images/logo.png");
    this.game.load.script('preload', 'states/preload.js');
  },

  create: function () {
    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.game.state.add("Preload", preload);
    this.game.state.start("Preload");

  }
};

game.state.add("Boot", boot);
game.state.start("Boot");