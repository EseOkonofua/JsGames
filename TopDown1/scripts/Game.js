var TopDownGame = TopDownGame || {}

TopDownGame.Game = function(){}

TopDownGame.Game.prototype = {
    create: function(){
        this.map = this.game.add.tilemap('level1')

        //First param is tileset name specified in Tiled, 2nd param is key to the asset
        this.map.addTilesetImage('tiles', 'gameTiles')

        //create layer
        this.backgroundLayer = this.map.createLayer('backgroundLayer')
        this.blockedLayer = this.map.createLayer('blockedLayer')

        //collision on blockedLayer
        this.map.setCollisionBetween(1, 2000, true, 'blockedLayer')

        //resize gameworld to match layer dimensions
        this.backgroundLayer.resizeWorld()

        this.createItems()
        this.createDoors()
        this.createPlayer()

    },

    update: function(){
        //player movement
        this.player.body.velocity.y = 0
        this.player.body.velocity.x = 0

        if(this.cursors.up.isDown) {
            this.player.body.velocity.y -= 50
        }
        else if(this.cursors.down.isDown) {
            this.player.body.velocity.y += 50
        }
        if(this.cursors.left.isDown) {
            this.player.body.velocity.x -= 50
        }
        else if(this.cursors.right.isDown) {
            this.player.body.velocity.x += 50
        }
        this.game.physics.arcade.collide(this.player,this.blockedLayer)
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this)
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this)

    },

    findObjectsByType: function(type, map, layer){
        var result = []

        map.objects[layer].forEach(element=>{
            if(element.properties.type === type){
                //Phaser uses top left, Tiled bottom left so we have to adjust position
                element.y -= map.tileHeight
                result.push(element)
            }
        })

        return result
    },

    createFromTiledObject: function(element, group){
        //create sprite from object
        var sprite = group.create(element.x, element.y, element.properties.sprite)

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(key => sprite[key] = element.properties[key])

    },

    createItems:function(){
        this.items = this.game.add.group()

        this.items.enableBody = true

        var result = this.findObjectsByType('item', this.map, 'objectsLayer')
        result.forEach(element => this.createFromTiledObject(element, this.items))
    },

    createDoors: function(){
        this.doors = this.game.add.group()
        this.doors.enableBody = true

        var result = this.findObjectsByType('door', this.map, 'objectsLayer')

        result.forEach(e => this.createFromTiledObject(e, this.doors))
    },

    createPlayer: function(){
        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')

        this.player = this.game.add.sprite(result[0].x, result[0].y, 'player')
        this.game.physics.arcade.enable(this.player)

        //camera  follow player
        this.game.camera.follow(this.player)

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys()
    },

    collect: function(player, collectable){
        console.log("Yummy")

        //remove sprite
        collectable.destroy()
    },

    enterDoor: function(player, door){
        console.log("Entering door that will lead to blah blah")
    }
}