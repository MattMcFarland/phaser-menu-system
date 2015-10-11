var preload = function(game) {};

var music;

var playSound = true;

var playMusic = true;

preload.prototype = {

  loadScripts: function () {
    this.game.load.script('WebFont', 'vendor/webfontloader.js');
    this.game.load.script('$', 'vendor/jquery.js');
    this.game.load.script('_', 'vendor/underscore.js');
    this.game.load.script('gamemenu', 'states/gamemenu.js');
    this.game.load.script('thegame', 'states/thegame.js');
    this.game.load.script('gameover', 'states/gameover.js');
    this.game.load.script('credits', 'states/credits.js');
    this.game.load.script('options', 'states/options.js');
  },

  loadSpriteSheets: function () {
    //
  },
  loadBgm: function () {
    this.game.load.audio('dangerous', 'assets/bgm/Dangerous.mp3');
    this.game.load.audio('exit', 'assets/bgm/Exit the Premises.mp3');
  },

  loadImages: function () {
    this.game.load.image('menu-bg', 'assets/images/menu-bg.jpg');
    this.game.load.image('options-bg', 'assets/images/options-bg.jpg');
    this.game.load.image('gameover-bg', 'assets/images/gameover-bg.jpg');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['TheMinion'],
        urls: ['assets/style/theminion.css']
      }
    }
  },

  preload: function () {
    var myLogo, loadingBar;
    game.add.sprite(0, 0, 'stars');
    myLogo = game.add.sprite(game.world.centerX-120, 100, 'brand');
    myLogo.alpha= 0;
    loadingBar = game.add.sprite(game.world.centerX-(387/2), 400, "loading");
    myLogo.scale.setTo(0.5);
    loadingBar.anchor.setTo(0.0, 0.0);
    this.status = game.add.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    this.status.anchor.setTo(0.5);
    this.load.setPreloadSprite(loadingBar);

    this.loadScripts();
    //this.loadSpriteSheets();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

    game.add.tween(myLogo).to( { alpha: 1 }, 500, "Linear", true);
  },
  create: function() {

    var self = this;
    music = game.add.audio('dangerous');
    music.loop = true;
    music.play();
    this.status.setText('Ready!');
    game.state.add("GameMenu",gameMenu);
    game.state.add("TheGame",theGame);
    game.state.add("GameOver",gameOver);
    game.state.add("Credits",credits);
    game.state.add("Options",options);
    setTimeout(function () {
      game.state.start("GameMenu");
    }, 100);


  }
};

window.preload = preload;