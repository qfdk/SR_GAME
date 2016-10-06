/**
 * Created by qfdk on 16/3/2.
 */
$('#myModal').modal('show')

var socket = io.connect('http://localhost:3000');

$('#btnStart').click(function() {
    socket.emit('start', { pseudo:$('#pseudo').val()});
});

socket.on('ok', function(data) {
    console.log(data);
});
	// 定时器
	var gameInt
	// 定义方格
	function Box(x,y){
		this.x = x;
		this.y = y;
	}
	// 初始方向
	var direction = 2;//1:东-右-39 2：南-下-40 3：西-左-37 4：北-上-38    37左键 38上建 39右键 下键40

	// 初始蛇
	var snakeArr = [new Box(1,2),new Box(1,3),new Box(1,4),new Box(2,4),new Box(3,4),new Box(4,4),new Box(5,4),new Box(6,4)];

	// 蛇头
	var headBox = snakeArr[snakeArr.length-1];

	// 虫子
	var worm ;

	// 初始化地图
	function initMap(){
		for(var i=1;i<=50;i++){
			for(var j=1;j<=50;j++){
				$("<div id=map_"+i+"_"+j+" class='maps'></div>").appendTo($('#map'));
				if(j==50){
					$('<div style="clear:both;"></div>').appendTo($('#map'));
				}
			}
		}
	}

	// 绘制蛇
	function drawSnake(){
		for(var i=0;i<snakeArr.length;i++){
			var box = snakeArr[i];
			$("#map_"+box.x+"_"+box.y).addClass('back');
		}

	}

	// 清楚蛇
	function clearSnake(){
		for(var i=0;i<snakeArr.length;i++){
			var box = snakeArr[i];
			$("#map_"+box.x+"_"+box.y).removeClass('back');
		}
	}

	// 绘制虫子
	function drawWorm(){
		do{
			var x = Math.round(Math.random()*(50-1));
			var y = Math.round(Math.random()*(50-1));
			worm = new Box(x,y);
		}while(isInSnake(worm));
		//worm = new Box(x,y);
		$("#map_"+worm.x+"_"+worm.y).addClass('worm');
	}

	// 清除虫子
	function clearWorm(){
		$("#map_"+worm.x+"_"+worm.y).removeClass('worm');
	}

	// 判断蛇方格中是否存在该方格
	function isInSnake(worm){
		var result = false;
		for(var i=0;i<snakeArr.length;i++){
			var box = snakeArr[i];
			if(worm.x == box.x && worm.y == box.y){
				result = true;
				break;
			}
		}
		return result;
	}

	/*
	1、清除原有蛇
	2、计算新蛇头的位置
	3、判断新蛇头是否碰到边界 是则结束游戏
	4、判断新蛇头是否碰到自己 是则结束游戏
	5、判断蛇是否碰到虫子 是则吃掉该虫子  产生一个新虫子
	6、重新绘制蛇
	*/
	function forward(){
		// 清除原有蛇
		clearSnake();
		// 计算新蛇头的位置
		switch (direction){
			case 1:
				headBox = new Box(headBox.x,headBox.y+1);
				break;
			case 2:
				headBox = new Box(headBox.x+1,headBox.y);
				break;
			case 3:
				headBox = new Box(headBox.x,headBox.y-1);
				break;
			case 4:
				headBox = new Box(headBox.x-1,headBox.y);
				break;
		}
		// 判断新蛇头是否碰到边界
		if(headBox.x<1 || headBox.x > 50 || headBox.y<1 || headBox.y > 50){
			clearInterval(gameInt);
			alert("game over!");
			//return;
		}
		// 判断新蛇头是否碰到自己
		if(isInSnake(headBox)){
			clearInterval(gameInt);
			alert("game over!");
			//return;
		}
		// 判断蛇是否碰到虫子
		if(headBox.x == worm.x && headBox.y == worm.y){
			clearWorm();
			drawWorm();
		}else{
			snakeArr.shift();
		}
		snakeArr.push(headBox);
		// 重新绘制蛇
		drawSnake();
	}

	$(function(){
		// 初始化地图
		initMap();
		// 初始化蛇
		drawSnake();
		// 初始化虫子
		drawWorm();
		// 启动定时器
		gameInt = setInterval(function(){
			forward();
		},200);
		// 监听键盘方向键 根据方向键确定蛇的前进方向
		$(document).keydown(function(e){
			switch(e.which){
				case 37:
					if(direction!=1){
						direction = 3;
					}
					break;
				case 38:
					if(direction!=2){
						direction = 4;
					}
					break;
				case 39:
					if(direction!=3){
						direction = 1;
					}
					break;
				case 40:
					if(direction!=4){
						direction = 2;
					}
					break;
			}
		});
	});
