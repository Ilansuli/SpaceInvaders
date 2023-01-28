const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = 'HERO';
const ALIEN = 'ALIEN';
const LASER = '⚜';
const SUPER_LASER = '🔱'
const MEGA_LASER = '🗼'
const SKY = 'SKY'

const HERO_IMG = `<img src="img/spaceship.png">`
const ALIEN_IMG = `<img src="img/alien.png">`
const LASER_IMG = `<img src="img/laser-beam.png">`
const MEGA_LASER_IMG = `<img src="img/mega-laser-beam.png">`
const SUPER_LASER_IMG = `<img src="img/super-laser-beam.png">`

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard
var gGame
// Game's init when page load
function init() {
    //Undisplay Start screen related
    hideStartBtn()
    hideInstructions()
    //Display game info
    const elGameInfo = document.querySelector('.game-info')
    elGameInfo.style.display = 'block'
    //Aliens Positions
    gAliensTopRowIdx = 0
    gAliensBottomRowIdx = 2
    gAliensLeftColIdx = 0
    gAliensRightColIdx = 8
    gIsSuperShotLeft = 3
    gIsLaserMega = false
    gIsLaserSuper = false
    //modal
    closeModal()
    //Game
    gGame = {
        score: 0,
        isOn: true,
        isVictory: false,
        aliensCount: 0
    }
    //board
    gBoard = createBoard()
    createHero(gBoard)
    createAliens(gBoard)
    renderBoard(gBoard)
    //Alien interval start
    clearInterval(gIntervalAliens)
    gIntervalAliens = null
    moveAliens()
    //score DOM
    const elScore = document.querySelector('h2 span')
    elScore.innerText = gGame.score

}

// Create and returns the board with aliens on top, ground at bottom
// use the functions: createCell, createHero, createAliens
function createBoard() {
    var board = []
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = []
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = {
                type: SKY,
                gameObject: null
            }
        }
    }
    return board
}
// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = '<table><tbody>'
    for (let i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (let j = 0; j < board[0].length; j++) {
            var cell
            if(board[i][j].gameObject === HERO){
                cell = HERO_IMG
            }else if(board[i][j].gameObject === ALIEN){
                cell = ALIEN_IMG
            } else{
                cell = ''
            }
            strHTML += `<td title="{i : ${i}, j : ${j}}" data-i="${i}"data-j="${j}"">${cell}</td>`
        }
        strHTML += `</tr>`
    }
    strHTML += `</tbody></table>`

    const elGameContainer = document.querySelector('.game-container')
    elGameContainer.innerHTML = strHTML
}
// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN}
function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}
// position such as: {i: 2, j: 7}
function updateCell(pos, gameObject = null,value = '') {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = value
}
//Update score by desired difference
function updateScore(diff) {
    // Model
    gGame.score += diff
    // DOM
    document.querySelector('h2 span').innerText = gGame.score
}
//Check if game's aliens count is 0
function checkVictory() {
    if (!gGame.aliensCount) {
        gGame.isVictory = true
        gameOver()
    }
}
function gameOver() {
    clearInterval(gIntervalAliens)
    gGame.isOn = false
    //win or lose message
    var msg = gGame.isVictory ? 'You Won!!' : 'Game Over!!'
    openModal(msg)
}
function openModal(msg) {
    const elModal = document.querySelector('.modal')
    const elSpan = elModal.querySelector('.msg')
    elSpan.innerText = msg
    elModal.style.display = 'block'
}
function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}
function hideStartBtn() {
    const elStartBtn = document.querySelector('.btn-start')
    elStartBtn.style.display = 'none'
}
function hideInstructions() {
    const elInstructions = document.querySelector('.instructions')
    elInstructions.style.display = 'none'
}

