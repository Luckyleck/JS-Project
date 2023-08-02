import Board from "./board.js";
import Player from "./player.js";
import Playertwo from "./playertwo.js";
import Tile from "./tile.js";
import AI from "./ai.js";
import Game from "./play.js"


const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

//buttons
const spawnBtnPlayer = document.getElementById("spawn-btn-player");
const spawnBtnAI = document.getElementById("spawn-btn-ai")
const playAgain = document.getElementById("play-again")
const winMessage = document.getElementById("win-message")

const playerOneSpawnX = 285;
const playerOneSpawnY = 175;
const playerTwoSpawnX = 935;
const playerTwoSpawnY = 675;
const aiSpawnX = 825;
const aiSpawnY = 625;



playAgain.style.display = "none";
winMessage.style.display = "none";

spawnBtnPlayer.addEventListener("click", () => {
  startPlayerGame();
  playAgain.style.display = "none"
  winMessage.style.display = "none";
})

spawnBtnAI.addEventListener("click", () => {
  startAiGame();
  playAgain.style.display = "none";
  winMessage.style.display = "none";
})

playAgain.addEventListener('click', () => {
  playerTwo instanceof AI ? startAiGame() : startPlayerGame();
  playAgain.style.display = "none"
  winMessage.style.display = "none";
})


let playerOne;
let playerTwo;
let board;

function localAnimate(player1, player2, board) {

  window.requestAnimationFrame(() => {
    c.clearRect(0, 0, canvas.width, canvas.height);

    board.draw();
    if (player1 && player2) {
      if (player1.alive && !player2.victory) {
        player1.draw();
      } else {
        winMessage.innerText = "Blue wins!"
        winMessage.style.display = "block"
        spawnBtnPlayer.style.display = "block"; // show the spawn button
        spawnBtnAI.style.display = "block"; // show the spawn button
        playAgain.style.display = "block"
        return; // stop the animation
      }
      if (player2.alive && !player1.victory) {
        player2.draw();
      } else {
        winMessage.innerText = "Red Wins!";
        winMessage.style.display = "block";
        spawnBtnPlayer.style.display = "block"; // show the spawn button
        spawnBtnAI.style.display = "block"; // show the spawn button
        playAgain.style.display = "block";
        return; // stop the animation
      }
    }
    localAnimate(player1, player2, board);
  });
}

function startPlayerGame() {

  spawnBtnPlayer.style.display = "none";
  spawnBtnAI.style.display = "none";

  if (board) {
    board.reset();
  }
  if (playerOne) {
    playerOne.reset();
  }
  if (playerTwo) {
    playerTwo.reset();
  }

  board = undefined;
  playerOne = undefined;
  playerTwo = undefined;

  board = new Board();
  playerOne = new Player(playerOneSpawnX, playerOneSpawnY)
  playerTwo = new Playertwo(playerTwoSpawnX, playerTwoSpawnY)
  Board.startTimer();
  // playerOne = new Player(Board.gameFieldX + (Tile.size * 1.5), Board.gameFieldY + (Tile.size * 1.5))
  // playerTwo = new Playertwo(Board.mapWidth + (Tile.size * 2.7), Board.mapHeight + (Tile.size / 2))

  playerOne.currentPlace.occupied = true;
  playerTwo.currentPlace.occupied = true;
  console.log(playerOne, playerTwo)

  localAnimate(playerOne, playerTwo, board);
}


function aiAnimate(player1, ai, board) {
  window.requestAnimationFrame(() => {
    c.clearRect(0, 0, canvas.width, canvas.height);

    board.draw();
    if (player1 && ai) {
      if (player1.alive && !ai.victory) {
        player1.draw();
      } else {
        winMessage.innerText = "Rambo wins!";
        winMessage.style.display = "block";
        spawnBtnAI.style.display = "block";
        spawnBtnPlayer.style.display = "block";
        playAgain.style.display = "block";
        return;
      }
      if (ai.alive && !player1.victory) {
        ai.draw();
        ai.makeMove();
        ai.makeMove();
        ai.break();
        // ai.makeMove();
      } else {
        winMessage.innerText = "You win!";
        winMessage.style.display = "block";
        spawnBtnAI.style.display = "block";
        spawnBtnPlayer.style.display = "block";
        playAgain.style.display = "block";
        return; // 
      }
    }
    aiAnimate(player1, ai, board);
  });
}

function startAiGame() {
  spawnBtnAI.style.display = "none";
  spawnBtnPlayer.style.display = "none";
  if (board) {
    board.reset();
  }
  if (playerOne) {
    playerOne.reset();
  }
  if (playerTwo) {
    playerTwo.reset();
  }

  board = undefined;
  playerOne = undefined;
  playerTwo = undefined;

  board = new Board();
  playerOne = new Player(playerOneSpawnX, playerOneSpawnY)
  playerTwo = new AI(aiSpawnX, aiSpawnY)
  // playerOne = new Player(
  //   Board.gameFieldX + Tile.size * 1.5,
  //   Board.gameFieldY + Tile.size * 1.5
  // );
  // playerTwo = new AI(
  //   Board.mapWidth + Tile.size / 2,
  //   Board.mapHeight - Tile.size / 2
  // );

  playerOne.currentPlace.occupied = true;
  playerTwo.currentPlace.occupied = true;
  console.log(playerOne, playerTwo);
  console.log(playerOne.currentPlace)
  console.log(playerTwo.currentPlace)

  aiAnimate(playerOne, playerTwo, board);
}

console.log(Board.mapWidth, Board.mapHeight, Board.gameFieldEndX, Board.gameFieldEndY)





