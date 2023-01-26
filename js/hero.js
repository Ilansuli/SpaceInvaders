const LASER_SPEED = 80
const SUPER_LASER_SPEED = 30

var gHero
var gShootInterval
//Super Shot
var gIsLaserSuper 
var gIsSuperShotLeft
//Mega Shot
var gIsLaserMega 

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
    //MODEL
    board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}
// Move the hero right (1) or left (-1)
function moveHero(ev) {
    //Prevnt movement in specific conditions
    if (!gGame.isOn) return
    const currPos = { i: gHero.pos.i, j: gHero.pos.j }
    const nextPos = getHeroNextPos(ev)
    //Prevent going out of bounds
    if (nextPos.j < 0 || nextPos.j >= gBoard[0].length) return

    // Moving from current position
    //MODEL + DOM
    updateCell(currPos)

    //Moving to next position 
    //MODEL + DOM
    updateCell(nextPos, HERO)
    gHero.pos = nextPos
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
    return nextPos
}
// Handle game keys
function onKeyDown(ev) {
    //When player moves
    if (ev.code === 'ArrowLeft' ||
        ev.code === 'ArrowRight') moveHero(ev)
    //When player shoots
    else if (ev.code === 'Space') {
        gIsLaserMega = false
        gIsLaserSuper = false    
        shoot()
    }
    //When player shoot super shot
    else if (ev.code === 'KeyX') {
        if (!gIsSuperShotLeft) return
        gIsLaserMega = false
        gIsLaserSuper = true
        shoot()
        updateSuperShotLeft()
    }
    else if (ev.code === 'KeyN') {
        gIsLaserSuper = false
        gIsLaserMega = true
        shoot()
    }
}
// Sets an interval for shutting (blinking) the laser up towards aliens
function shoot() {
    //Prevnt shooting in specific conditions
    if (gHero.isShoot || !gGame.isOn) return
    gHero.isShoot = true
    var laserPos = {
        i: gHero.pos.i - 1,
        j: gHero.pos.j
    }
    //Laser shooting
    var currLaserSpeed = (gIsLaserSuper) ? SUPER_LASER_SPEED : LASER_SPEED
    gShootInterval = setInterval(blinkLaser, currLaserSpeed, laserPos)



}
// renders a LASER at specific cell for short time and removes it
function blinkLaser(pos) {
    var nextPos = { i: pos.i - 1, j: pos.j }

    //Laser hit
    if (gBoard[nextPos.i][nextPos.j].gameObject === ALIEN) {
        handleAlienHit(pos, nextPos)
        return
        //Laser reaching the top
    } else if (nextPos.i <= 0) return stopLaser(pos, nextPos)

    //Move from current position
    //MODEL + DOM
    updateCell(pos)
    //Move to next position
    //MODEL + DOM
    //If its Super shot/Mega shot/Regular shot

    var currLaser
    if (gIsLaserMega) currLaser = MEGA_LASER
    else if (gIsLaserSuper) currLaser = SUPER_LASER
    else currLaser = LASER
    updateCell(nextPos, currLaser)

    //updating laser's position
    pos.i--
   
}

//Stoping laser from continuation

function stopLaser(pos, nextPos) {
    clearInterval(gShootInterval)
    gHero.isShoot = false
    //Remove laser
    updateCell(pos)
    //Remove what is in front of the laser('kill him')
    updateCell(nextPos)
}

function updateSuperShotLeft() {
    // Model
    gIsSuperShotLeft--
    // DOM
    document.querySelector('h3 span').innerText = gIsSuperShotLeft
}
