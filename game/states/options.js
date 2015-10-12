var Options = function(game) {};

Options.prototype = {

  preload: function () {
    this.optionCount = 1;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: 'black', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 260, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "black";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;
  },

  create: function () {
    game.add.sprite(0, 0, 'options-bg');
    var titleStyle = { font: 'bold 60pt TheMinion', fill: '#FDFFB5', align: 'center'};
    var text = game.add.text(game.world.centerX, 190, "Options", titleStyle);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    text.anchor.set(0.5);
    this.addMenuOption(playMusic ? 'Mute Music' : 'Play Music', function (target) {
      playMusic = !playMusic;
      target.text = playMusic ? 'Mute Music' : 'Play Music';
      music.volume = playMusic ? 1 : 0;
    });
    this.addMenuOption(playSound ? 'Mute Sound' : 'Play Sound', function (target) {
      playSound = !playSound;
      target.text = playSound ? 'Mute Sound' : 'Play Sound';
    });
    this.addMenuOption('<- Back', function (e) {
      this.game.state.start("GameMenu");
    });

  }
};