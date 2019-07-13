(function() {

  
  mit.Collectible = function() {

    this.x;
    this.y;

    this.w;
    this.h;
    this.type;

    this.sound = document.getElementById("ting");
    this.sound.volume = 0.35;

    this.sub_type;

    this.getBounds = function() {
      var b = {};

      b.start_x = this.x;
      b.start_y = this.y;
      b.end_x   = this.x + this.w;
      b.end_y   = this.y + this.h;

      return b;
    };


    this.draw = function(ctx) {
      switch (this.type) {

        case 'coin':
          this.drawCoin(ctx);
          break;

        case 'clone':
          this.drawClone(ctx);
          break;

        case 'invincible':
          this.drawInvincible(ctx);
          break;

      }

      return;
    };

    this.drawCoin = function(ctx) {
      var pos = mit.CollectibleUtils.getCoinSpritePos(this.sub_type);

      ctx.drawImage(
        mit.CollectibleUtils.coin_img,
        pos.x, pos.y,
        30, 30,
        this.x, this.y,
        30, 30
      );
    };

    this.drawClone = function(ctx) {
      ctx.drawImage(
        mit.CollectibleUtils.clone_img,
        this.x,
        this.y
      );
    };

    this.drawInvincible = function(ctx) {
      ctx.drawImage(
        mit.CollectibleUtils.invincible_img,
        this.x,
        this.y
      );
    };
  };


  mit.CollectibleUtils = {

    collecs: [],

    count: 2,

    types: ['coin', 'clone', 'invincible'],

    sub_types: {
      coin: [50, 100, 500]
    },

    init: function() {

      this.coin_img = mit.image.coins;
      this.clone_img = mit.image.berries;
      this.invincible_img = mit.image.star;
    },

    getCoinSpritePos: function(sub_type) {

      switch (sub_type) {
        case 50:
          return {x: 0, y: 0};

        case 100:
          return {x: 30, y: 0};

        case 500:
          return {x: 60, y: 0};

        case 1000:
          return {x: 90, y: 0};
      }

    },

    getRandomPos: function() {
      var pos = {};

      var last = this.collecs[this.collecs.length - 1];

      if (last) {
        pos.x = last.x + utils.randomNumber(1000, 1500);
      }
      else {
        pos.x = utils.randomNumber(2000, 3000);
        pos.x = utils.randomNumber(500, 1000);
      }

      pos.y = utils.randomNumber(100, mit.H-100);
      var forks = mit.ForkUtils.forks;

      if (forks.length) {
        forks.forEach(function(fork) {
          if (Math.abs(pos.x - fork.x) < 300)
            pos.x = fork.x + 300;
        });
      }
      var branches = mit.BranchUtils.branches;

      if (branches.length) {
        branches.forEach(function(branch) {
          if (Math.abs(pos.x - branch.x) < 300)
            pos.x = branch.x + 300;
        });
      }

      return pos;
    },

    create: function() {
      var count = this.count - this.collecs.length;
      var collec,
          sub_types,
          pos;

      for (var i = 0; i < count; i++) {
        collec = new mit.Collectible();

        pos = this.getRandomPos();

        collec.x = pos.x;
        collec.y = pos.y;

        collec.w = 30;
        collec.h = 30;

 
        collec.type = this.types[utils.randomNumber(0, this.types.length-1)];
        sub_types = this.sub_types[collec.type];
        if (sub_types)
          collec.sub_type = sub_types[utils.randomNumber(0, sub_types.length-1)];

        this.collecs.push(collec);
      }
    },

    draw: function(ctx) {

      var self = this;

      self.create();

      self.collecs.forEach(function(collec, i) {
        if (collec.x < 0) {
    
          self.collecs.splice(i,1);
        }

        collec.x -= mit.Backgrounds.ground_bg_move_speed;

        collec.draw(ctx);
      });

      return;
    },

    checkCollision: function() {

      var collec = this.collecs[0],
          pappu_bounds = mit.Pappu.getBounds(),
          collec_bounds = collec.getBounds();

      if (utils.intersect(pappu_bounds, collec_bounds)) {
        collec.sound.play();
        switch (collec.type) {

          case 'coin':
            mit.score += collec.sub_type;
            break;

          case 'clone':
            mit.Pappu.createClones(3);
            break;

          case 'invincible':
            mit.Pappu.invincible = 1;

            mit.Pappu.invincibility_start = new Date().getTime();
            mit.Pappu.invincibility_time = 5000;
            mit.ui.invincible_timer.show();

            break;
        }

        this.collecs.shift();
      }

      return;
    }

  };

}());