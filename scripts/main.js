'use strict';

requirejs.config({
    baseUrl: './scripts',
    paths: {
        //libs
        almond: '../bower_components/almond/almond',
        Phaser: '../bower_components/phaser/index',

        //states
        mainMenuState: 'game/states/mainMenu',
        gameState: 'game/states/game'
    }
});

require([
    'Phaser',
    'mainMenuState',
    'gameState'
], function (Phaser, mainMenu, game) {
    var phaserGame = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'Phaser04');

    phaserGame.state.add('MainMenu', mainMenu);
    phaserGame.state.add('Game', game);

    phaserGame.state.start('MainMenu');

    return phaserGame;
});

