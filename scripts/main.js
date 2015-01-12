'use strict';

requirejs.config({
    //baseUrl: './scripts',
    paths: {
        //libs
        almond: '../bower_components/almond/almond',
        phaser: '../bower_components/phaser/build/phaser.min',

        //states
        mainMenuState: 'game/states/mainMenu',
        gameState: 'game/states/game'
    }
});

require([
    'phaser',
    'mainMenuState',
    'gameState'
], function (phaser, mainMenu, game) {
    var phaserGame = new Phaser.Game("100", "100", Phaser.AUTO, 'Phaser04');

    phaserGame.state.add('MainMenu', mainMenu);
    phaserGame.state.add('Game', game);

    phaserGame.state.start('MainMenu');

    return phaserGame;
});

