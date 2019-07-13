(function() {

  mit.Fork = function() {
 
    this.x = 0;
    this.y = 0;

    this.w = 0;
    this.h = 0;

    this.head_x = 0;
    this.head_y = 0;

    this.head_w = 0;
    this.head_h = 0;
    this.edge = 'btm';

    this.getHandleBounds =  function() {
      var b = {};

      b.start_x = this.x;
      b.start_y = this.y;
      b.end_x   = this.x + this.w;
      b.end_y   = this.y + this.h;

      return b;
    };

    this.getHeadBounds = function() {
      var b = {};

      b.start_x = this.head_x;
      b.start_y = this.head_y;
      b.end_x   = this.head_x + this.head_w;
      b.end_y   = this.head_y + this.head_h;

      return b;
    };
  };

  

  mit.ForkUtils = {

    forks: [],
    edges: ['top', 'btm'],

    fork_img: {},
    fork_head_img: {},
    dig_img: {},
    count: 6,

    init: function() {
      this.fork_img = mit.image.fork_handle;
      this.fork_head_img = mit.image.fork_head;

    },

 

    getRandomForkPos: function() {
      var pos = {};

      if (this.forks[this.forks.length-1]) {
        pos.x = this.forks[this.forks.length-1].x;

        if (mit.score > 2500)
          pos.x += utils.randomNumber(300,600);
        else
          pos.x += utils.randomNumber(500,800);
      }
      else {
        pos.x = mit.W/1000 * 1050;
      }

      var branches = mit.BranchUtils.branches;

      if (branches.length) {
        branches.forEach(function(branch) {
          if (Math.abs(pos.x - branch.x) < 500)
            pos.x = branch.x + 500;
        });
      }

      return pos;
    },

    create: function() {
      var fork_img = this.fork_img,
          dig_img = this.dig_img,
          fork_head_img = this.fork_head_img,
          forks = this.forks,
          count = this.count;

      if (forks.length < count) {
        
        for (var i = 0; i < count - forks.length; i++) {
          var fork = new mit.Fork();

          fork.edge = this.edges[utils.randomNumber(0,1)];
          if (fork.edge === 'btm') {
            var dig_rand = utils.randomNumber(3,5);

            fork.dig_x = dig_img.width / dig_rand;
            fork.dig_y = mit.H - dig_img.height;

            fork.y = 200 + utils.randomNumber(0,100);
            fork.y += fork_head_img.height;
          }

          if (fork.edge === 'top') {
            fork.y = 0 - utils.randomNumber(0,100);
            fork.y -= fork_head_img.height;
          }

          var pos = this.getRandomForkPos();
          fork.x = pos.x;
          fork.w = fork_img.width;
          fork.h = fork_img.height;

          forks.push(fork);
        }
        
      }
    },

    draw: function(ctx) {
      var fork_img = this.fork_img,
          dig_img = this.dig_img,
          fork_head_img = this.fork_head_img,
          forks = this.forks,
          dead_forks = 0;

      this.create();
      
      forks.forEach(function(fork, index) {

        fork.x -= mit.Backgrounds.ground_bg_move_speed;

        if (fork.x + fork.w < 0) {
          ++dead_forks;
          return;
        }

        if (fork.x > mit.W) {
          return;
        }

        if (fork.edge === 'top') {
        
          ctx.save();
          ctx.translate(fork.x, fork.y);
          ctx.translate(~~(fork_img.width/2), ~~(fork_img.height/2));
          ctx.rotate( utils.toRadian(180) );
          ctx.drawImage(fork_img, -~~(fork_img.width/2), -~~(fork_img.height/2));
          ctx.restore();


          fork.head_x = fork.x-~~(fork_head_img.width/8);
          fork.head_y = fork.y+fork_img.height;

          fork.head_w = fork_head_img.width;
          fork.head_h = fork_head_img.height;

          ctx.save();
          ctx.translate(fork.head_x, fork.head_y);
          ctx.translate(~~(fork_head_img.width/2), ~~(fork_head_img.height/2));
          ctx.rotate( utils.toRadian(180) );
          ctx.drawImage(fork_head_img, -~~(fork_head_img.width/2), -~~(fork_head_img.height/2));
          ctx.restore();
        }
        else if (fork.edge === 'btm') {

          ctx.drawImage(fork_img, fork.x, fork.y);

          fork.head_x = fork.x-~~(fork_head_img.width/5);
          fork.head_y = fork.y-fork_head_img.height;

          fork.head_w = fork_head_img.width;
          fork.head_h = fork_head_img.height;

          ctx.save();
          ctx.translate(fork.head_x, fork.head_y);
          ctx.translate(1* ~~(fork_head_img.width/2), 1* ~~(fork_head_img.height/2));
          ctx.scale(-1,1);
          ctx.drawImage(
            fork_head_img,
            1* -~~(fork_head_img.width/2),
            1* -~~(fork_head_img.height/2)
          );
          ctx.restore();
        }

      });

      if (dead_forks) {
        forks.splice(0, dead_forks);
      }

      return;
    },

    drawDigs: function(ctx) {
      var dig_img = this.dig_img;

      this.forks.forEach(function(fork, index) {

        if (fork.edge === 'btm') {
          ctx.drawImage(dig_img, fork.x - fork.dig_x, fork.dig_y);
        }

      });
    },

    checkCollision: function() {
      var first_fork = this.forks[0];

      if (first_fork.x > mit.W/2)
        return;

      var pappu_bounds = mit.Pappu.getBounds(),
          fork_bounds = first_fork.getHandleBounds();
 
      if (utils.intersect(pappu_bounds, fork_bounds)) {
        mit.gameOver();
      }

      var fork_head_bounds = first_fork.getHeadBounds();

      
      if (
        pappu_bounds.end_x      >  fork_head_bounds.start_x+20 &&
        fork_head_bounds.end_x-20  >  pappu_bounds.start_x &&
        pappu_bounds.end_y      >  fork_head_bounds.start_y+20 &&
        fork_head_bounds.end_y-20  >  pappu_bounds.start_y
      ) {
        mit.gameOver();
      }
    }

  };

}());