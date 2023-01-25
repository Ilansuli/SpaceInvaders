const LASER_SPEED = 80

var gHero
var gShootInterval

// var gLaserPos

// creates the hero and place it on board
function createHero(board) {
    gHero = {
         pos: {
            i: 12,
            j: 7
        },
        isShoot: false
    }
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}
// Handle game keys
function onKeyDown(ev) {
    console.log(ev.code)
    //when player moves
    if (ev.code === 'ArrowLeft' ||
        ev.code === 'ArrowRight') moveHero(ev)
    //when player shoots
    if (ev.code === 'Space') {
        shoot()
    }
    if(ev.code === 'KeyW') shiftBoardRight(gBoard)
}
// Move the hero right (1) or left (-1)
function moveHero(ev) {
    const currPos = { i: gHero.pos.i, j: gHero.pos.j }
    const nextPos = getHeroNextPos(ev)
    //prevent going out of bounds
    if (nextPos.j < 0 || nextPos.j >= gBoard[0].length) return

    // moving from current position:
    // update the model and dom
    updateCell(currPos)

    //moving to next position 
    //update the model and dom
    updateCell(nextPos, HERO)
    gHero.pos = nextPos
    console.log(gHero.pos);
}
//return next position like { i : 2, j : 7 }
function getHeroNextPos(ev) {
    const nextPos = {
        i: gHero.pos.i,
        j: gHero.pos.j
    }

    switch (ev.code) {
        case 'ArrowRight':
            nextPos.j++
            break;
        case 'ArrowLeft':
            nextPos.j--
            break;
    }
    // console.log(nextPos);
    return nextPos
}
// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    if (gHero.isShoot) return
    gHero.isShoot = true
    var laserPos = {
        i: gHero.pos.i - 1,
        j: gHero.pos.j
    }
    gShootInterval = setInterval(blinkLaser, LASER_SPEED, laserPos)
}
// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    var nextPos = { i: pos.i - 1, j: pos.j }
    //laser hit
    if (gBoard[nextPos.i][nextPos.j].gameObject === ALIEN) {
        handleAlienHit(pos,nextPos)
        return
    } else if (nextPos.i <= 0) return stopLaser(pos, nextPos)

    //move from curr position
    updateCell(pos)
    //move to next position
    updateCell(nextPos, LASER)
    //updating laser's pos
    pos.i--
 }

//Stoping laser
function stopLaser(pos, nextPos) {
    clearInterval(gShootInterval)
    gHero.isShoot = false
    updateCell(pos)
    updateCell(nextPos)
}
