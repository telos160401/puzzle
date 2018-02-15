var pazzleGame;
var url = "";

document.addEventListener('DOMContentLoaded', function(){
	var canvas = document.getElementById("c");
    canvas.addEventListener('click', onClick, false);
    document.getElementById('file').addEventListener('change', handleFileSelect, false);

    v.addEventListener('play', function(){
        pazzleGame.randomized();
        draw();
    },false);

},false);

function handleFileSelect(evt) {
    width = document.getElementById("width").value;
    height = document.getElementById("height").value;
    pazzleGame = new Pazzle(width, height, "15 Puzzle");
    var file = evt.target.files[0];
    var video = document.getElementById('v');
    var reader = new FileReader();
    reader.onload = function() {
        var urlInput = document.getElementById("urlInput");
        var overall = document.getElementById("overall");
        overall.removeChild(urlInput);
        video.src = reader.result;
        video.play();
    }

    reader.readAsDataURL(file);
  }

function onButtonClick(){
    var video = document.getElementById('v');
    url = document.getElementById("url").value;
    width = document.getElementById("width").value;
    height = document.getElementById("height").value;
    pazzleGame = new Pazzle(width, height, "15 Puzzle");

    var urlInput = document.getElementById("urlInput");
    var overall = document.getElementById("overall");
    overall.removeChild(urlInput);
    video.src = url;
    video.play();
}

function onClick(e) {
        var x = 0;
        var y = 0;
        var rect = e.target.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        pazzleGame.update(x, y);
}

function draw() {
    canvasReshape();
    if(v.paused){
        return false;
    }
    pazzleGame.checkClear();
    pazzleGame.draw();
    setTimeout(draw, 50);
}

function canvasReshape() {
    var canvas = document.getElementById("c");
    var video = document.getElementById('v');
    var vw = Math.floor(video.videoWidth );
    var vh = Math.floor(video.videoHeight );
    var s = getStyleValue(overall, "width");
    ww = s.substr(0, s.indexOf("p"))
    s = getStyleValue(overall, "height");
    wh = s.substr(0, s.indexOf("p"))
    if(ww / vw > wh / vh){
        canvas.width = vw * wh / vh;
        canvas.height = wh;
    }
    else{
        canvas.width = ww;
        canvas.height = vh * ww / vw;
    }
}

var Pazzle = function(width, height, gameMode){
    this.width = width;
    this.height = height;
    this.gameMode = gameMode;
    this.space_x = width - 1;
    this.space_y = height - 1;
    this.clearFlag = false;
    this.board = new Array(width * height);
    this.time = new Date().getSeconds();
    this.clearTime = 0;

    for(var i = 0; i < this.board.length; i++){
        this.board[i] = i;
    }


    this.getElement = function(x, y){
        return this.board[y * width + x];
    }

    this.checkClear = function(){
        for(var i = 0; i < this.board.length; i++){
            if(this.board[i] != i){
                return false;
            }
        }
        this.clearFlag = true;
        return true;
    }

    this.randomized = function(){
        var num_of_trials = this.width * this.height * 100;
        for(var i = 0; i < num_of_trials; i++){
            var random_num = getRandomInt(0, 3);
            var dx = 0;
            var dy = 0;
            if(random_num == 0){
                dx += 1;
            } else if (random_num == 1){
                dx -= 1;
            } else if (random_num == 2){
                dy += 1;
            } else if (random_num == 3){
                dy -= 1;
            }
            var nx = this.space_x + dx;
            var ny = this.space_y + dy;
            if((ny < 0) || (ny >= this.height) || (nx < 0 ) || (nx >= this.width)){
                continue;
            }
            this.move(nx, ny, -dx, -dy);
        }
    }

    this.move = function(x, y, dx, dy){
        var nx = x + dx;
        var ny = y + dy;
        if((ny < 0) || (ny >= this.height) || (nx < 0 ) || (nx >= this.width)){
            return false;
        }
        if((nx == this.space_x) && (ny == this.space_y)){
            temp = this.board[ny * this.width + nx];
            this.board[ny * this.width + nx] = this.board[y * this.width + x];
            this.board[y * this.width + x] = temp;
            this.space_x = x;
            this.space_y = y;
            return true;
        }
        return false;
    }

    this.update = function(mouse_x, mouse_y){
        if(this.clearFlag){
            this.replay();
        }
        var canvas = document.getElementById("c");
        var tileWidth = canvas.width / this.width;
        var tileHeight = canvas.height / this.height;
        var x = Math.floor(mouse_x / tileWidth);
        var y = Math.floor(mouse_y / tileHeight);
        f1 = this.move(x, y, 0, -1);
        f2 = this.move(x, y, 0, 1);
        f3 = this.move(x, y, 1, 0);
        f4 = this.move(x, y, -1, 0);
    }

    this.replay = function(){
        this.clearFlag = false;
        this.clearTime = 0;
        this.randomized();
    }

    this.draw = function(context){
        var canvas = document.getElementById("c");
    	var context = canvas.getContext('2d');
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var video = document.getElementById('v');
	    var videoWidth = Math.floor(video.videoWidth );
	    var videoHeight = Math.floor(video.videoHeight );
    
        var index_of_space = this.space_y * this.width + this.space_x;
            for(var i = 0; i < this.board.length; i++){
                if(!this.clearFlag && (index_of_space == i)){
                    var temp = new Date().getSeconds();
                    var dt = (temp - this.time + 60) % 60;
                    this.time = temp;
                    this.clearTime += dt;
                    continue;
                }
    
                var di = this.board[i];
                var sw = Math.floor(videoWidth / this.width);
                var sh = videoHeight / this.height;
                var sx = (di % this.width) * sw;
                var sy = Math.floor(di / this.width) * sh;
                var dw = Math.floor(canvasWidth / this.width);
                var dh = canvasHeight / this.height;
                var dx = (i % this.width) * dw;
                var dy = Math.floor(i / this.width) * dh;
                context.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);

                context.font = (canvasHeight / 20).toString() + "px serif";
                context.textAlign = "right";
                context.fillStyle = "red";
                context.fillText(this.clearTime.toString() + "秒", canvasWidth * 59 / 60, canvasHeight * 2 / 32);
                
                if(this.clearFlag){
                    var size = Math.min((canvasHeight / 6), (canvasWidth / 8));
                    context.font = size.toString() + "px serif";
                    context.textAlign = "center";
                    context.fillStyle = "red";
                    score = width * height * width * height * 10 + 100 - this.clearTime;
                    context.fillText("Congraturation!!", canvasWidth / 2, canvasHeight * 6 / 16);
                    context.fillText("Score: " + score.toString(), canvasWidth / 2, canvasHeight * 9 / 16);
                    context.fillText("Click for replay", canvasWidth / 2, canvasHeight * 13 / 16);
                }   
            }
    }

};