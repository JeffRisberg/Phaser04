'use strict';

requirejs.config({
    paths: {
        //libs
        phaser: '../bower_components/phaser/build/phaser.min'
    }
});

require([
    'phaser',
    './game/states/menuState',
    './game/states/gameState'
], function (phaser, menuState, gameState) {
    var phaserGame = new Phaser.Game("100", "100", Phaser.AUTO, 'Phaser04');

    phaserGame.state.add('menu', menuState);
    phaserGame.state.add('game', gameState);

    phaserGame.state.start('menu');

    return phaserGame;
});

