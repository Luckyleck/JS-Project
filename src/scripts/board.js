import Tile from './tile.js'
import Boundary from './boundary.js'
import Player from './player.js'
// import grass from './img/grass.png'

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d")

const grassFull = new Image();
grassFull.src = "./images/tiles/grass.png";

const stone = new Image();
stone.src = "./images/tiles/stone_pink.png"

const dirtLight = new Image();
dirtLight.src = "./images/tiles/dirt_light.png"

const dirtDark = new Image();
dirtDark.src = "./images/tiles/dirt_dark.png";

// c.fillRect(20, 20, 20, 20)

class Board {


  static map = [
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
  ]

  static timer = 0;
  static intervalId = null;
  static shrinkCounter = 0;
  static gameover = false

  static canvasCenterX = canvas.width / 2
  static canvasCenterY = canvas.height / 2

  // Map total Width and Height
  static mapWidth = Board.map[0].length * Tile.size;
  static mapHeight = Board.map.length * Tile.size;

  // Map Start x and y
  static gameFieldX = Board.canvasCenterX / 2 / 2 + 60; //300
  static gameFieldY = Board.canvasCenterY / 4; //100

  // Map End x and y
  static gameFieldEndX = (Board.map[0].length * Tile.size) + (Tile.size * 3)
  static gameFieldEndY = (Board.map.length * Tile.size) + (Tile.size * 2)

  // Playfield Width and Height
  static playFieldWidth = Board.mapWidth - Tile.size * 2;
  static playFieldHeight = Board.mapHeight - Tile.size * 2;

  // Playfield Start x and y
  static playFieldStartX = Board.gameFieldX + Tile.size; // 350;
  static playFieldStartY = Board.gameFieldY + Tile.size; // 150

  constructor() {
    // this.gameOver = false;
    for (let i = 0; i < Board.map.length; i++) {
      for (let j = 0; j < Board.map[i].length; j++) {
        if (Board.map[i][j] === " ") {
          Board.map[i][j] = new Tile(
            i, // row
            j // col
          );
        } else {
          Board.map[i][j] = new Boundary(
            i, // row
            j // col
          );
        }
      }
    }
  }

  draw() {
    const StartX = Board.gameFieldX;
    const StartY = Board.gameFieldY;

    Board.map.forEach((row) => {
      // console.log(row)
      row.forEach((tile) => {

        // Col first, then row
        if (tile instanceof Tile && tile.health === 3) {
          c.shadowBlur = 10;
          c.shadowColor = "black";
          c.drawImage(grassFull, StartX + (tile.col * tile.size), StartY + (tile.row * tile.size), tile.size, tile.size)
        } else if (tile instanceof Tile && tile.health === 2) {
          c.shadowBlur = 10;
          c.shadowColor = "black";
          c.drawImage(dirtLight, StartX + (tile.col * tile.size), StartY + (tile.row * tile.size), tile.size, tile.size)
        } else if (tile instanceof Tile && tile.health === 1) {
          c.shadowBlur = 10;
          c.shadowColor = "black";
          c.drawImage(dirtDark, StartX + (tile.col * tile.size), StartY + (tile.row * tile.size), tile.size, tile.size)
        } else if (tile instanceof Tile && tile.health === 0) {
          c.globalAlpha = 0.0;
          c.fillStyle = "#ffebcd"; // color of background
          c.fillRect(StartX + (tile.col * tile.size), StartY + (tile.row * tile.size), tile.size, tile.size);
          c.lineWidth = 2;
          c.strokeStyle = "black";
          c.strokeRect(StartX + (tile.col * tile.size), StartY + (tile.row * tile.size), tile.size, tile.size);
          c.globalAlpha = 1;
        } else if (tile instanceof Boundary) {
          c.drawImage(stone, StartX + (tile.col * tile.size), StartY + (tile.row * tile.size), tile.size, tile.size)
        }
      });
    });



    // Draw red dot at game field (x, y)
    // c.fillStyle = "red";
    // c.beginPath();
    // c.arc(Board.gameFieldX, Board.gameFieldY, 5, 0, Math.PI * 2);
    // c.fill();

    // // Draw red dot at play field (x, y)
    // const circleplayFieldStartX = Board.playFieldStartX;
    // const circleplayFieldStartY = Board.playFieldStartY;
    // c.fillStyle = "blue";
    // c.beginPath();
    // c.arc(circleplayFieldStartX, circleplayFieldStartY, 5, 0, Math.PI * 2);
    // c.fill();
  }

  static shrinkPlayField() {

    Board.shrinkCounter++;

    if (Board.shrinkCounter >= 6) {
      Board.gameover = true;
      return;
    }

    // Remove top row
    Board.map.shift();

    // Remove bottom row
    Board.map.pop();

    // Remove leftmost column for each row
    for (let row of Board.map) {
      row.shift();
    }

    // Remove rightmost column for each row
    for (let row of Board.map) {
      row.pop();
    }

    // Replace the top row with new Boundary instances
    for (let col = 0; col < Board.map[0].length; col++) {
      Board.map[0][col] = new Boundary(0, col);
    }

    // Replace the bottom row with new Boundary instances
    let lastRow = Board.map.length - 1;
    for (let col = 0; col < Board.map[lastRow].length; col++) {
      Board.map[lastRow][col] = new Boundary(lastRow, col);
    }

    // Replace the leftmost column with new Boundary instances
    for (let row = 0; row < Board.map.length; row++) {
      Board.map[row][0] = new Boundary(row, 0);
    }

    // Replace the rightmost column with new Boundary instances
    let lastCol = Board.map[0].length - 1;
    for (let row = 0; row < Board.map.length; row++) {
      Board.map[row][lastCol] = new Boundary(row, lastCol);
    }

    // We must update the rows and cols of the Tile instances
    for (let i = 0; i < Board.map.length; i++) {
      for (let j = 0; j < Board.map[i].length; j++) {
        const tile = Board.map[i][j];
        if (tile instanceof Tile) {
          tile.row = i;
          tile.col = j;
        }
      }
    }

    Board.mapWidth = Board.map[0].length * Tile.size;
    Board.mapHeight = Board.map.length * Tile.size;

    Board.gameFieldX += 50;
    Board.gameFieldY += 50;

    Board.gameFieldEndX -= 50;
    Board.gamefieldEndY -= 50;

    Board.playFieldStartX += 50;
    Board.playFieldStartY += 50;

    console.log(Board.gameover);

  }

  static startTimer() {
    if (!Board.intervalId) {
      Board.intervalId = setInterval(() => {
        Board.timer += 1;
        if (Board.timer % 5 === 0) {
          Board.shrinkPlayField();
        }
      }, 1000);
    }
  }

  static stopTimer() {
    if (Board.intervalId) {
      clearInterval(Board.intervalId);
      Board.intervalId = null;
    }
  }

  reset() {
    Board.map = [
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "-"],
      ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"]
    ]

    Board.timer = 0;
    Board.shrinkCounter = 0;
    Board.gameover = false;

    Board.canvasCenterX = canvas.width / 2
    Board.canvasCenterY = canvas.height / 2

    // Map total Width and Height
    Board.mapWidth = Board.map[0].length * Tile.size;
    Board.mapHeight = Board.map.length * Tile.size;

    // Map Start x and y
    Board.gameFieldX = Board.canvasCenterX / 2 / 2 + 60; //300
    Board.gameFieldY = Board.canvasCenterY / 4; //100

    // Map End x and y
    Board.gameFieldEndX = (Board.map[0].length * Tile.size) + (Tile.size * 3)
    Board.gameFieldEndY = (Board.map.length * Tile.size) + (Tile.size * 2)

    // Playfield Width and Height
    Board.playFieldWidth = Board.mapWidth - Tile.size * 2;
    Board.playFieldHeight = Board.mapHeight - Tile.size * 2;

    // Playfield Start x and y
    Board.playFieldStartX = Board.gameFieldX + Tile.size; // 350;
    Board.playFieldStartY = Board.gameFieldY + Tile.size; // 150


  }
}

export default Board;

