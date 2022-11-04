document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = ['orange', 'red', 'cyan', 'magenta', 'black', 'brown', 'purple']

    //the Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2], 
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2, width*2+1],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [width*2, width+1, width*2+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width+1, width*2+1, width+2],
        [0, width, width+1, width*2+1]
    ]

    const sTetromino = [
        [width, width+1, width*2+1, width*2+2],
        [2, width+1, width+2, width*2+1],
        [width, width+1, width*2+1, width*2+2],
        [2, width+1, width+2, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const lMirTetromino = [
        [1, width+1, width*2+1, 0], 
        [width, width+1, width+2, width*2],
        [1, width+1, width*2+2, width*2+1],
        [width+2, width*2, width*2+1, width*2+2]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const tTetromino = [
        [width, 1, width+1, width*2+1],
        [width+1, width*2, width*2+1, width*2+2],
        [width+2, 1, width+1, width*2+1],
        [width+1, width, width*2+1, width+2]
    ]

    const theTetrominos = [lTetromino, zTetromino, sTetromino, oTetromino, lMirTetromino, iTetromino, tTetromino]

    let currentPosition = 4
    let currentRotation = 0

    //select a Tetromino randomly in its first rotation 
    let random = Math.floor(Math.random()*theTetrominos.length)
    let current = theTetrominos[random][currentRotation]
        
    //func to draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //func to undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    //func to move the Tetromino down every sec without clicking startBtn
    //timerId = setInterval(moveDown, 1000)

    //assign functions to keyCodes
    function control(e)
    {
        if(e.keyCode === 37)
        {
            moveLeft()
        }
        else if (e.keyCode === 38)
        {
            tetrominoRotate()
        }
        else if (e.keyCode === 39)
        {
            moveRight()
        }
        else if (e.keyCode === 40)
        {
            //moveDownFast()
        }
    }

    document.addEventListener('keyup', control)

    //func to move down
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze func
    function freeze()
    {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken')))
        {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
    
            //start a new Tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominos.length)
            current = theTetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }  
    
    //rules for movement left-right
    //move the Tetromino left unless its at the left boundary
    function moveLeft()
    {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition +=1

        draw()            
    }

    //move the Tetromino right unless its at the right boundary
    function moveRight()
    {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if(!isAtRightEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition -=1

        draw()            
    }

    //move the Tetromino down faster until it hits floor
    function moveDownFast()
    {
        undraw()

    }

    //rotate the Tetromino
    function tetrominoRotate()
    {
        undraw()
        currentRotation++
        if(currentRotation === current.length) //if current rotation gets to 4, make it back to 0
        {
            currentRotation = 0
        }

        current = theTetrominos[random][currentRotation]
        draw()
    }
    
    //show up next Tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
    
    //the Tetrominos without rotations
    const upNextTetrominos = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [displayWidth*2, displayWidth+1, displayWidth*2+1, displayWidth+2], //zTetromino
        [displayWidth, displayWidth+1, displayWidth*2+1, displayWidth*2+2], //sTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, 0], //lMirTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1], //iTetromino
        [displayWidth, 1, displayWidth+1, displayWidth*2+1] //tTetromino
    ]

    //display the shape in the mini-grid display
    function displayShape()
    {
        //remove any trace of a Tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominos[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //add functionality to the button
    startBtn.addEventListener('click', () => {
        if (timerId) 
        {
            clearInterval(timerId)
            timerId = null
        } else 
        {
            draw()
            timerId = setInterval(moveDown, 200)
            nextRandom = Math.floor(Math.random()*theTetrominos.length)
            displayShape()
        }
    })

    //add score
    function addScore()
    {
        for (let i = 0; i < 199; i += width)
        {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if (row.every(index => squares[index].classList.contains('taken')))
            {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor=''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //Game Over
    function gameOver()
    {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }
})