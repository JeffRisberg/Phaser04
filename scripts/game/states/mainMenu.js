define(function () {
    'use strict';

    function MainMenu() {
        this.asset = null;
        this.ready = false;
    }

    MainMenu.prototype = {
        preload: function () {
            this.load.image('background', 'media/backgrounds/mainMenu.png');
            this.load.spritesheet('button-start', 'media/buttons/button-start.png', 401, 143);
        },

        create: function () {
            var cursors = this.input.keyboard.createCursorKeys();
            this.background = this.add.tileSprite(0, 0, this.stage.bounds.width, this.stage.bounds.width, 'background');

            var button = this.add.button(this.world.centerX - 100, this.world.centerY, 'button-start', this.startGame, this, 1, 0, 2);
        },

        update: function () {
        },

        startGame: function () {
            this.game.state.start('Game');
        }
    };

    return MainMenu;
});
