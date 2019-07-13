(function() {

 

  mit.Branch = function() {
    this.x = 0;
    this.y = 0;

    this.w;
    this.h;

    this.escape_x;
    this.escape_y;
    this.escape_w;
    this.escape_h;

    this.getBounds = function() {
      var b = {};

      b.start_x = this.x;
      b.start_y = this.y;
      b.end_x   = this.x + this.w;
      b.end_y   = this.y + this.h;

      return b;
    };

    this.getEscapeBounds = function() {
      var b = {};

      b.start_x = this.escape_x;
      b.start_y = this.escape_y;
      b.end_x   = this.escape_x + this.escape_w;
      b.end_y   = this.escape_y + this.escape_h;

      return b;
    };
  };


  mit.BranchUtils = {

    branch_img: {},

    branches: [],
    count: 4,

    init: function() {

      this.branch_img = mit.image.branch;
    },
    getRandomBranchPos: function() {
      var pos = {};

      if (this.branches[this.branches.length-1]) {
        pos.x = this.branches[this.branches.length-1].x;
        pos.x += utils.randomNumber(500, 2000);
      }
      else {
        pos.x = utils.randomNumber(2000, 2500);
      }

      var forks = mit.ForkUtils.forks;
     

      if (forks.length) {
        forks.forEach(function(fork) {
          if (Math.abs(pos.x - fork.x) < 500)
            pos.x = fork.x + 500;
        });
      }

      return pos;
    },

    create: function() {
      var branches = this.branches,
          count = this.count;

      if (branches.length < count) {
      
        for (var i = 0; i < count - branches.length; i++) {
          var branch = new mit.Branch();

          var pos = this.getRandomBranchPos();
          branch.x = pos.x;
          branch.y = 0;

          branch.w = this.branch_img.width;
          branch.h = this.branch_img.height;

          branch.escape_x = branch.x;
          branch.escape_y = branch.y + utils.randomNumber(0, branch.h-150);

          branch.escape_w = this.branch_img.width;
          branch.escape_h = 150;

          branches.push(branch);
        }
    }
    },

    draw: function(ctx) {
      var branches = this.branches,
          branch_img = this.branch_img,
          dead_branch = 0;

      this.create();

     
      branches.forEach(function(branch, index) {

        branch.x -= mit.Backgrounds.ground_bg_move_speed;

        if (branch.x + branch.w < 0) {
          dead_branch++;
          return;
        }

 
        if (branch.x > mit.W)
          return;

     
        branch.escape_x = branch.x;

        ctx.drawImage(branch_img, branch.x, branch.y);

    
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'white';
        ctx.fillRect(
          branch.escape_x,
          branch.escape_y,
          branch.escape_w,
          branch.escape_h
        );
        ctx.restore();
      });

      if (dead_branch) {
        branches.splice(0, dead_branch);
      }

      return;
    },


    checkCollision: function() {
      var first_branch = this.branches[0];

     
      if (first_branch.x > mit.W/2)
        return;

      var pappu_bounds = mit.Pappu.getBounds(),
        
          branch_bounds = first_branch.getBounds();

      if (utils.intersect(pappu_bounds, branch_bounds)) {

        var escape_bounds = first_branch.getEscapeBounds();

        if (!utils.intersect(pappu_bounds, escape_bounds)) {
          mit.gameOver();
        }

      }

      return;
    }

  };

}());