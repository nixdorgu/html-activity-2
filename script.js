const wrongSpan = document.querySelector(".wrong-answers");

const modal = document.querySelectorAll(".modal")[0];
const correctWordModal = document.querySelectorAll(".modal")[1];

const modalSpan = document.querySelectorAll(".close")[0];
const correctWordSpan = document.querySelectorAll(".close")[1];

const modalWordSpan = document.querySelector(".correct-words");
const correctWord = document.querySelector(".correct-word");

const alphabet = "qwertyuiopasdfghjklzxcvbnm";
const randomizeWord = () => words[Math.floor(Math.random() * words.length)];
const formatUnit = (unit) => (unit < 10 ? `0${unit}` : unit);
const words = [
  "coo",
  "ko",
  "atutubo",
  "javascript",
  "python",
  "stackoverflow",
  "lobby",
  "flutter",
  "application",
  "coke",
  "gtech",
  "laptop",
  "programming",
  "software",
  "engineering",
  "graduate",
];

let countdown;
let secondsRemaining;
let correctWords = 0;
let selectedWord = randomizeWord();
let correctLetters = [],
  incorrectLetters = [];

// Get a new word
function getNewWord() {
  selectedWord = randomizeWord();
  const wordDiv = document.querySelector(".word");

  selectedWord.split("").map((letter) => {
    const letterDiv = document.createElement("div");
    letterDiv.className = "letter";
    letterDiv.innerHTML = correctLetters.includes(letter)
      ? letter.toUpperCase()
      : " ";
    wordDiv.appendChild(letterDiv);
  });
}

// Determines whether all correct characters have been chosen
function difference(setA, setB) {
  let _difference = new Set(setA);

  for (let elem of setB) {
    _difference.delete(elem);
  }

  return _difference;
}

// Show Correct Characters
function getWord() {
  const wordDiv = document.querySelector(".word");

  selectedWord.split("").map((letter, index) => {
    wordDiv.children[index].innerHTML = correctLetters.includes(letter)
      ? letter.toUpperCase()
      : " ";
  });
}

function createKeyboard() {
  const keyboard = document.querySelector("#keyboard");

  alphabet.split("").map((letter) => {
    const button = document.createElement("button");
    button.id = letter;
    button.disabled = false;
    button.innerHTML = letter.toUpperCase();
    button.onclick = onClick;
    keyboard.appendChild(button);
  });
}

// Countdown Helper
function startTimer(seconds = 120000) {
  const now = new Date().getTime();
  const stop = now + seconds;

  countdown = setInterval(() => {
    let start = new Date().getTime();
    let difference = stop - start;
    secondsRemaining = difference;

    let minutes = Math.floor((difference % (1000 * 3600)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (difference <= 0) {
      stopTimer();
      gameOver();
    } else {
      document.querySelector(".timer").innerHTML = `${formatUnit(
        minutes
      )}:${formatUnit(seconds)}`;
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(countdown);
}

function pauseTimer() {
  stopTimer();
}

// Game helpers
function reset() {
  // reset color letter
  document.querySelector(".word").style = "color: #000";

  //   reset letters
  correctLetters = [];
  incorrectLetters = [];

  //   reset hangman
  const figureParts = document.querySelectorAll(".show");

  for (let index = 0; index < figureParts.length; index++) {
    figureParts[index].classList = "hide";
  }

  //   reset keyboard
  const keyboard = document.querySelector("#keyboard");

  while (keyboard.children.length !== 0) {
    keyboard.removeChild(keyboard.lastChild);
  }

  //   reset word div
  const wordDiv = document.querySelector(".word");

  while (wordDiv.children.length !== 0) {
    wordDiv.removeChild(wordDiv.lastChild);
  }

  //   reset modal
  modal.style.display = "none";
  correctWordModal.style.display = "none";
}

function startGame() {
  reset();
  createKeyboard();
  getNewWord();
}

function wordGuessed() {
  pauseTimer();
  document.querySelector(".word").style = "color: green";

  correctWord.innerHTML = selectedWord;
  correctWordModal.style.display = "block";
}

function newGame() {
  document.querySelector(".timer").innerHTML = "02:00";
  correctWords = 0;
  wrongSpan.innerHTML = 0;
  startTimer();
  startGame();
}

function gameOver() {
  pauseTimer();
  modalWordSpan.innerHTML = correctWords;
  modal.style.display = "block";
  stopTimer();
}

window.onload = newGame;

modalSpan.onclick = function () {
  modal.style.display = "none";
  newGame();
};

correctWordSpan.onclick = function () {
  correctWordModal.style.display = "none";
  correctWords += 1;
  startTimer(secondsRemaining);
  startGame();
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    newGame();
  }

  if (event.target == correctWordModal) {
    correctWordModal.style.display = "none";
    correctWords += 1;
    startTimer(secondsRemaining);
    startGame();
  }
};

function onClick(e) {
  if (wrongSpan.innerHTML >= 6) return;

  let button;

  if (e.type == "keydown") {
    button = document.querySelector(`#${e.key}`);
    button.disabled = true;
  } else {
    e.target.disabled = true;
    button = e.target;
  }

  if (selectedWord.includes(button.id)) {
    correctLetters.push(button.id);

    const correctLettersSet = new Set(correctLetters);
    const selectedWordSet = new Set(selectedWord.split(""));
    getWord();

    if (difference(selectedWordSet, correctLettersSet).size == 0) {
      wordGuessed();
    }
  } else {
    if (!incorrectLetters.includes(button.id)) {
      incorrectLetters.push(button.id);
      const figureParts = document.querySelectorAll(".hide");

      if (figureParts.length != 0) {
        figureParts[0].classList = "show";
        wrongSpan.innerHTML = Number(wrongSpan.innerHTML) + 1;
      }

      if (wrongSpan.innerHTML == 6) gameOver();
    }
  }
}

window.onkeydown = function onKeyDown(e) {
  const key = e.key.toLowerCase();
  if (alphabet.includes(key)) onClick(e);
};
