Continued from [Chapter 1](./readme.md)

## Chapter 2 - The Main Menu

Hi and welcome back to the State Management Tutorial.  In the last chapter we learned how to create a cool splash
screen, we loaded assets (including a custom font), and we added game states that will be used for the rest of our
game.

The next game state we are going to work on is the main menu.  For the main menu, we'll be using another background
image (800x800), we'll actually use our custom font, and we'll add navigation items which will take us to other
states of the game.


### Part 1 - Overview

In this chapter we are going to learn how to create navigation menu items that will allow us to move to other states.
Some important aspects are handling events with text sprites, on hover, on click, etc.  Another thing we'll be doing
is creating a cool re-usable function that will make adding menu items a breeze.  We'll also touch on browser
compatibility, and I'll provide some insight into javascripts engine.

The end result will be a well polished game menu state that you can re-use for many of your games in the future.

Ok so let's get started!!!

In the last chapter we have Splash.js loading the state of GameMenu.js

game/assets/GameMenu.js

```javascript
var GameMenu = function() {};

GameMenu.prototype = {
  preload: function () {
  },

  create: function () {
  }
};
```

Nothing special so far, but now we want to add our background and title.  actually let's see if you can do it on your
own!  Enter the first challenge of chapter 2!

#### Exercise 1:

* Add a background image to the game menu

* Add a title to the game menu and use the custom font we made

### Part 2 - Adding background and title

How did you do?  I hope you had fun!  Here's how I did it:

``` javascript
    var bg = game.add.sprite(0, 0, 'menu-bg'),
        // titleStyle uses the font property, which will set our font to TheMinion
        titleStyle = { font: 'bold 60pt TheMinion', fill: '#FDFFB5', align: 'center'},
        text = game.add.text(game.world.centerX, 100, "Game Title", titleStyle);

    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    text.anchor.set(0.5);
```

Not bad, but you know I don't like declaring a variable I only use once.  I don't think it's absolutely necessary,
and if I were prototyping I certainly wouldn't mind.  But since the goal is a well polished game menu, I don't
want to define a variable and never use it.  Sure it might be good to do it now, simply because we might in the future.
At any rate, I'll be following the pattern I put together in the last tutorial and use the init function.

```javascript
  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "Game Title", {
      font: 'bold 60pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
  },
```

Alright, that's looking better.  I still don't like having to use this.titleText two more times just to set
shadow and anchor.  If I could chain I would, but this will have to do for now.  Our create function now looks like
this:

```javascript
create: function () {
  game.add.sprite(0, 0, 'menu-bg');
  game.add.existing(this.titleText);
}
```

But wait a second, there seems to be an issue here.  Everytime I switch focus to my IDE, the music stops!  I liked
how the game paused in splash screen, but I dont feel it is necessary for the navigation screens.  Wouldn't it be nice
if we could control it?  Well we can.. In fact, here's another challenge for you.

#### Exercise 2:

* Use the phaser.io documentation to find out how to stop pausing the game.

If you get stuck, we'll reveal how this is done in the next part.

### Part 3 - Prevent the game from pausing

How did you do?  The solution is pretty simple, but dont feel bad if you didn't find it.  I would like to say
right now that one of the strong points of phaser is it comes with stellar documentation.  So please take time
to review the docs.  However, it can be very overwhelming, there's a lot of text to go over, and it's easy to miss
something.  At any rate, here is how I stopped the game from pausing in our navigation menu:

```javascript
create: function () {
  game.add.sprite(0, 0, 'menu-bg');
  game.add.existing(this.titleText);
  game.stage.disableVisibilityChange = true; // <------ here it is
}
```

So anytime we want to change the behavior of how the game handles focus changes, we can simply change the boolean
value for `game.stage.disableVisibiltyChange` - just remember this is always false by default.

Another thing, from now on whenever we go to another state in the game, this setting will persist.  So if we want
to re-add auto-pause then it is important to set this to `false` when needed.

Alright so now it is time to add navigation items to the menu.  We want to add "Start", "Options", and "Credits"
in the next part, we'll go over adding them.  In fact this is great to give you another challenge!

#### Exercise 3:

Your mission, should you choose to accept it:

* Use our font and create a nav item that says "Start" -then make it log "You did it!" in the console on click.

### Part 4 - Adding navigation menu

So how did you do?  Here's what I came up with so far (annotated):
```javascript
    // looks like we have to create a style for or menu option
    var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left' };
    // the text for start
    var txt = game.add.text(30, 280, 'Start', optionStyle);
    // so how do we make it clickable?  We have to use .inputEnabled!
    txt.inputEnabled = true;
    // Now every time we click on it, it says "You did it!" in the console!
    txt.events.onInputUp.add(function () { console.log('You did it!') });
```

So the tricky parts were probably adding inputEnabled and the `events.onInputUp.add` methods -
As you can see you cannot make a text item clickable unless you enable input using `inputEnabled`

Now, let's make it change colors when you hover over it, I decided to give it an off-white yellowish color
when a user hovers over my font...

```javascript
txt.events.onInputOver.add(function (target) {
        target.fill = "#FEFFD5";
});

```

That's great, but there is a problem!  Now the menu item stays yellow, even after you move the mouse away!
That's because the game isonly listening for when the mouse goes over the text, it then changes it yellow, and
does nothing else.  The important part to understand is that it does nothing else because you have to tell it to
do something once the mouse is no longer over it.  Fortunately, phaser has added a handy method to use `onInputOut`

So to make it turn back to the original white color, we can do something like this:

```javascript
txt.events.onInputOut.add(function (target) {
        target.fill = "white";
});
```
Awesome!! So now we have a pretty cool looking navigation menu item.  But what if we want to add more?

You know, I am thinking about staying DRY(remember: Don't Repeat Yourself!) all over again.  First of all, if we
are adding a bunch of navigation items, we might want to create a `navigation item maker factory` (cool name lol),
we also might want to create some type of global stylesheet, if all of our nav items are going to have the same color
and style, it might be good to have them reference one area of the game, because in the future if you want to
change the theme or colors of your game, you dont want to have to hunt for it everywhere in your code.

So there are two problems we are facing:

1.  We are re-using the same font in many places, as well as same colors, etc.

2.  We need to create multiple nav items that will use a lot of the same code.

These are fun challenges I think, and sure you could copy-paste the code, but that is a bad practice because if you
ever need to change something in the future it will take you more time.  Now if you were prototyping a game, I dont
think its wise to polish the code to be DRY, because staying DRY always takes additional time.  However, if you want
to make some polished, reusable code, its always best to focus on being DRY when possible.

#### Exercise 4:

1. Create a navigation menu item factory - this is a function you can re-use that will create menu items for you!

2. Have the factory automatically set the y position of the option items, so as you add them, it appends them vertically
after each other.

3. Have the factory automatically set the style of the text for you.

4. Have the factory use a callback function, so you can easily add the click handlers to each new item you make.

### Part 5 - Nav-Item Factory

So how did you do?  Don't be upset if you struggled, especially if this was your first time creating something like this.
I want to congratulate you for still getting this far.  I also want to say that as you progress in your career, you will
run into situations like this ALL OF THE TIME.  Creating "factories" are really fun, and can save you a ton of time
in the future.  However, when you are prototyping a game or project, you should avoid creating factories too much,
because they can be time-consuming.  It really is an art - to know when to use a factory and when not to.  I can say
from experience, that I always opt-in to making one if I can, simply because I want to be able to make factories with
little effort.  That way, it won't take up too much time, if that makes sense.  Also you can't develop the art of doing
this unless you put it into experience.  I encourage you to explore the world of creating object factories.

Anyway, this is what I came up with:

```javascript
  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(30, (this.optionCount * 80) + 200, text, optionStyle);
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
    };
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback);
    txt.events.onInputOver.add(onOver);
    txt.events.onInputOut.add(onOut);
    this.optionCount ++;
  },

```

we use `optionCount` to calculate where to vertically place each nav item, so we set it to 1 on preload.

```javascript
  preload: function () {
    this.optionCount = 1;
  },
```

So now we have an awesome addMenuOption factory function that takes in two parameters.  The first one is the text,
think "Start", "Credits", "Options", etc.  We also set the style for every item we pass in, and we set the hover
events, etc.  Another cool thing, is we use onInputUp to handle the mouse click event and use the callback paramater so
we can have a special function for every menu option we add.  Now, all we need to do to add the menu option to our game
menu is this:
```javascript
    this.addMenuOption('Start', function (target) {
      console.log('You clicked Start!');
    });
    this.addMenuOption('Options', function (target) {
      console.log('You clicked Options!');
    });
    this.addMenuOption('Credits', function (target) {
      console.log('You clicked Credits!');
    });
```

So what is `target` ??  Phaser passes the newly created object into the event handler for us, which is nice.

But!! This can still be better.  For one, we should now consider creating some sort of global stylesheet that
phaser can use, that way it will be easier to style our components throughout the rest of the game.  It will
also make it easier to refactor.  So now I am going to offer you another challenge :)

#### Exercise 5:

1. Create a new file: game/lib/style.js
2. Make sure to load the file in our splash screen.
3. Create a javascript object which will contain key/value pairs of common styles.
4. We want a common style for nav items, and our game title.
5. Use the common styles instead of declaring them in the game menu.
6. Hint: You can use .setStyle to change style of the text

### Part 6 - A global stylesheet

How did you do?  This one was a doozy for me!!  Here's how I created my global style sheet:

First I tried this:

```javascript

  var defaultColor = "white",
    highlightColor = "#FEFFD5";

    navitem: {
      base: {
      },
      default: {
        fill: defaultColor,
        stroke: 'rgba(0,0,0,0)'
        font: '30pt TheMinion',
        align: 'left',
        strokeThickness: 4
      },
      hover: {
        fill: highlightColor,
        stroke: 'rgba(200,200,200,0.5)'
      }
    }

```

However, I very much did not like defaultColor and highlightColor globally scoped!!  So how to not globally scope them?

You wrap your code in an anonymous function, because javascript is functionally scoped!

```
var hello = null; <-- this function can be accessed outside of the wrapped function
// this is a wrapped function
(function () {

 var myvar = 'world'

 hello = myvar;


)();  // <--- ending () executes function immediately after read.

console.log(hello);
// outputs 'hello world' - Yes, I'm showing closure as well!!!!
```

The point of the example above is to show you that you can wrap functions to scope your variables, and any time
you use the variables to assign something else (like hello for example), the value is still retained.  This is known
as closure.  I am not going to explain it further in this tutorial, but I want to at least mention it here.

Then I cleaned up my the factory to this!

```javascript
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
  },
```

BUT SOMETHING WENT WRONG!! :(

The text on hover shrank and the font disappeared.  Yes, setStyle erases everything.

So without looking too much into phaser.io docs (there actually may be something there, if there is let me know),
I refactored my style to this:

```javascript
var style;

// this is a wrapped function
(function () {

  // the variables declared here will not be scoped anywhere and will only be accessible in this wrapped function
  var defaultColor = "white",
    highlightColor = "#FEFFD5";

  style = {
    header: {
      font: 'bold 60pt TheMinion',
      fill: defaultColor,
      align: 'center'
    },
    navitem: {
      base: {
        font: '30pt TheMinion',
        align: 'left',
        strokeThickness: 4
      },
      default: {
        fill: defaultColor,
        stroke: 'rgba(0,0,0,0)'
      },
      hover: {
        fill: highlightColor,
        stroke: 'rgba(200,200,200,0.5)'
      }
    }
  };

  Object.assign(style.navitem.hover, style.navitem.base);
  Object.assign(style.navitem.default, style.navitem.base);

})();

// Remember, the trailing () triggers the function call immediately

```

Yes!! Now we're talking! it works like a charm!

Something new here:
```javascript
  Object.assign(style.navitem.hover, style.navitem.base);
  Object.assign(style.navitem.default, style.navitem.base);
```

So I use Object.assign, which merges objects into each other.  This is available in modern browsers, you could also
use `Phaser.Utils.extend`, or `jquery.extend`, or `underscore.extend`, or `lodash.assign`.  However, I prefer to use what
is already there.

Now, I dont want a bunch of Object.assigns, but you see the pattern here? We have style.someclass.base first.
So we could theoretically create a simple forEach loop that goes over
every child that has .base, then merges its siblings!  Since we dont need to do that right now, I am going to
forgo it.  But I may show you how to do this at a later time in this tutorial.

But what about browser compatability?  Well, let's make sure we do that as well.  You can always get a `polyfill`!

A polyfill is basically some extra code you can add to your project that ensures functions in modern browsers work
in older browsers.  The benefit is you can use the modern tech and still support older browsers.

Mozilla's website is filled with polyfills, a simple google search for "Object.assign" worked for me.

Also, while we are at it.  Remember when we used .forEach??  well that needs a polyfill too. so I grabbed both
from mozilla's website, and put them inside a single file.

So here's what I did:

1. Created lib/polyfill.js
2. Made sure to load it into the game!
3. Copy/Pasted pollyfills from Mozillas website for `.forEach` and `Object.assign`

You can simply use [lib/polyfill.js](./game/lib/polyfill.js)

### Part 7 - Wrap up

Ok so we covered a lot of ground here:

- created the game menu title
- created game menu options
- created a game menu option factory to stay DRY!
- created a global stylesheet to style our ingame UI!
- we learned about cool functions like Object.assign
- we learned about polyfills and browser compatibility


Ok! So now you should have a fully working game menu!!

Here is the final result:

(I am skipping polyfill.js here! just an FYI)

lib/style.js:
```javascript
var style;

// this is a wrapped function
(function () {

  // the variables declared here will not be scoped anywhere and will only be accessible in this wrapped function
  var defaultColor = "white",
    highlightColor = "#FEFFD5";

  style = {
    navitem: {
      base: {
        font: '30pt TheMinion',
        align: 'left',
        srokeThickness: 4
      },
      default: {
        fill: defaultColor,
        stroke: 'rgba(0,0,0,0)'
      },
      hover: {
        fill: highlightColor,
        stroke: 'rgba(200,200,200,0.5)'
      }
    }
  };

  Object.assign(style.navitem.hover, style.navitem.base);
  Object.assign(style.navitem.default, style.navitem.base);

})();
```

Now here is our new GameMenu.js :

```javascript
var GameMenu = function() {};

GameMenu.prototype = {

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
    game.stage.disableVisibilityChange = true;

    game.add.sprite(0, 0, 'menu-bg');
    game.add.existing(this.titleText);

    this.addMenuOption('Start', function () {
      console.log('You clicked Start!');
    });
    this.addMenuOption('Options', function () {
      console.log('You clicked Options!');
    });
    this.addMenuOption('Credits', function () {
      console.log('You clicked Credits!');
    });
  }
};
```

Continue on to Read on to [Chapter 3 - The Options Menu](./chapter3.md)
If you like this tutorial please STAR it and share it with your friends!

Thanks!!
