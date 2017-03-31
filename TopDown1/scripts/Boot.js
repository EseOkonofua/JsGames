var TopDownGame = TopDownGame || {};

TopDownGame.Boot = function(){}

//Game config and loading assets for loading screen
TopDownGame.Boot.prototype = {
    preload: function(){
        this.load.image('preloadbar', 'assets/images/preloader-bar.png')
    },

    create: function(){
        //White background colour
        this.game.stage.backgroundColor = "#fff"

        //scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true
        this.scale.pageAlignVertically = true

        //Physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        
        this.state.start('Preload')
    }
}