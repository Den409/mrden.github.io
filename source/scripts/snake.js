const colors = [
    [73, 144, 121], [96, 155, 127], [89, 160, 118],
    [79, 167, 134], [95, 183, 150], [79, 204, 175],
    [86, 192, 168], [93, 177, 144], [93, 177, 158],
    [141, 217, 190], [159, 224, 184], [104, 186, 136],
    [104, 186, 119], [134, 204, 118], [154, 218, 140]
]

let box = 30;
let radius = 10;

let stop = false;


const content = document.querySelector(".content")
const container = document.querySelector(".container")
let containerSize = container.getBoundingClientRect()

let width = Math.floor((containerSize.width)/box)*box
let height = Math.floor((window.screen.availHeight-containerSize.height-110)/box)*box

content.insertAdjacentHTML("beforeend", `<canvas id="game" width="${width}" height="${height}"></canvas>`)
const canvas = document.querySelector("#game")
const ctx = canvas.getContext("2d");

canvas.style.display = "block"
canvas.style.margin = "auto"
canvas.style.marginBottom = "1em"

const foodImg = new Image();
foodImg.src = `source/files/heart_${Math.ceil(Math.random() * 15)}.png`;

start()

function start() {
    stop = false;
    let score = 0;
    
    let food = {
        x: Math.floor((Math.random() * width/box)) * box,
        y: Math.floor((Math.random() * height/box)) * box,
    };

    let snake = [];
    snake[0] = {
        x: Math.round(width/box/2) * box,
        y: Math.round(height/box/2) * box
    };

    let snakeColors = []
    snakeColors[0] = colors[Math.floor(Math.random() * (colors.length - 1))]

    document.addEventListener("keydown", direction);

    let dir;

    function direction(event) {
        if (stop == true) start();
        if(event.keyCode == 37 && dir != "right")
            dir = "left";
        else if(event.keyCode == 38 && dir != "down")
            dir = "up";
        else if(event.keyCode == 39 && dir != "left")
            dir = "right";
        else if(event.keyCode == 40 && dir != "up")
            dir = "down";
    }

    document.addEventListener("touchstart", handleStart);
    let startTouch;

    function handleStart(event) {
        startTouch = event.changedTouches[0]
    }

    document.addEventListener("touchend", handleEnd);

    function handleEnd(event) {
        if (stop == true) start();

        let endTouch = event.changedTouches[0]
        let vector = [endTouch.pageX - startTouch.pageX, endTouch.pageY - startTouch.pageY]
        let vectorAngleX = Math.acos(vector[0] / Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1]))
        let vectorAngleY = Math.acos(vector[1] / Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1]))
        let angleDegX = vectorAngleX/Math.PI*180
        let angleDegY = vectorAngleY/Math.PI*180

        if (Math.abs(vector[0]) >= (Math.abs(vector[1]))) {
            if (vector[0] > 0 && dir != "left") dir = "right";
            if (vector[0] < 0 && dir != "right") dir = "left";
        }
        else {
            if (vector[1] > 0 && dir != "up") dir = "down";
            if (vector[1] < 0 && dir != "down") dir = "up";
        }

        console.log(angleDegX, angleDegY, dir)
    }


    function eatTail(head, arr) {
        for(let i = 0; i < arr.length; i++) {
            if(head.x == arr[i].x && head.y == arr[i].y && i != 1) {
                clearInterval(game);
                stop = true;
            }
        }
    }


    function foodInTail(food, arr) {
        for(let i = 0; i < arr.length; i++) {
            if(food.x == arr[i].x && food.y == arr[i].y) return true
        }
        return false
    }


    function draw(x, y, sizex, sizey, radius) {
        ctx.beginPath();
        ctx.moveTo(x+radius, y+0);
        ctx.lineTo(x+sizex-radius, y+0);
        ctx.lineTo(x+sizex, y+radius);
        ctx.lineTo(x+sizex, y+sizey-radius);
        ctx.lineTo(x+sizex-radius, y+sizey);
        ctx.lineTo(x+radius, y+sizey);
        ctx.lineTo(x+0, y+sizey-radius);
        ctx.lineTo(x+0, y+radius);
        ctx.lineTo(x+radius, y+0);
        ctx.arc(x+radius, y+radius, radius, 0, 2*Math.PI);
        ctx.arc(x+sizex-radius, y+radius, radius, 0, 2*Math.PI);
        ctx.arc(x+sizex-radius, y+sizey-radius, radius, 0, 2*Math.PI);
        ctx.arc(x+radius, y+sizey-radius, radius, 0, 2*Math.PI);
        ctx.fill();
    }

    function drawGame() {
        ctx.fillStyle = "rgb(60, 70, 90)";
        draw(0, 0, width, height, radius)

        ctx.drawImage(foodImg, food.x, food.y, box, box);

        for(let i = 0; i < snake.length; i++) {
            ctx.fillStyle = `rgb(${snakeColors[i][0]}, ${snakeColors[i][1]}, ${snakeColors[i][2]})`
            draw(snake[i].x, snake[i].y, box, box, radius)
        }

        // ctx.fillStyle = "white";
        // ctx.font = "50px Arial";
        // ctx.fillText(score, box * 2.5, box * 1.7);
        
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;
        
        if(snakeX == food.x && snakeY == food.y) {
            score++;
            while (true) {
                food = {
                    x: Math.floor((Math.random() * width/box)) * box,
                    y: Math.floor((Math.random() * height/box)) * box,
                };

                if (foodInTail(food, snake) == false) break 
            }

            foodImg.src = `source/files/heart_${Math.ceil(Math.random() * 15)}.png`;
            snakeColors.push(colors[Math.floor(Math.random() * (colors.length - 1))])
            
            clearInterval(game);
            game = setInterval(drawGame, 200-score*5);
        } else
            snake.pop();


        if(dir == "left") snakeX -= box;
        if(dir == "right") snakeX += box;
        if(dir == "up") snakeY -= box;
        if(dir == "down") snakeY += box;

        let newHead = {
            x: snakeX,
            y: snakeY,
        };
        
        if(snakeX < 0 || snakeX > width-box || snakeY < 0 || snakeY > height-box) {
            clearInterval(game);
            stop = true;
        }
        
        eatTail(newHead, snake);
        
        snake.unshift(newHead);
    }

    let game = setInterval(drawGame, 200);
}