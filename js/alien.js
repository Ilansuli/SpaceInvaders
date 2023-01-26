const ALIEN_SPEED = 500
var gIntervalAliens
// The following two variables represent the part of the matrix (some rows)
// that we should shift (left, right, and bottom)
// We need to update those when:
// (1) shifting down and (2) last alien was cleared from row
var gAliensTopRowIdx
var gAliensBottomRowIdx
var gAliensLeftColIdx
var gAliensRightColIdx

var gIsAlienFreeze = true


function createAliens(board) {
    for (let i = 0; i < ALIENS_ROW_COUNT; i++) {
        for (let j = 0; j < ALIENS_ROW_LENGTH; j++) {
            //MODEL
            board[i][j].gameObject = ALIEN
            gGame.aliensCount++
        }
    }
}
//If alien hit
function handleAlienHit(pos, nextPos) {
    // Kill alien's alien negs
    if (gIsLaserMega) handleAlienMegaHit(nextPos, gBoard)
    stopLaser(pos, nextPos)
    updateScore(10)
    //if aliens count 0, its a win
    gGame.aliensCount--
    checkVictory()
}
// Killing alien's alien negs
function handleAlienMegaHit(pos, board) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i === pos.i && j === pos.j) continue
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].gameObject === ALIEN) {
                updateCell({ i: i, j: j })
                gGame.aliensCount--
                updateScore(10)
            }
        }
    }
}
//Move aliens group right
function shiftBoardRight(board, fromJ, toJ) {
    const newBoard = createCopyBoard(board)
    const emptyCell = createCell()

    for (let i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        for (let j = fromJ; j < toJ; j++) {
            //Prevent laser from moving together with aliens
            if (board[i][j].gameObject === LASER ||
                board[i][j].gameObject === SUPER_LASER ||
                board[i][j].gameObject === MEGA_LASER) {
                return
            }
            //If its the edge of the board, move aliens down and start shiftLeft interval
            if (j === board[0].length - 1) {
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                clearInterval(gIntervalAliens)
                gIntervalAliens = setInterval(() => {
                    if (!gGame.isOn) return
                    shiftBoardLeft(gBoard, gAliensRightColIdx, gAliensLeftColIdx)
                }, ALIEN_SPEED)
                return
            }
            //New cell position in model
            newBoard[i][j + 1] = board[i][j]
            //Current cell position in model
            newBoard[i][fromJ] = emptyCell
        }
    }
    // Update aliens group location
    gAliensLeftColIdx++
    gAliensRightColIdx++
    //MODEL
    gBoard = newBoard
    //DOM
    renderBoard(newBoard)
}

//Move aliens group left
function shiftBoardLeft(board, fromJ, toJ) {
    const newBoard = createCopyBoard(board)
    const emptyCell = createCell()
    fromJ = fromJ - 1
    toJ = toJ - 1
    for (let i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        for (let j = fromJ; j > toJ; j--) {
            //Laser movement protection
            if (board[i][j].gameObject === LASER ||
                board[i][j].gameObject === SUPER_LASER ||
                board[i][j].gameObject === MEGA_LASER) {
                return
            }
            if (j === 0) {
                shiftBoardDown(gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
                clearInterval(gIntervalAliens)
                gIntervalAliens = setInterval(() => {
                    if (!gGame.isOn) return
                    shiftBoardRight(gBoard, gAliensLeftColIdx, gAliensRightColIdx)
                }, ALIEN_SPEED)
                return
            }
            //New cell position in model
            newBoard[i][j - 1] = board[i][j]
            //Current cell position in model
            newBoard[i][fromJ] = emptyCell
        }
    }

    gAliensLeftColIdx--
    gAliensRightColIdx--
    //MODEL
    gBoard = newBoard
    //DOM
    renderBoard(newBoard)
}
function shiftBoardDown(board, fromI, toI) {
    const newBoard = createCopyBoard(board)
    const emptyCell = createCell()

    for (let i = fromI; i <= toI; i++) {
        for (let j = gAliensLeftColIdx; j < gAliensRightColIdx; j++) {
            //Laser movement protection
            if (board[i][j].gameObject === LASER ||
                board[i][j].gameObject === SUPER_LASER ||
                board[i][j].gameObject === MEGA_LASER) {
                return
            }
            //Touching player row, game lost
            if (gAliensBottomRowIdx === gHero.pos.i - 1) return gameOver()
            //New cell position in model
            newBoard[i + 1][j] = board[i][j]
            //Current cell position in model
            newBoard[gAliensTopRowIdx][j] = emptyCell
        }
    }

    gAliensTopRowIdx++
    gAliensBottomRowIdx++
    //MODEL
    gBoard = newBoard
    //DOM
    renderBoard(newBoard)
}
// Runs the interval for moving aliens side to side and down
// it re-renders the board every time
// when the aliens are reaching the hero row - interval stops
function moveAliens() {
    gIntervalAliens = setInterval(() => {
        shiftBoardRight(gBoard, gAliensLeftColIdx, gAliensRightColIdx)
    }, ALIEN_SPEED)

}
function freezeAliens() {
    gIsAlienFreeze = false
}