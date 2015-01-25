define(['game/extensions/PausePanel'], function (PausePanel) {
    'use strict';

    var platforms, player, cursors, groups = {}, timers = {};
    var game;
    var paused = false;
    var score = 0;
    var scoreText;
    var energy = 25;
    var energyText;
    var fx;

    function Game(_game) {
        game = _game;
    }

    Game.prototype = {
        preload: function () {
            this.load.image('background', 'media/backgrounds/background.png');
            this.load.image('ground', 'media/backgrounds/ground.png');
            this.load.image('pipe', 'media/characters/pipe.png');
            this.load.image('razor', 'media/characters/razor.png');
            this.load.image('powerup', 'media/characters/powerup.png');
            this.load.image('star', 'media/characters/star.png');
            this.load.image('btnPause', 'media/buttons/btn-pause.png');
            this.load.image('btnPlay', 'media/buttons/btn-play.png');
            this.load.image('panel', 'media/backgrounds/panel.png');

            this.load.bitmapFont('kenpixelblocks', 'media/fonts/kenpixelblocks/kenpixelblocks.png', 'media/fonts/kenpixelblocks/kenpixelblocks.fnt');

            this.load.spritesheet('dude', 'media/characters/dude.png', 32, 48);

            this.load.audio('sfx', 'media/audio/fx_mixdown.ogg');
        },

        create: function () {
            this._fontStyle = { font: "30px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "center" };

            this.pausePanel = new PausePanel(this);
            this.add.existing(this.pausePanel);

            this.background = game.add.tileSprite(0, 0, game.width, game.cache.getImage('background').height, 'background');

            this.createPlatform();
            this.createGroup('pipes', 'pipe', this.addOnePipe, 1500);
            this.createGroup('razors', 'razor', this.addOneRazor, 2800);
            this.createGroup('powerups', 'powerup', this.addOnePowerup, 5425);
            this.createGroup('stars', 'star', this.addOneStar, 4500);

            player = game.add.sprite(32, game.world.height - 150, 'dude');
            player.scale.setTo(2, 2);
            game.physics.arcade.enable(player);
            player.x = Math.floor((game.world.width) / 4);

            // Player physics properties. Give the little guy a slight bounce.
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 2000;
            player.body.collideWorldBounds = true;

            // Our two animations, walking left and right.
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);
            player.animations.add('up', [0], 10, true);

            cursors = game.input.keyboard.createCursorKeys();
            game.camera.follow(player);

            this.btnPause = this.add.button(game.world.width - 100, 20, 'btnPause', this.pauseGame, this);

            scoreText = this.game.add.text(20, 20, "Score: " + score,
                { font: "35px Arial", fill: "#000" });
            energyText = this.game.add.text(game.world.width - 320, 20, "Energy: " + energy,
                { font: "35px Arial", fill: "#000" });

            fx = game.add.audio('sfx');
            fx.addMarker('ping', 10, 1.0);
            fx.addMarker('death', 12, 4.2);
            fx.addMarker('shot', 17, 1.0);
        },

        pauseGame: function () {
            if (player.alive) {
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
            }
        },

        hideAllGroups: function () {
            for (var i in groups) {
                groups[i].visible = false;
            }
        },

        showAllGroups: function () {
            for (var i in groups) {
                groups[i].visible = true;
            }
        },

        playGame: function () {
            if (paused) {
                paused = false;
                this.pausePanel.hide();
            }
        },

        update: function () {
            game.physics.arcade.overlap(player, groups["pipes"], this.hitBaddie, null, this);
            game.physics.arcade.overlap(player, groups["razors"], this.hitBaddie, null, this);
            game.physics.arcade.overlap(player, groups["powerups"], this.eatPowerup, null, this);
            game.physics.arcade.overlap(player, groups["stars"], this.eatStar, null, this);

            game.physics.arcade.collide(player, platforms);

            this.background.tilePosition.x -= 3;

            player.body.velocity.x = 0;
            player.rotation = 0;

            player.animations.play('right');

            if (player.alive) {
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
            }
        },

        addOnePipe: function () {
            var pipe = groups['pipes'].getFirstDead();
            var delta = Math.floor(Math.random() * 400);
            pipe.reset(game.width, game.height - 120 - delta);
            pipe.body.velocity.x = -200;
            pipe.checkWorldBounds = true;
            pipe.outOfBoundsKill = true;
            game.add.tween(pipe).to({ y: 100 }, 1900, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
        },

        addOneRazor: function () {
            var razor = groups['razors'].getFirstDead();
            var delta = Math.floor(Math.random() * 400);
            razor.reset(game.width, game.height - 100 - delta);
            razor.body.velocity.x = -200;
            razor.checkWorldBounds = true;
            razor.outOfBoundsKill = true;
        },

        addOnePowerup: function () {
            var powerup = groups['powerups'].getFirstDead();
            var delta = Math.floor(Math.random() * 200);
            powerup.reset(game.width, game.height - 150 - delta);
            powerup.scale.setTo(2, 2);
            powerup.body.velocity.x = -200;
            powerup.checkWorldBounds = true;
            powerup.outOfBoundsKill = true;
            game.add.tween(powerup).to({ y: 150 }, 2200, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
        },

        addOneStar: function () {
            var star = groups['stars'].getFirstDead();
            var delta = Math.floor(Math.random() * 300);
            star.reset(game.width, game.height / 2 - delta);
            star.scale.setTo(2, 2);
            star.body.velocity.x = -200;
            star.checkWorldBounds = true;
            star.outOfBoundsKill = true;
        },

        eatStar: function (player, star) {
            star.kill();
            score += 10;
            scoreText.text = 'Score: ' + score;
            fx.play("ping");
        },

        eatPowerup: function (player, powerup) {
            powerup.kill();
            energy += 1;
            energyText.text = 'Energy: ' + energy;
            fx.play("ping");
        },

        hitBaddie: function (player, baddie) {
            baddie.kill();
            energy--;
            energyText.text = 'Energy: ' + energy;

            if (energy < 1) {
                player.alive = false;

                // Prevent new sprites from appearing
                for (var i in timers) {
                    timers[i].timer.stop(true);
                }

                // Go through all the sprites in the groups, and stop their movement
                for (var i in groups) {
                    groups[i].forEachAlive(function (p) {
                        p.body.velocity.x = 0;
                    }, this);
                }

                var gameOverText = this.add.text(game.world.width / 2, game.world.height / 2, "Sorry, Game Over", { font: "50px Arial"});
                gameOverText.anchor.set(0.5);

                fx.play("death");
            }
            else {
                fx.play("shot");
            }
        },

        createGroup: function (name, img, createFn, freq) {
            groups[name] = game.add.group();
            groups[name].enableBody = true;
            groups[name].createMultiple(15, img);
            timers[name] = this.game.time.events.loop(freq, createFn, this);
        },

        createPlatform: function () {
            platforms = game.add.group();

            //  We will enable physics for any object that is created in this group
            platforms.enableBody = true;

            // Here we create the ground.
            var ground = platforms.create(0, game.world.height - 50, 'ground');

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(4, 1);

            //  This stops it from falling away when you jump on it
            ground.body.immovable = true;
        }
    };

    return Game;
});
