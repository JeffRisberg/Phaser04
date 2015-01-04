define(function () {
    'use strict';

    function MainMenu() {
    }

    MainMenu.prototype = {
        preload: function () {
            this.load.image('background', 'media/backgrounds/mainMenu.png');
            this.load.spritesheet('button-start', 'media/buttons/button-start.png', 401, 143);
        },

        create: function () {
            this.input.keyboard.createCursorKeys();
            this.background = this.add.tileSprite(0, 0, this.stage.bounds.width, this.stage.bounds.width, 'background');

            this.add.button(580, 200, 'button-start', this.startGame, this, 1, 0, 2);
        },

        update: function () {
        },

        startGame: function () {
            this.game.state.start('Game');
        }
    };

    return MainMenu;
});
