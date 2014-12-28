define(['Phaser'], function (Phaser) {
    _game = {};

    function Candy(game) {
        _game = game;

        var candy = game.add.sprite(dropPos, dropOffset[candyType], 'candy');

        // enable candy body for physics engine
        game.physics.enable(candy, Phaser.Physics.ARCADE);
    }

    return Candy;
});