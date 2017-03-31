var SpaceHipster = SpaceHipster || {}

//title screen
SpaceHipster.Game = function(){}

SpaceHipster.Game.prototype = {
    create: function(){
        //set world dimensions
        this.game.world.setBounds(0,0, 1920,1920)

        this.background = this.game.add.tileSprite(0,0, this.game.world.width, this.game.world.height, 'space')

        //create player
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership')
        this.player.scale.setTo(2)

        this.player.animations.add('fly', [0,1,2,3], 5, true)
        this.player.animations.play('fly')

        //Intital score
        this.playerScore = 0

        //enable player physics
        this.game.physics.arcade.enable(this.player)
        this.playerSpeed = 120
        this.player.body.collideWorldBounds = true

        //sounds
        this.explosionSound = this.game.add.audio('explosion')
        this.collectSound = this.game.add.audio('collect')

        //camera
        this.game.camera.follow(this.player)

        this.generateCollectables()
        this.generateAsteroids()
        this.showLabels()
    },

    update: function(){
        if(this.game.input.activePointer.justPressed()){
            this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed)
        }

        //collision between player and asteroids 
        this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this)
        //overlap between player and collectablles
        this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this)
    },

    generateAsteroids: function(){
        this.asteroids = this.game.add.group()

        //enable physics in them
        this.asteroids.enableBody = true
        this.asteroids.physicsBodyType = Phaser.Physics.arcade
        
        //phasers rand num generateAsteroids
        var numAsteroids = this.game.rnd.integerInRange(150,200)

        var asteroid
        for (var i = 0; i < numAsteroids; i++){
            //add sprite

            //calculations so rocks spawn around and not on top of the player
            var x = this.game.rnd.integerInRange(this.game.world.centerX + 100, this.game.world.width)
            var y = this.game.rnd.integerInRange(this.game.world.centerY + 100, this.game.world.height)
            x = this.game.rnd.integerInRange(0,1) ? this.game.world.width - x : x
            y = this.game.rnd.integerInRange(0,1) ? this.game.world.height - y : y
         
            asteroid = this.asteroids.create(x,y, 'rock')
            asteroid.scale.setTo(this.game.rnd.integerInRange(10, 40)/10)

            //Physics properties
            asteroid.body.velocity.x = this.game.rnd.integerInRange(-20,20)
            asteroid.body.velocity.y = this.game.rnd.integerInRange(-20, 20)
            asteroid.body.immovable = true
            asteroid.body.collideWorldBounds = true
        }
    },

    generateCollectables: function(){
        this.collectables = this.game.add.group()

        //physics
        this.collectables.enableBody = true;
        this.collectables.physicsBodyType = Phaser.Physics.arcade

        //num generateAsteroids
        var numCollectables = this.game.rnd.integerInRange(100,150)

        var collectables
        
        for(var i = 0; i < numCollectables; i++){
            //add sprite
            collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power')
            collectable.animations.add('fly', [0,1,2,3], 5, true)
            collectable.animations.play('fly')
        }
    },

    collect: function(player, collectable){
        //play sounds
        this.collectSound.play()

        //update score
        this.playerScore++
        this.scoreLabel.text = this.playerScore

        //remove sprite
        collectable.kill()
    },

    hitAsteroid: function(player, asteroid){
        //play explosion sounds
        this.explosionSound.play()

        //player explosion will be added here
        var emitter = this.game.add.emitter(this.player.x, this.player.y, 100)
        emitter.makeParticles('playerParticle')
        emitter.minParticleSpeed.setTo(-200, -200)
        emitter.maxParticleSpeed.setTo(200, 200)
        //emitter.gravity = 0
        emitter.start(true, 1000, null, 100)

        this.player.kill();
        
        this.game.time.events.add(800, this.gameOver, this)
    },

    showLabels: function(){
        //score text
        var text = "0"
        var style = {
            font: "20px Arial",
            fill: "#fff",
            align: "center"
        }
        this.scoreLabel = this.game.add.text(this.game.width - 50, this.game.height - 50, text, style)
        this.scoreLabel.fixedToCamera = true
    },

    gameOver: function(){
        //pass it as a parameter
        this.game.state.start('MainMenu', true, false, this.playerScore)
    }
}