///////////////////////////////////////////////////////////////////////////////
// ----------------------- CONSTANTS DECLARATIONS -------------------------- //
///////////////////////////////////////////////////////////////////////////////


// Button for starting a new game
const newGameBtn = document.getElementById("new-game-btn")

// Buttons with colors
const colorBtn1 = document.getElementById("color-btn-1")
const colorBtn2 = document.getElementById("color-btn-2")
const colorBtn3 = document.getElementById("color-btn-3")
const colorBtn4 = document.getElementById("color-btn-4")
const colorBtn5 = document.getElementById("color-btn-5")
const colorBtn6 = document.getElementById("color-btn-6")

// Difficulty level selection buttons
const easyBtn = document.getElementById("easy-btn")
const hardBtn = document.getElementById("hard-btn")

// Text displaying the color to be guessed
const colorText = document.getElementById("color-text")

// Text displaying if the guess is correct or not
const results = document.getElementById("result-text")

// Text displaying the score and the lives left
const liveResult = document.getElementById("lives")


///////////////////////////////////////////////////////////////////////////////
// ----------------------- VARIABLES DECLARATIONS -------------------------- //
///////////////////////////////////////////////////////////////////////////////


// Lives left
let lives = 5

// Flag to indicate if there are no more lives
let gameOver = false

// Score of the game
let score = 0

// Flags for the selected level
let easy = true
let hard = false

// All the variables that will contain the 6 colors. colorTrue is the one to be guessed
let colorTrue = null
let colorFalse1 = null
let colorFalse2 = null
let colorFalse3 = null
let colorFalse4 = null
let colorFalse5 = null

// The 3 numbers of a rgb color code
let rColor = null
let gColor = null
let bColor = null

// The 3 numbers of the rgb color code to be guessed
let rColorTrue = null
let gColorTrue = null
let bColorTrue = null

// The distance between 2 colors
let distance = 0

// The button that contains the right color
let correctButton = null

// The matrix with all the color button elements
let colorButtons = [colorBtn1, colorBtn2, colorBtn3, colorBtn4, colorBtn5, colorBtn6]

// The matrix with all colors. The first color is the one that needs to be guessed
let colors = [colorTrue, colorFalse1, colorFalse2, colorFalse3, colorFalse4, colorFalse5]


///////////////////////////////////////////////////////////////////////////////
// -------------------------- EVENT LISTENERS ------------------------------ //
///////////////////////////////////////////////////////////////////////////////


// New game. Calls the newGame() function
newGameBtn.addEventListener("click", newGame)

// When clicking a color button, checks if it is the correct guess
colorBtn1.addEventListener("click", function() {isWinner(0)})
colorBtn2.addEventListener("click", function() {isWinner(1)})
colorBtn3.addEventListener("click", function() {isWinner(2)})
colorBtn4.addEventListener("click", function() {isWinner(3)})
colorBtn5.addEventListener("click", function() {isWinner(4)})
colorBtn6.addEventListener("click", function() {isWinner(5)})

// Level selection
easyBtn.addEventListener("click", function() {levelSelection("easy")})
hardBtn.addEventListener("click", function() {levelSelection("hard")})


///////////////////////////////////////////////////////////////////////////////
// ------------------------------ FUNCTIONS -------------------------------- //
///////////////////////////////////////////////////////////////////////////////


// A function that creates a new GAME. If gameOver, we reset the score and the lives
function newGame() {
  if (gameOver) {
    // If we have hit game over, all variables are restarted
    restartGame()
    liveResult.innerHTML = `LIVES: ${lives} &nbsp;&nbsp;&nbsp;&nbsp; SCORE: ${score}`
  }
  selectRandomColors()
  applyColorToButtons()
  // Display the color to be guessed
  colorText.innerHTML = `GUESS THE FOLLOWING COLOR: <br> ${colors[0]}`
  results.style.color = "black"
}

// A function that creates the random colors for the buttons. The first one
// created is the one that needs to be guessed
function selectRandomColors() {
  // We start choosing randomly the color to be guessed
  rColorTrue = Math.floor(Math.random() * 257)
  gColorTrue = Math.floor(Math.random() * 257)
  bColorTrue = Math.floor(Math.random() * 257)
  color = `RGB(${rColorTrue}, ${gColorTrue}, ${bColorTrue})`
  colors[0] = color
  // We go through all the different buttons
  for (let i = 1; i < colors.length; i++) {
    // We select a random color and compute the difference (distance) to the one
    // to be guessed
    rColor = Math.floor(Math.random() * 257)
    gColor = Math.floor(Math.random() * 257)
    bColor = Math.floor(Math.random() * 257)
    distance = Math.sqrt((rColorTrue - rColor)**2 + (gColorTrue - gColor)**2 + (bColorTrue - bColor)**2)
    // Under easy level, we want to make sure that all other colors have at least
    // X distance to the one to be guessed. If not, we try with another random color
    // until it fullfils the requirement
    if (easy) {
      while (distance < 100) {
        rColor = Math.floor(Math.random() * 257)
        gColor = Math.floor(Math.random() * 257)
        bColor = Math.floor(Math.random() * 257)
        distance = Math.sqrt((rColorTrue - rColor)**2 + (gColorTrue - gColor)**2 + (bColorTrue - bColor)**2)
      }
    // For the hard level, we don't want the difference to be greater than X value
    } else if (hard) {
      while (distance > 250) {
        rColor = Math.floor(Math.random() * 257)
        gColor = Math.floor(Math.random() * 257)
        bColor = Math.floor(Math.random() * 257)
        distance = Math.sqrt((rColorTrue - rColor)**2 + (gColorTrue - gColor)**2 + (bColorTrue - bColor)**2)
      }
    }
    // When the conditions are met, we select the color
    color = `RGB(${rColor}, ${gColor}, ${bColor})`
    colors[i] = color
  }
}

// A function that applies the colors from the colors matrix to the buttons
function applyColorToButtons() {
  // We start creating a matrix that contains if a button has been assigned a color or not
  let coloredButtons = [false, false, false, false, false, false]
  // select a random position to be colored
  let index = Math.floor(Math.random() * 6)
  // We need to apply a color to all 6 buttons
  for (let i = 0; i < colorButtons.length; i++) {
    // If the selected buttons has already been colored, then try with another button
    while (coloredButtons[index] == true) {
      index = Math.floor(Math.random() * 6)
    }
    // We color the button
    colorButtons[index].style.backgroundColor = colors[i]
    // We set the button to colored
    coloredButtons[index] = true
    // Just want to save which one is the right one
    if (i == 0) {
      correctButton = index
    }
  }
}

// Only called if correct guess. Add points based on difficulty level
function computeScore() {
  if (easy) {
    score += 50
  } else {
    score += 100
  }
}

// Only called if missed guess. Substract life unless it is gameOver. In that
// case, display that it is game over
function substractLife() {
  if (lives != 0) {
    lives -= 1
  } else {
    gameOver = true
    results.textContent = "GAME OVER! START AGAIN!"
  }
}

// Check if the selected guess is the right one. If it is already game Over, nothing
// happens.
function isWinner(index) {
  if (!gameOver) {
    // If correct, show message indicating that it is right. Increase score and
    // start new colors after 3 seconds showing the message
    if (index == correctButton) {
      results.textContent = "CORRECT! YOU WON! Try with a new color"
      results.style.color = "white"
      computeScore()
      setTimeout("newGame()", 2000)
    // If incorrect, show message indicating that it is wrong. Reduce lives
    } else {
      results.textContent = "INCORRECT! Try a different color"
      results.style.color = "white"
      substractLife()
    }
    // Display the score and the remaining lives
      liveResult.innerHTML = `LIVES: ${lives} &nbsp;&nbsp;&nbsp;&nbsp; SCORE: ${score}`
  }
}

// Function to define what level we are playing at. When selected, a new game is
// started. Only happens if clicking on the other level than the current one
function levelSelection(level) {
  if (level == "easy" && hard) {
    easy = true
    hard = false
    // As a new game is starting, we restart all variables
    restartGame()
    newGame()
  } else if (level == "hard" && easy) {
    easy = false
    hard = true
    // As a new game is starting, we restart all variables
    restartGame()
    newGame()
  }
}

// Function to restart all variables. To be used when starting a new game
function restartGame() {
  gameOver = false
  lives = 5
  score = 0
}
