import Board from "./board.js";
import Tile from "./tile.js";

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

class Playertwo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx;
    this.dy;
    this.radius = 15;
    this.row = Math.floor((this.y - Board.playFieldStartY) / Tile.size + 1); // row is y
    this.col = Math.floor((this.x - Board.playFieldStartX) / Tile.size + 1); // col is x
    this.alive = true;
    // this.row = this.currentTile[0]
    // this.row = this.currentTile[1]

    this.lastKey = "";

    this.keys = {
      ArrowUp: {
        pressed: false,
      },
      ArrowLeft: {
        pressed: false,
      },
      ArrowDown: {
        pressed: false,
      },
      ArrowRight: {
        pressed: false,
      },
    };

    window.addEventListener("keydown", ({ key }) => {
      console.log(key)
      switch (key) {
        case "ArrowUp":
          this.keys.ArrowUp.pressed = true;
          this.lastKey = "ArrowUp";
          if (this.isTile(this.x, this.y - 50)) {
            this.y -= 50;
          }
          if (this.alive && this.isDead()) {
            this.alive = false;
          }
          break;
        case "ArrowLeft":
          this.keys.ArrowLeft.pressed = true;
          this.lastKey = "ArrowLeft";
          if (this.isTile(this.x - 50, this.y)) {
            this.x -= 50;
          }
          if (this.alive && this.isDead()) {
            this.alive = false;
          }
          break;
        case "ArrowDown":
          this.keys.ArrowDown.pressed = true;
          this.lastKey = "ArrowDown";
          if (this.isTile(this.x, this.y + 50)) {
            this.y += 50;
          }
          if (this.alive && this.isDead()) {
            this.alive = false;
          }
          break;
        case "ArrowRight":
          this.keys.ArrowRight.pressed = true;
          this.lastKey = "ArrowRight";
          if (this.isTile(this.x + 50, this.y)) {
            this.x += 50;
          }
          if (this.alive && this.isDead()) {
            this.alive = false;
          }
          break;
        case "Enter":
          switch (this.lastKey) {
            case "ArrowUp":
              if (this.isTile(this.x, this.y - 50)) {
                this.breakTile(this.x, this.y - 50);
              }
              break;
            case "ArrowLeft":
              if (this.isTile(this.x - 50, this.y)) {
                this.breakTile(this.x - 50, this.y);
              }
              break;
            case "ArrowDown":
              if (this.isTile(this.x, this.y + 50)) {
                this.breakTile(this.x, this.y + 50);
              }
              break;
            case "ArrowRight":
              if (this.isTile(this.x + 50, this.y)) {
                this.breakTile(this.x + 50, this.y);
              }
              break;
          }
          console.log("hello");
          break;
      }
      // console.log(keys.d.pressed)
      // console.log(keys.s.pressed)
    });
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "blue";
    c.fill();
    c.closePath();
  }

  currentTile() {
    let row = Math.floor((this.y - Board.playFieldStartY) / Tile.size + 1); // row is y
    let col = Math.floor((this.x - Board.playFieldStartX) / Tile.size + 1); // col is x
    console.log([row, col]);
    return [row, col];
  }

  getPlayerTile() {
    let row = this.currentTile()[0];
    let col = this.currentTile()[1];
    console.log([row, col]);
    console.log(Board.map[row][col]);
    return Board.map[row][col];
  }

  getAnyTile(row, col) {
    return Board.map[row][col];
  }

  // breakTiles

  breakTile(x, y) {
    let pos = this.xyConvert(x, y);
    let row = pos[0];
    let col = pos[1];

    let tile = this.getAnyTile(row, col);
    if (tile.health > 0) {
      tile.health -= 1;
      if (tile.health === 0) {
        tile.visible = false;
      }
    }
    console.log(tile);
  }

  // Tile existence logic (use for boundary detection)

  isTile(x, y) {
    let tile = this.xyConvert(x, y);
    let row = tile[0];
    let col = tile[1];

    if (Board.map[row][col] instanceof Tile) {
      return true;
    } else {
      return false;
    }
  }

  xyConvert(x, y) {
    let row = Math.floor((y - Board.playFieldStartY) / Tile.size + 1); // row is y
    let col = Math.floor((x - Board.playFieldStartX) / Tile.size + 1);

    return [row, col];
  }

  // Player dead logic

  isDead() {
    let tile = this.getPlayerTile();

    console.log(tile);
    if (tile.health === 0) {
      this.alive = false;
    } else {
      this.alive = true;
    }
  }

  // update() {
  //     this.draw()
  //     this.x += this.dx
  //     this.y += this.dy
  // }
}

export default Playertwo;