const BOARD_SIZE = 14;
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = '♆';
const ALIEN = '👽';
const LASER = '⤊';
const SKY = 'SKY'

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard
var gGame
// Called when game loads
function init() {
    gGame = {
        score: 0,
        isOn: false,
        aliensCount: 0
    }
    //board
    gBoard = createBoard()
    createHero(gBoard)
    createAliens(gBoard)
    renderBoard(gBoard)
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
    var strHTML = '<table><tbody    >'
    for (let i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (let j = 0; j < board[0].length; j++) {
            const cell = !board[i][j].gameObject ? '' : board[i][j].gameObject

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
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}
function checkBounds(i, j) {
    if (i <= 0 ||
        i >= gBoard.length ||
        j <= 0 ||
        j >= gBoard[0].length)
        return
}
function updateScore(diff) {
    // Model
    gGame.score += diff
    // DOM
    document.querySelector('h2 span').innerText = gGame.score
}
function gameOver() {
    openModal('Congratulations, All aliens are dead!!')
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