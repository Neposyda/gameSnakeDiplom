var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width;
var height = canvas.height;
//Клітинки для сітки
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

//Підрахунок балів
var score = 0;

//Рамка для поля
var drawBorder = function () {
    ctx.fillStyle = '#339966';
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height - blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(width - blockSize, 0, blockSize,height - blockSize);
};

//Відображення рахунку
var drawScore = function () {
    ctx.font = '20px Courier'
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'Black';
    ctx.fillText('Рахунок: ' + score, blockSize, blockSize);
};

//Кінець гри
var gameOver = function () {
    animationTime = 0;
    ctx.fillColor = 'Black';
    ctx.font = 'bold 60px Courier';
    ctx.textBaseline = 'center';
    ctx.textAlign = 'center';
    ctx.fillText('Game over', width/2, height/2);
};

//Функція для малювання кола
var circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};


//Конструктор об'єкта Блок для створення "сітки"
var Block = function (col, row) {
    this.col = col;
    this.row = row;
};


//Методу що малює квадрат в клітинці поля
Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

//Метод що малює коло в клітині
Block.prototype.drawCircle = function (color) {
    var centerX = this.col * blockSize + blockSize / 2;
    var centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};


//Метод для перевірки чи не перебувають елементи в одній позиції
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};


//Конструктор для создания об'єкту змійки
var Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];

    this.direction = 'Right';
    this.nextDirection = 'Right';
};


//Функція, що малює змійку
Snake.prototype.draw = function () {
    for(i = 0; i < this.segments.length; i++) {
        if (i === 0) {
        this.segments[i].drawSquare('Black');
        }  else {
            this.segments[i].drawSquare('Orange');
        }
    }
};

//Метод для перемещення змейки
Snake.prototype.move = function () {
    var head = this.segments[0];
    var newHead;

    this.direction = this.nextDirection;

    if (this.direction === 'Right') {
        newHead = new Block(head.col + 1, head.row);
    }   else if (this.direction === 'Left') {
        newHead = new Block(head.col - 1, head.row);
    }   else if (this.direction === 'Up') {
        newHead = new Block(head.col, head.row - 1);
    }   else if (this.direction === 'Down') {
        newHead = new Block(head.col, head.row + 1);
    }
    if (this.checkCollision(newHead)) {
        gameOver();
        return; 
    }

    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
        score++;
        animationTime -= 5;
            apple.move();
    }   else {
        this.segments.pop();
    }
}; 

//Метод для провірки чи зіштовхнулася змійка зі стінкою
Snake.prototype.checkCollision = function (head) {
    var leftCollision = (head.col === 0);
    var topCollision = (head.row === 0);
    var rightCollision = (head.col === widthInBlocks - 1);
    var bottomCollision = (head.row === heightInBlocks - 1);

    var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
    var selfCollision = false;

    for(i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }
    return selfCollision || wallCollision;
};

//Установлення нового напряму руху змійки
Snake.prototype.setDirection = function(newDirection) {
    if (this.direction === 'Up' && newDirection === 'Down') {
        return;
    }   else if (this.direction === 'Down' && newDirection === 'Up') {
        return;
    }   else if (this.direction === 'Right' && newDirection === 'Left') {
        return;
    }   else if (this.direction === 'Left' && newDirection === 'Right') {
        return;
    }

    this.nextDirection = newDirection;
};

//Конструктор для яблука
var Apple = function () {
    this.position = new Block(blockSize, blockSize);   
};

//Метод що малює яблуко в клітині
Apple.prototype.draw = function () {
    this.position.drawCircle('OrangeRed');
    
};

//Перемещення яблука у випадкову позицію
Apple.prototype.move = function () {
    var randomCol = Math.floor(Math.random() * (widthInBlocks -2)) + 1;
    var randomRow = Math.floor(Math.random() * (heightInBlocks -2)) + 1;
    this.position = new Block(randomCol, randomRow);
};


var snake = new Snake();
var apple = new Apple();

var animationTime = 120;
var gameLoop = function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
    setTimeout(gameLoop, animationTime);
};

gameLoop();


//Коди клавіш клавіатури для керування змійкою
var directions = {
    'ArrowLeft': 'Left',
    'ArrowUp': 'Up', 
    'ArrowRight': 'Right', 
    'ArrowDown': 'Down',
};

//Керування змійкою за допомогою клавіш
document.querySelector('body').addEventListener('keydown',function(event) {
    var newDirection = directions[event.code];
    if(newDirection !== undefined) {
        snake.setDirection(newDirection);
    } 
});