var SpaceHipster = SpaceHipster || {};

SpaceHipster.Boot = function(){}

//Game config and loading assets for loading screen
SpaceHipster.Boot.prototype = {
    preload: function(){
        this.load.image('logo', 'assets/images/logo.png')
        this.load.image('preloadbar', 'assets/images/preloader-bar.png')
    },

    create: function(){
        //loading screen: White background
        this.game.stage.backgroundColor = "#fff"
        
        //Scaling options
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE
        this.scale.minWidth = 240
        this.scale.minHeight = 170
        this.scale.maxWidth = 2880
        this.scale.maxHeight = 1920

        //Horizontally centred game
        this.scale.pageAlignHorizontally = true

        //Screen size will be set automatically 
        // this.scale.setScreenSize(true)  //(deprecated) 

        //Physics system for movement
        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        this.state.start('Preload')
    }
}