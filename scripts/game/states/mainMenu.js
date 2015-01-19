define(function () {
    'use strict';
    var game;

    function MainMenu(_game) {
        game = _game;
    }

    MainMenu.prototype = {
        preload: function () {
            this.load.image('background', 'media/backgrounds/mainMenu.png');
            this.load.spritesheet('btn-game-start', 'media/buttons/btn-game-start.png', 401, 143);
        },

        create: function () {
            this.input.keyboard.createCursorKeys();
            this.background = this.add.tileSprite(0, 0, game.width, game.height, 'background');

            this.add.button(580, 200, 'btn-game-start', this.startGame, this, 1, 0, 2);
        },

        update: function () {
        },

        startGame: function () {
            this.game.state.start('Game');
        }
    };

    return MainMenu;
});
