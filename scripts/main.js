'use strict';

requirejs.config({
    baseUrl: './scripts',
    paths: {
        //libs
        almond: '../bower_components/almond/almond',
        Phaser: '../bower_components/phaser/index',

        //states (files)
        gameState: 'game/states/game',
        preloaderState: 'game/states/preloader',
        mainMenuState: 'game/states/mainMenu'
    },
});

require([
    'Phaser',
    'gameState',
    'preloaderState',
    'mainMenuState'
], function(Phaser,game, preloader, mainMenu) {
    var phaserGame = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');
   
console.log("Phaser game start");
    phaserGame.state.add('Game', game);
    phaserGame.state.add('Preloader', preloader);
    phaserGame.state.add('MainMenu', mainMenu);
    
    //start with main menu
    phaserGame.state.start('MainMenu');

    return phaserGame;
});

