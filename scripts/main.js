'use strict';

requirejs.config({
    paths: {
        //libs
        almond: '../bower_components/almond/almond',
        phaser: '../bower_components/phaser/build/phaser.min',

        //states
        menuState: 'game/states/menu',
        gameState: 'game/states/game'
    }
});

require([
    'phaser',
    'menuState',
    'gameState'
], function (phaser, menu, game) {
    var phaserGame = new Phaser.Game("100", "100", Phaser.AUTO, 'Phaser04');

    phaserGame.state.add('menu', menu);
    phaserGame.state.add('game', game);

    phaserGame.state.start('menu');

    return phaserGame;
});

