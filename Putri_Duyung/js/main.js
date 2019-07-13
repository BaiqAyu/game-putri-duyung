
mit.main = function() {

  window.requestAnimationFrame = function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(f) {
        window.setTimeout(f,1e3/60);
      }
  }();
  window.cancelAnimationFrame = function() {
    return window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      function(f) {
        window.setTimeout(f,1e3/60);
      }
  }();

  var config = mit.config = {

  };

  var ui = mit.ui = {
    body: $('body'),
    score_board: $('#score_board'),
    last_score: $('#last_score'),
    high_score: $('#high_score'),
    start_screen: $('#start_screen'),
    start_game: $('#start_game'),
    tweet: $('#tweet'),
    fb: $('#fb'),
    fps_count: $('#fps_count'),
    invincible_timer: $('#invincible_timer'),
    invincible_loader: $('#invincible_loader')
  };


  var canvas = document.querySelector('#game_main');
  var ctx = canvas.getContext('2d');

  var W = canvas.width = ui.body.width();
  var H = canvas.height = ui.body.height();

  if (canvas.width > 1000) {
    W = canvas.width = 1000;
  }
  if (canvas.height > 500) {
    H = canvas.height = 500;
  }

  if (canvas.height < 500) {
    canvas.width = canvas.height * 1000/500;
  }
  if (canvas.width < 1000) {
    canvas.height = canvas.width * 500/1000;
  }

  var bg_canvas = document.querySelector('#game_bg');
  var bg_ctx = bg_canvas.getContext('2d');

  bg_canvas.width = canvas.width;
  bg_canvas.height = canvas.height;

  var music = document.getElementById("start");
  music.volume = 0.2;
  
  var isMute = false;

  $("#mute").click(function() {
    if(isMute == false) {
      $(this).css("backgroundPosition", "0px -40px");
      music.volume = 0;
      isMute = true;
    }

    else {
      $(this).css("backgroundPosition", "0px 0px");
      music.volume = 0.2;
      isMute = false;
    }

    return false;
  });

  mit.game_started = 0;
  mit.game_over = 0;
  mit.start_btn_clicked = 0;

  ui.start_screen.css('width', canvas.width + 'px');
  ui.start_screen.css('height', canvas.height + 'px');

  var startGame = function() {
    music.play();
    flap.pause();
    ui.start_screen.fadeOut();

    mit.start_btn_clicked = 1;
    mit.game_started = 0;

    mit.Backgrounds.common_bg_speed = 1;
    mit.Backgrounds.resetAllSpeed();


    mit.Pappu.drawStatic(ctx);
    mit.ax = 0; mit.ay = 0;
    mit.vx = 0; mit.vy = 0;

    mit.Pappu.rotate_angle = 0;
    mit.score = 0;

    mit.ForkUtils.forks = [];
    mit.BranchUtils.branches = [];
    mit.CollectibleUtils.collecs = [];
    mit.PakiaUtils.pakias = [];
    mit.PakiaUtils.cur_pakia = false;
  };

  ui.start_game.on('mousedown', function() {
    startGame();

    return false;
  });


  var tweet = document.getElementById("tweet");
  tweet.href='http://twitter.com/share?url=http://khele.in/pappu-pakia/&text=I am playing Pappu Pakia, a cute HTML5 game on khele.in!&count=horiztonal&via=_rishabhp&related=solitarydesigns';

  var facebook = document.getElementById("fb");
  facebook.href='http://facebook.com/sharer.php?s=100&p[url]=http://khele.in/pappu-pakia/&p[title]=I am playing Pappu Pakia, a cute HTML5 game on khele.in!';


  mit.score = 0;
  try {

    mit.highScore = JSON.parse(localStorage.getItem("highScore"));
    if (mit.highScore)
      ui.high_score.text("High Score: "+ mit.highScore);

  } catch (e) {}

  ui.score_board.css('width', canvas.width + 'px');
  ui.score_board.css('height', canvas.height + 'px');

  mit.config.canvas_width = mit.W = W;
  mit.config.canvas_height = mit.H = H;

  mit.gravity = 0.7;

  mit.vx = 0;
  mit.vy = 0;
  mit.v_cap = 6.5;

  mit.ax = 0;
  mit.ay = 0;
  mit.flying_up = 0;

  mit.ascend = function() {
    if (!mit.start_btn_clicked)
      return;

    if (!mit.game_started) {
      mit.game_started = 1;
      mit.game_over = 0;
    }

    mit.ay = -1.5;
    mit.flying_up = 1;
  };

  mit.descend = function() {
    if (!mit.start_btn_clicked)
      return;

    mit.ay = 0;
    mit.flying_up = 0;
  };

  window.addEventListener('mousedown', function(e) {
    mit.ascend();
  }, false);

  window.addEventListener('mouseup', function(e) {
    mit.descend();
  }, false);


  window.addEventListener('touchstart', function(e) {
    mit.ascend();
  }, false);

  window.addEventListener('touchend', function(e) {
    mit.descend();
  }, false);


  window.addEventListener('keydown', function(e) {


    if (e.keyCode === 38) {
      mit.ascend();

      e.preventDefault();
    }
 
    if (e.keyCode === 40) {
      e.preventDefault();
    }


    if (e.keyCode === 32 || e.keyCode === 13) {
      startGame();
      
      e.preventDefault();
    }

  }, false);

  window.addEventListener('keyup', function(e) {

    if (e.keyCode === 38) {
      mit.descend();

      e.preventDefault();
    }
  }, false);


  mit.gameOver = function() {
    ui.start_screen.fadeIn();


    if (mit.score > mit.highScore) {
      mit.highScore = parseInt(mit.score);
      localStorage.setItem("highScore", JSON.stringify(parseInt(mit.score)));

      ui.high_score.text("High Score: "+ mit.highScore);
    }

    ui.last_score.text("Last Score: " + parseInt(mit.score));


    ui.start_game.html('re-start');
    ui.tweet.html('tweet score');
    ui.fb.html('post on fb');

    mit.descend();
    mit.Backgrounds.common_bg_speed = 0;
    mit.Backgrounds.ground_bg_move_speed = 0;
    mit.Backgrounds.fps = 0;

    mit.game_over = 1;
    mit.start_btn_clicked = 0;

    mit.Pappu.undoInvincible();
    mit.Pappu.clones.length = 0;

    var tweet = document.getElementById("tweet");
    tweet.href='http://twitter.com/share?url=http://khele.in/pappu-pakia/&text=I just scored ' +Math.floor(mit.score)+ ' points in Pappu Pakia!&count=horiztonal&via=_rishabhp&related=solitarydesigns';
  
    var facebook = document.getElementById("fb");
    facebook.href='http://facebook.com/sharer.php?s=100&p[url]=http://khele.in/pappu-pakia/&p[title]=I just scored ' +Math.floor(mit.score)+ ' points in the Pappu Pakia!';

  };

  mit.last_time = new Date();
  setInterval(function() {
    mit.ui.fps_count.html(mit.fps.toFixed(0) + ' FPS');
  }, 1000);

  mit.Backgrounds.init(ctx);
  mit.ForkUtils.init();
  mit.BranchUtils.init();
  mit.CollectibleUtils.init();
  mit.Pappu.init();
  mit.PakiaUtils.init();


  (function renderGame() {
    window.requestAnimationFrame(renderGame);

    mit.Backgrounds.draw(bg_ctx);

    ctx.clearRect(0, 0, W, H);

    if (mit.flying_up || !mit.game_started)
      mit.Pappu.updateFlyFrameCount();
    else
      mit.Pappu.updateFlyFrameCount(0);

    if (mit.Pappu.hasReachedBoundary(W, H)) {
      if (mit.game_over)
        return;
      mit.gameOver();
      return;
    }

    if (mit.game_started) {

      mit.ForkUtils.draw(ctx);
      mit.BranchUtils.draw(ctx);
      mit.CollectibleUtils.draw(ctx);
      mit.Pappu.drawClones(ctx);

      if (!mit.Pappu.invincible) {
        mit.ForkUtils.checkCollision();
        mit.BranchUtils.checkCollision();
        mit.PakiaUtils.checkCollision();
      }
      mit.CollectibleUtils.checkCollision();
      mit.Pappu.checkCloneCollision();

      if (mit.score > 199)
        mit.PakiaUtils.render(ctx);

      if (!mit.game_over) {
        mit.score = mit.score += 0.1;
        ui.score_board.text(parseInt(mit.score));
      }

      if (!mit.game_over) {
        if (
          (mit.vy < mit.v_cap && mit.ay+mit.gravity > 0) ||
          (mit.vy > -mit.v_cap && mit.ay+mit.gravity < 0)
          ) {

          mit.vy += mit.ay;
          mit.vy += mit.gravity;
        }


        mit.Pappu.x += mit.vx;
        mit.Pappu.y += mit.vy;

        if (mit.vy > mit.v_cap) {
          mit.vy = mit.v_cap;
        }
      }
      else {
        mit.vy += mit.gravity;
        mit.Pappu.y += mit.vy;
      }
    
      mit.Pappu.draw(ctx);
    }
    else {
      mit.Pappu.drawStatic(ctx);
    }

    mit.cur_time = new Date;
    mit.fps = 1e3 / (mit.cur_time - mit.last_time);
    mit.last_time = mit.cur_time;

    return;
  }());

};