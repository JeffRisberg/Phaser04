'use strict';

requirejs.config({
    baseUrl: './scripts',
    paths: {
        //libs
        almond: '../bower_components/almond/almond',
        Phaser: '../bower_components/phaser/index',

        //states
        preloaderState: 'game/states/preloader',
        mainMenuState: 'game/states/mainMenu',
        gameState: 'game/states/game'
    }
});

require([
    'Phaser',
    'preloaderState',
    'mainMenuState',
    'gameState'
], function (Phaser, game, preloader, mainMenu) {
    var phaserGame = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'Phaser04');

    phaserGame.state.add('Preloader', preloader);
    phaserGame.state.add('MainMenu', mainMenu);
    phaserGame.state.add('Game', game);

    // Start with main menu
    phaserGame.state.start('MainMenu');

    return phaserGame;
});

