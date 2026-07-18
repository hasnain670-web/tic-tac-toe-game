// ==========================================
// TIC TAC TOE
// PART 1
// ==========================================

// ==========================
// DOM ELEMENTS
// ==========================

const boxes = document.querySelectorAll(".box");

const resetBtn = document.querySelector("#rest-btn");

const newGameBtn = document.querySelector("#new-game");

const msgContainer = document.querySelector(".msg-container");

const msg = document.querySelector("#msg");

const turnText = document.querySelector("#turn");

const gameMode = document.querySelector("#game-mode");

const themeBtn = document.querySelector("#theme-btn");

const musicBtn = document.querySelector("#music-btn");

const timeText = document.querySelector("#time");

const xScoreText = document.querySelector("#x-score");

const oScoreText = document.querySelector("#o-score");

const drawScoreText = document.querySelector("#draw-score");

const resetScoreBtn = document.querySelector("#reset-score");

// ==========================
// AUDIO
// ==========================

const clickSound = document.querySelector("#clickSound");

const winnerSound = document.querySelector("#winnerSound");

const drawSound = document.querySelector("#drawSound");

const bgMusic = document.querySelector("#bgMusic");

// ==========================
// GAME VARIABLES
// ==========================

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let currentPlayer = "O";

let gameOver = false;

let mode = "player";

let moveCount = 0;

// ==========================
// SCORE
// ==========================

let xScore = 0;

let oScore = 0;

let drawScore = 0;

// ==========================
// TIMER
// ==========================

let seconds = 0;

let minutes = 0;

let timer;

// ==========================
// MUSIC
// ==========================

let musicPlaying = false;

// ==========================
// WIN PATTERNS
// ==========================

const winPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];

// ==========================
// INITIALIZE GAME
// ==========================

window.onload = () => {

    loadScores();

    loadTheme();

    updateScoreBoard();

    mode = gameMode.value;

    resetGame();

};
// let mode = "player";
gameMode.addEventListener("change", () => {

    mode = gameMode.value;

    resetGame();

});
// ==========================================
// PART 2
// PLAYER GAME LOGIC
// ==========================================

// ==========================
// CLICK EVENTS
// ==========================

boxes.forEach((box, index) => {

    box.addEventListener("click", () => {

        if (gameOver) return;

        if (board[index] !== "") return;

        clickSound.currentTime = 0;
        clickSound.play();

        playerMove(index);

    });

});

// ==========================
// PLAYER MOVE
// ==========================

function playerMove(index) {

    if (board[index] !== "" || gameOver) return;

    board[index] = currentPlayer;

    boxes[index].innerText = currentPlayer;

    boxes[index].disabled = true;

    if (currentPlayer === "X") {

        boxes[index].classList.add("x-color");

    } else {

        boxes[index].classList.add("o-color");

    }

    moveCount++;

    checkWinner();

    if (gameOver) return;

    // AI Mode
    if (mode === "easy") {

        currentPlayer = "X";

        turnText.innerText = "🤖 Computer Thinking...";

        setTimeout(aiMoveEasy, 500);

        return;

    }

    if (mode === "hard") {

        currentPlayer = "X";

        turnText.innerText = "🧠 AI Thinking...";

        setTimeout(aiMoveHard, 500);

        return;

    }

    // Player vs Player

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    turnText.innerText = `Player ${currentPlayer} Turn`;

}
function aiMoveEasy() {

    if (gameOver) return;

    let empty = [];

    board.forEach((cell, index) => {

        if (cell === "") {

            empty.push(index);

        }

    });

    if (empty.length === 0) return;

    let randomIndex = Math.floor(Math.random() * empty.length);

    let move = empty[randomIndex];

    board[move] = "X";

    boxes[move].innerText = "X";

    boxes[move].disabled = true;

    boxes[move].classList.add("x-color");

    moveCount++;

    checkWinner();

    if (gameOver) return;

    currentPlayer = "O";

    turnText.innerText = "Player O Turn";

}
// ==========================
// CHECK WINNER
// ==========================

function checkWinner() {

    for (let pattern of winPatterns) {

        let [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {

            boxes[a].classList.add("winner");
            boxes[b].classList.add("winner");
            boxes[c].classList.add("winner");

            showWinner(board[a]);

            return;

        }

    }

    if (moveCount === 9) {

        showDraw();

    }

}
function checkWinnerBoard(board) {

    for (let pattern of winPatterns) {

        let [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {

            return board[a];

        }

    }

    if (board.every(cell => cell !== "")) {

        return "draw";

    }

    return null;

}
function minimax(board, depth, isMaximizing) {

    let result = checkWinnerBoard(board);

    if (result === "X") return 10 - depth;

    if (result === "O") return depth - 10;

    if (result === "draw") return 0;

    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {

            if (board[i] === "") {

                board[i] = "X";

                let score = minimax(board, depth + 1, false);

                board[i] = "";

                bestScore = Math.max(bestScore, score);

            }

        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {

            if (board[i] === "") {

                board[i] = "O";

                let score = minimax(board, depth + 1, true);

                board[i] = "";

                bestScore = Math.min(bestScore, score);

            }

        }

        return bestScore;

    }

}
function findBestMove() {

    let bestScore = -Infinity;

    let move = -1;

    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {

            board[i] = "X";

            let score = minimax(board, 0, false);

            board[i] = "";

            if (score > bestScore) {

                bestScore = score;

                move = i;

            }

        }

    }

    return move;

}
function aiMoveHard() {

    if (gameOver) return;

    let move = findBestMove();

    if (move === -1) return;

    board[move] = "X";

    boxes[move].innerText = "X";

    boxes[move].disabled = true;

    boxes[move].classList.add("x-color");

    moveCount++;

    checkWinner();

    if (gameOver) return;

    currentPlayer = "O";

    turnText.innerText = "Player O Turn";

}
// ==========================
// SHOW WINNER
// ==========================

function showWinner(player) {

    gameOver = true;

    clearInterval(timer);

    winnerSound.currentTime = 0;
    winnerSound.play();

    bgMusic.pause();

    musicPlaying = false;

    musicBtn.innerHTML = "🎵 Music";

    if (player === "X") {

        xScore++;

    } else {

        oScore++;

    }

    updateScoreBoard();

    msg.innerText = `🏆 Winner is ${player} `;

    msgContainer.classList.remove("hide");

}
// ==========================
// SHOW DRAW
// ==========================

function showDraw() {

    gameOver = true;

    clearInterval(timer);

    drawSound.currentTime = 0;
    drawSound.play();

    bgMusic.pause();

    musicPlaying = false;

    musicBtn.innerHTML = "🎵 Music";

    drawScore++;

    updateScoreBoard();

    msg.innerText = "🤝 Match Draw";

    msgContainer.classList.remove("hide");

}

// ==========================
// RESET GAME
// ==========================

function resetGame() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    currentPlayer = "O";


    if (mode === "player") {

        turnText.innerText = "Player O Turn";

    } else {

        turnText.innerText = "Your Turn";

    }
    moveCount = 0;

    gameOver = false;

    resetTimer();

    boxes.forEach(box => {

        box.innerText = "";
        box.disabled = false;

        box.classList.remove("winner");
        box.classList.remove("x-color");
        box.classList.remove("o-color");

    });

    msgContainer.classList.add("hide");

    turnText.innerText = "Player O Turn";
    bgMusic.pause();

    musicPlaying = false;

    musicBtn.innerHTML = "🎵 Music";

}

// ==========================
// BUTTON EVENTS
// ==========================

resetBtn.addEventListener("click", resetGame);

newGameBtn.addEventListener("click", resetGame);

// ==========================================
// PART 3
// SCOREBOARD + LOCAL STORAGE + TIMER
// ==========================================

// ==========================
// LOAD SCORES
// ==========================

function loadScores() {

    xScore = Number(localStorage.getItem("xScore")) || 0;
    oScore = Number(localStorage.getItem("oScore")) || 0;
    drawScore = Number(localStorage.getItem("drawScore")) || 0;

}

// ==========================
// UPDATE SCOREBOARD
// ==========================

function updateScoreBoard() {

    xScoreText.innerText = xScore;
    oScoreText.innerText = oScore;
    drawScoreText.innerText = drawScore;

    localStorage.setItem("xScore", xScore);
    localStorage.setItem("oScore", oScore);
    localStorage.setItem("drawScore", drawScore);

}

// ==========================
// RESET SCORES
// ==========================

resetScoreBtn.addEventListener("click", () => {

    xScore = 0;
    oScore = 0;
    drawScore = 0;

    updateScoreBoard();

});

// ==========================
// START TIMER
// ==========================

function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        seconds++;

        if (seconds === 60) {

            seconds = 0;
            minutes++;

        }

        let min = minutes < 10 ? "0" + minutes : minutes;
        let sec = seconds < 10 ? "0" + seconds : seconds;

        timeText.innerText = `${min}:${sec} `;

    }, 1000);

}

// ==========================
// RESET TIMER
// ==========================

function resetTimer() {

    clearInterval(timer);

    minutes = 0;
    seconds = 0;

    timeText.innerText = "00:00";

}

// ==========================
// START TIMER ON FIRST MOVE
// ==========================

boxes.forEach((box) => {

    box.addEventListener("click", () => {

        if (moveCount === 0) {

            startTimer();

        }

    });

});

// ==========================================
// PART 4
// THEME + MUSIC + SOUND
// ==========================================

// ==========================
// LOAD THEME
// ==========================

function loadTheme() {

    let theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeBtn.innerHTML = "☀️ Light Mode";

    } else {

        document.body.classList.remove("dark");

        themeBtn.innerHTML = "🌙 Dark Mode";

    }

}

// ==========================
// CHANGE THEME
// ==========================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML = "☀️ Light Mode";

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML = "🌙 Dark Mode";

    }

});

// ==========================
// BACKGROUND MUSIC
// ==========================

bgMusic.loop = true;
bgMusic.volume = 0.3;

musicBtn.addEventListener("click", () => {

    if (musicPlaying) {

        bgMusic.pause();

        musicBtn.innerHTML = "🎵 Music";

    } else {

        bgMusic.play();

        musicBtn.innerHTML = "🔇 Stop Music";

    }

    musicPlaying = !musicPlaying;

});

// ==========================
// SOUND SETTINGS
// ==========================

clickSound.volume = 0.7;

winnerSound.volume = 1;

drawSound.volume = 0.8;
