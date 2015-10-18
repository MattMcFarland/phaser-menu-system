var mixins = {
  addMenuOption: function(text, callback, className) {

    // use the className argument, or fallback to menuConfig, but
    // if menuConfig isn't set, just use "default"
    className || (className = this.menuConfig.className || 'default');

    // set the x coordinate to game.world.center if we use "center"
    // otherwise set it to menuConfig.startX
    var x = this.menuConfig.startX === "center" ?
      game.world.centerX :
      this.menuConfig.startX;

    // set Y coordinate based on menuconfig
    var y = this.menuConfig.startY;

    // create
    var txt = game.add.text(
      x,
      (this.optionCount * 80) + y,
      text,
      style.navitem[className]
    );

    // use the anchor method to center if startX set to center.
    txt.anchor.setTo(this.menuConfig.startX === "center" ? 0.5 : 0.0);

    txt.inputEnabled = true;

    txt.events.onInputUp.add(callback);
    txt.events.onInputOver.add(function (target) {
      target.setStyle(style.navitem.hover);
    });
    txt.events.onInputOut.add(function (target) {
      target.setStyle(style.navitem[className]);
    });

    this.optionCount ++;
  }
};
