const ALIEN_SPEED = 500
var gIntervalAliens
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = 2
var gIsAlienFreeze = true


function createAliens(board) {
    for (let i = 0; i < ALIENS_ROW_COUNT; i++) {
        for (let j = 0; j < ALIENS_ROW_LENGTH; j++) {
            board[i][j].gameObject = ALIEN
            gGame.aliensCount++
        }
    }
}

function handleAlienHit(pos, nextPos) {
    stopLaser(pos, nextPos)
    gGame.aliensCount--
    updateScore(10)
    if (!gGame.aliensCount) gameOver()
}

function shiftBoardRight(board, fromJ, toJ) {
    const newBoard = [];

    for (let i = 0; i < board.length; i++) {
        if (i <= gAliensBottomRowIdx && i >= gAliensTopRowIdx) {
            const newRow = [];
            newRow.push(createCell())
            for (let j = 0; j < board[i].length - 1; j++) {
                newRow.push(board[i][j]);
            }
            newBoard[i] = newRow;
        } else {
            newBoard[i] = board[i]
        }
    }
    gBoard = newBoard
    renderBoard(newBoard)
}
function shiftBoardLeft(board, fromJ, toJ) {

}
function shiftBoardDown(board, fromI, toI) {

}
// runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {

}
function freezeAliens() {
    gIsAlienFreeze = false
}