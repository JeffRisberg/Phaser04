define(['game/extensions/PausePanel'], function (PausePanel) {
    'use strict';
    var platforms, player, cursors, groups = {};
    var game;
    var totalEnergy = 5;
    var paused = false;

    function Game(_game) {
        game = _game;
    }

    Game.prototype = {
        preload: function () {
            //pre load image
            this.load.image('background', 'media/backgrounds/background.png');
            this.load.image('ground2', 'media/backgrounds/ground.png');
            this.load.image('ground', 'media/backgrounds/platform.png');
            this.load.image('pipe', 'media/characters/pipe.png');
            this.load.image('razor', 'media/characters/pipe.png');
            this.load.image('spike', 'media/characters/pipe.png');
            this.load.image('star', 'media/characters/star.png');
            this.load.image('btnPause', 'media/buttons/btn-pause.png');
            this.load.image('btnPlay', 'media/buttons/btn-play.png');
            this.load.image('panel', 'media/backgrounds/panel.png');
            this.load.bitmapFont('kenpixelblocks', 'media/fonts/kenpixelblocks/kenpixelblocks.png', 'media/fonts/kenpixelblocks/kenpixelblocks.fnt');
            this.load.spritesheet('dude', 'media/characters/dude.png', 32, 48);
        },
        create: function () {
            // Add a pause button
            this.btnPause = this.game.add.button(20, 20, 'btnPause', this.pauseGame, this);
            this._fontStyle = { font: "40px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "center" };

            // Let's build a pause panel
            this.pausePanel = new PausePanel(this);
            this.add.existing(this.pausePanel);

            this.background = game.add.tileSprite(0, 0, game.stage.bounds.width, game.cache.getImage('background').height, 'background');

            this.createPlatform();
            this.createGroups('pipes', 'pipe', this.addOnePipe, 1500);
            this.createGroups('razors', 'razor', this.addOneRazor, 3000);
            this.createGroups('spikes', 'spike', this.addOneSpike, 5000);
            this.createGroups('stars', 'star', this.addOneStar, 5000);

            player = game.add.sprite(32, game.world.height - 500, 'dude');
            player.scale.setTo(3, 3);
            game.physics.arcade.enable(player);
            player.x = Math.floor((game.world.width) / 4);
            console.log('player');

            //  Player physics properties. Give the little guy a slight bounce.
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 2000;
            player.body.collideWorldBounds = true;

            //  Our two animations, walking left and right.
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);
            player.animations.add('up', [0], 10, true);

            cursors = game.input.keyboard.createCursorKeys();
            game.camera.follow(player);
            this.btnPause = this.add.button(game.world.width - 100, 20, 'btnPause', this.pauseGame, this);
            this.score = 0;

            this.labelScore = this.game.add.text(20, 20, "0", { font: "50px Arial", fill: "#000" });
        },

        pauseGame: function () {
            var self = this;
            this.game.paused = true;
            this.background.tint = 0x666699;
            this.hideAllGroups();
            var pausedText = this.add.text(game.world.width / 2, game.world.height / 2, "Game paused.\nTap anywhere to continue.", this._fontStyle);
            this.input.onDown.add(function () {
                pausedText.destroy();
                this.game.paused = false;
                this.background.tint = 0xFFFFFF;
                this.showAllGroups();
            }, this);
        },

        hideAllGroups: function () {
            for (var i in groups) {
                groups[i].setAll("visible", false);
            }
        },

        showAllGroups: function () {
            for (var i in groups) {
                groups[i].setAll("visible", true);
            }
        },

        playGame: function () {
            if (paused) {
                // Hide panel
                paused = false;
                this.pausePanel.hide();
            }
        },

        createGroups: function (name, img, createFn, freq) {
            groups[name] = game.add.group();
            groups[name].enableBody = true;
            groups[name].createMultiple(15, img);
            this.game.time.events.loop(freq, createFn, this);
        },

        update: function () {

            // game.physics.arcade.overlap(player, groups["pipes"], this.hitPipe, null, this);
            // game.physics.arcade.overlap(player, groups["razors"], this.hitPipe, null, this);
            // game.physics.arcade.overlap(player, groups["spikes"], this.hitPipe, null, this);
            game.physics.arcade.overlap(player, groups["stars"], this.eatStar, null, this);

            this.background.tilePosition.x -= 3;
            game.physics.arcade.collide(player, platforms);

            player.body.velocity.x = 0;
            player.rotation = 0;

            player.animations.play('right');
            if (cursors.down.isDown) {
                player.animations.stop();
                player.anchor = {x: 0.5, y: 0.5};
                player.rotation = 3.14 / 2;
                player.frame = 4;
            } else if (cursors.up.isDown && player.body.touching.down
                || (this.input.pointer1.isDown && player.body.touching.down)) {
                //  Move to the left
                player.body.velocity.y = -1300;
            }
        },

        addOnePipe: function () {
            var pipe = groups['pipes'].getFirstDead();
            var delta = Math.floor(Math.random() * 300);
            pipe.reset(game.stage.bounds.width, game.stage.bounds.height / 2 - delta);
            pipe.body.velocity.x = -200;
            pipe.checkWorldBounds = true;
            pipe.outOfBoundsKill = true;
            game.add.tween(pipe).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
        },

        //TODO: this is supposed to be spinning
        addOneRazor: function () {
            var razor = groups['razors'].getFirstDead();
            razor.tint = 0xff00ff;
            // var delta = Math.floor(Math.random() * 300);
            razor.reset(game.stage.bounds.width, game.stage.bounds.height - 250);
            razor.body.velocity.x = -200;
            razor.checkWorldBounds = true;
            razor.outOfBoundsKill = true;
        },

        addOneSpike: function () {
            var spike = groups['spikes'].getFirstDead();
            spike.tint = 0x00d33;
            // var delta = Math.floor(Math.random() * 300);
            spike.reset(game.stage.bounds.width, game.stage.bounds.height - 100);
            spike.body.velocity.x = -200;
            spike.checkWorldBounds = true;
            spike.outOfBoundsKill = true;
        },

        addOneStar: function () {
            var star = groups['stars'].getFirstDead();
            var delta = Math.floor(Math.random() * 300);
            star.reset(game.stage.bounds.width, game.stage.bounds.height / 2 - delta);
            star.scale.setTo(2, 2);
            star.body.velocity.x = -200;
            star.checkWorldBounds = true;
            star.outOfBoundsKill = true;
        },

        eatStar: function () {
            console.log("eat star");
        },

        hitPipe: function () {
            console.log("hit pipe");
            totalEnergy--;
            if (totalEnergy <= 0) {
                // Set the alive property of the bird to false
                //   player.alive = false;
                // // Prevent new pipes from appearing
                // game.time.events.remove(this.timer);

                // // Go through all the pipes, and stop their movement
                // this.pipes.forEachAlive(function (p) {
                //     p.body.velocity.x = 0;
                // }, this);
            }
        },

        createPlatform: function () {
            platforms = game.add.group();

            //  We will enable physics for any object that is created in this group
            platforms.enableBody = true;

            // Here we create the ground.
            var ground = platforms.create(0, game.world.height - 50, 'ground2');

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(4, 1);

            //  This stops it from falling away when you jump on it
            ground.body.immovable = true;
        }
    };

    return Game;
});
