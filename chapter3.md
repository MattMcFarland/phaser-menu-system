Continued from [Chapter 2 - The Game Menu](./chapter2.md)

## Chapter 3 - Options Menu

Hi, and welcome back to the State Management Tutorial.  In the last chapter, we went over wiring up the Main Menu,
which will act as our "hub" of state management.  In this chapter, I'm going to show you how to use the main menu
to go to the options menu, and back.  We will be leveraging Phaser's State Management system, which does a lot of
great things for us, like memory cleanup.

In this Chapter we will touch on using Phaser's Mixin Utility, turning music off and on, and creating an even more
robust navitem factory.

For the options menu, we need another background image (800x600) - We'll also re-use our navitem factory to make
this easy.

So let's start with the file
game/assets/Options.js

```javascript
var Options = function() {};

Options.prototype = {
  preload: function () {
  },

  create: function () {
  }
};
```

### Exercise 1 - Scaffold options menu.

* Add background image to your options screen

* Have the Options screen open up when you click on "Options" from the main menu

* Add a back button to go back to the main menu.

## Part 2 - Navigating between Menu/Options

So, how'd you do?  I think after doing the last couple chapters you probably didn't have any issues.

So first, I add the options state to the game in Splash.js:

```javascript
    game.state.add("Options",Options);
```

Then, I change the callback handler for clicking on Options to load the options state.
```javascript
    this.addMenuOption('Options', function () {
      game.state.start("Options");
    });
```

The new background image is loaded during the splash screen preload(Splash.js):

```javascript
  loadImages: function () {
    game.load.image('menu-bg', 'assets/images/menu-bg.jpg');
    game.load.image('options-bg', 'assets/images/options-bg.jpg'); // <-- new!
  },
```

To add a nav-item for returning back to main menu from options screen, I copied the
navigation code from main menu and modified the handlers to send the user back.

```javascript
    this.addMenuOption('<- Back', function (e) {
      game.state.start("GameMenu");  // <-- navigates back to main menu!!
    });
```

But there was a problem with this..  The main issue is we're duplicating a lot of code
for the "`addMenuOption`" - basically I ended up copying the entire method over to the
options state.  As stated before, it's best to stay DRY(Don't repeat yourself) as much
as possible.

So how to do this?

Well I explored several different ways, and found multiple solutions.  I'm not sure what is the best
way, but I'm happy to share what I came up with and why.

First, I tried using "Class Inheritence" (for Javascript ES5, we're talking Prototype inheritence, or we
can just say that classes behave differently)

states/Base.js
```javascript
var BaseState = function () {};

BaseState.prototype.addMenuOption = function (text, callback) {
  var txt = game.add.text(30, (this.optionCount * 80) + 200, text, style.navitem.default);
  txt.inputEnabled = true;
  txt.events.onInputUp.add(callback);
  txt.events.onInputOver.add(function (target) {
    target.setStyle(style.navitem.hover);
  });
  txt.events.onInputOut.add(function (target) {
    target.setStyle(style.navitem.default);
  });
  this.optionCount ++;
};
```

So then the goal was to "extend" BaseState with the GameMenu.  After much trial and error and some help
with some awesome people, I ended up using `Object.assign` along with `Object.create`  (note, the ... contains
the init/create/etc functions)

```javascript
var GameMenu = Object.assign(Object.create(BaseState.prototype), { ... });
```

That worked, but I didn't really like using the nested functions, and really, all we want to do is just
have a "addMenuOption" function available without duplicating it.  So the end result was using Phaser's
`mixinPrototype` method.

Using the `mixinPrototype` method, I removed `Base.js` and created a new `lib/mixins.js` file.

game/lib/mixins.js:
```javascript
var mixins = {
  addMenuOption: function(text, callback) {
    var txt = game.add.text(30, (this.optionCount * 80) + 200, text, style.navitem.default);
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback);
    txt.events.onInputOver.add(function (target) {
      target.setStyle(style.navitem.hover);
    });
    txt.events.onInputOut.add(function (target) {
      target.setStyle(style.navitem.default);
    });
    this.optionCount ++;
  }
};
```

I wasn't exactly sure how to use Phaser's `mixinPrototype` method, but after some experimentation, the working
usage is this:
```
GameMenu.prototype = {

  init: function () {
    ...
  },

  create: function () {
    ...
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
```

So basically it takes the mixins object, which has a property called `addMenuOption`, and mixes it into
`GameMenu`, which subsequently then gets a copy with the same name: (`GameMenu.addMenuOption`)

Cool! So basically we've learned how to use a Phaser Utility for mixin, and we have sucessfully moved our
"navigation menu item factory" into a re-usable area.

But there was another issue.  The next issue was that I didnt really have control over the x/y positions
of the menu items created.  Remember, originally this was created for just the main menu.

But now, the goal (for me at least) was to put the menu option items in the center of the screen, instead
of on the side in the same position.  I also wanted them to be a different color, because the color of
the background was bright, and the natural white color didn't work so well.

### Exercise 2:

* Add the new mixin to the options menu

* Find a way to style the new options menu differntly, and stay DRY (Don't Repeat Yourself!) at the same time.

The second item here might be a bit too difficult, but don't fret.  As I write this right now, I haven't even
done it yet!  So if you get stuck, presuem to the next chapter and I'll share how I did it.

## Part 3: Adding the Menu Options

First I created new style, called "inverse":
```javascript
      inverse: {
        fill: 'black',
        stroke: 'black'
      },
```

But then, something started to bother me (it had been eating at me anyway already)

```javascript
  Object.assign(style.navitem.inverse, style.navitem.base);
  Object.assign(style.navitem.hover, style.navitem.base);
  Object.assign(style.navitem.default, style.navitem.base);
```

So what's wrong with the code up there?  Well nothing terrible, but it could grow into
a nightmare.  For one, I just don't like the duplication here of "Object.assign" and I thought,
wouldn't it be better to just make everything share `base?`

The goal is then, to write a function that:

* takes style.navitem.`base` and "assigns" it to style.navitem.`everythingelse`

```javascript
  for (var key in style.navitem) {
    if (key !== "base") {
      Object.assign(style.navitem[key], style.navitem.base)
    }
  }
```

Yes! That looks much better.  Now for anyone who is wondering about `hasOwnProperty` - this is not needed
here because the `style` object is `static` and will not contain inherited items therefor testing `hasOwnProperty`
would return the same list of items and is not needed at this time.

then I added optional argument to use that style instead:

game/states/Options.js:
```javsascript
    // addMenuOption(label, callback, style);

    this.addMenuOption('<- Back', function (e) {
      this.game.state.start("GameMenu");
    }, 'inverse');
```

game/lib/mixins.js
```javascript
  addMenuOption: function(text, callback, className) {
    className || (className = "default");
    var txt = game.add.text(30, (this.optionCount * 80) + 200, text, style.navitem[className]);
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
```

Alright!  That looks better, but there were some other things missing.
I couldn't center the objects or change the x position.  So the next step
was to do just that.

However, It started to make it look like we'd be passing a lot of
parameters into a function, and it could easily spiral out of control
should we follow the same pattern every time we want to customize
the menuoption.  It also starts to blur the lines around the
"single responsibility" principal.

I can't say with full certaintity, what the best solution would be,
but in this case I ended up with this:

```javascript
Options.prototype = {

  menuConfig: {
    className: '' // instead of repeating "inverse" can set here
    startY: {},
    startX: {},  // x coord number or "center"
  },
```

So what's going on here?  Well instead of overloading the constructor,
and repeating ourselves over and over, I figured it be best to have
some sort of configuration object, that the nav-item factory can use
as reference for creating items.

The `{}` will be changed of course..

So now our `addMenuOption` looks like this:

```javascript
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
```

And our Game Menu is refactored to this:

```javascript
GameMenu.prototype = {

  // We'll just let the className fall back to the default setting
  // so there's no need to put it in our menuConfig...
  menuConfig: {
    startY: 260,
    startX: 30
  },
  ...
```

Then our options menu is refactored to this:

```javascript
  menuConfig: {
    className: "inverse",
    startY: 260,
    startX: "center"
  },
```

So now we stay DRY, and have some handry customization options for
our menus!


## Part 4 - Toggle Options off/on

So far we've covered a lot of ground as far as creating an options
menu goes.  But now it's time to add some functionality.

The game does indeed have sound, but really only music.  However,
we'll be adding sound later so we'll add the handlers for that
as well.

So what do we need to allow the user to turn sound / music off and
on, and persist their settings?

First, we need to create some variables we can access across the entire game.

I had originally put "music" in Splash.js, but now when I am going
to have our option settings 9along with the music var) in the same place.

all in main.js, since that is our bootstrapping component.

game/main.js
```javascript

// Global Variables
var
  game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),
  Main = function () {},
  playSound = true,
  playMusic = true,
  music;

...
```

So we start with our Game, then set the default settings to show
playSound and playMusic, and we also use the music variable to contain
the music to play.  However, I'm not really liking these names,
so I ended up changing them to this:

```javascript
var
  game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),
  Main = function () {},
  gameOptions = {
    playSound: true,
    playMusic: true
  },
  musicPlayer;
```

We can then toggle out sound/music with our Options screen like so:

```javascript
  create: function () {
    var playSound = gameOptions.playSound,
        playMusic = gameOptions.playMusic;

    game.add.sprite(0, 0, 'options-bg');
    game.add.existing(this.titleText);
    this.addMenuOption(playMusic ? 'Mute Music' : 'Play Music', function (target) {
      playMusic = !playMusic;
      target.text = playMusic ? 'Mute Music' : 'Play Music';
      musicPlayer.volume = playMusic ? 1 : 0;
    });
    this.addMenuOption(playSound ? 'Mute Sound' : 'Play Sound', function (target) {
      playSound = !playSound;
      target.text = playSound ? 'Mute Sound' : 'Play Sound';
    });
    this.addMenuOption('<- Back', function () {
      game.state.start("GameMenu");
    });
  }
```

And we set the musicPlayer in the Splash screen object here:

in Splash.js
```javascript
  addGameMusic: function () {
    musicPlayer = game.add.audio('dangerous');
    musicPlayer.loop = true;
    musicPlayer.play();
  },
```

And of course our splash screen will need to run `addGameMusic`,
so its create function looks like this:

```javascript
  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
```

### Part 5 - Wrap up

Ok so we covered a lot of ground here:

- created the the options menu
- learn to modify music player settings (volume play state)
- modified our game option menu factory to work across states!
- increated reusability for our style library.
- learned more about Object.assign, Object.create
- learned about using Phaser's Utility Mixin function


Ok! So now you should have a fully working Splash Screen, Game Menu, and Options Menu!

Here is the final result:
lib/mixins.js:
```javascript
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

```
states/Options.js
```javascript
var Options = function(game) {};

Options.prototype = {

  menuConfig: {
    className: "inverse",
    startY: 260,
    startX: "center"
  },


  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Game Title", {
      font: 'bold 60pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },
  create: function () {
    var playSound = gameOptions.playSound,
        playMusic = gameOptions.playMusic;

    game.add.sprite(0, 0, 'options-bg');
    game.add.existing(this.titleText);
    this.addMenuOption(playMusic ? 'Mute Music' : 'Play Music', function (target) {
      playMusic = !playMusic;
      target.text = playMusic ? 'Mute Music' : 'Play Music';
      musicPlayer.volume = playMusic ? 1 : 0;
    });
    this.addMenuOption(playSound ? 'Mute Sound' : 'Play Sound', function (target) {
      playSound = !playSound;
      target.text = playSound ? 'Mute Sound' : 'Play Sound';
    });
    this.addMenuOption('<- Back', function () {
      game.state.start("GameMenu");
    });
  }
};

Phaser.Utils.mixinPrototype(Options.prototype, mixins);

```

And we refactored main.js, GameMenu.js, and Splash.js.

main.js - we add the gameOptions object and the musicPlayer object

Splash.js - we preload our new mixins.js

GameMenu - we refactor to use our mixin for nav item factory

Options - new file


In the next chapter, we will wire in the gameOver and credits states, stay tuned.
If you like this tutorial please STAR it and share it with your friends! Also be sure to contact me with any questions
at @docodemore on twitter.  If you have any suggestions please let me know as well.

Thanks!!
