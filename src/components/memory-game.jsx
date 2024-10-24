import React, { useEffect, useState } from 'react'

const MemoryGame = () => {
    const [gridSize, setGridSize] = useState(4)
    const [cards, setCards] = useState([])

    const [flipped, setFlipped] = useState([])
    const [solved, setSolved] = useState([])
    const [disabled, setDisabled] = useState(false)

    const [won, setWon] = useState(false)

    const [maxMoves, setMaxMoves] = useState(0)
    const [moves, setMoves] = useState(0)
    const [gameOver, setGameOver] = useState(false)

    const handleGridSize = (e) => {
        const size = parseInt(e.target.value)
        if (size >= 2 && size <= 10) setGridSize(size)
    }

    const initializeGame = () => {
        const totalCards = gridSize * gridSize;
        const pairCount = Math.floor(totalCards / 2)
        const numbers = [...Array(pairCount).keys().map((n) => n + 1)]
        const shuffledCards = [...numbers, ...numbers].sort(() => Math.random() - 0.5).slice(0, totalCards).map((number, index) => ({
            id: index,
            number
        }))
        setCards(shuffledCards)
        setFlipped([])
        setWon(false)
        setSolved([])
        setMoves(0)
        setGameOver(false)


    }

    useEffect(() => {
        initializeGame()
    }, [gridSize, maxMoves])

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWon(true)
            setGameOver(true)
        } else if (maxMoves > 0 && moves >= maxMoves) {
            setGameOver(true)
        }
    }, [solved, cards,moves,maxMoves])

    const checkMatch = (secondId) => {
        const [firstId] = flipped;
        if (cards[firstId].number === cards[secondId].number) {
            setSolved([...solved, firstId, secondId])
            setFlipped([])
            setDisabled(false)
        } else {
            setTimeout(() => {
                setFlipped([])
                setDisabled(false)
            }, 1000)
        }
    }

    const handleClick = (id) => {
        if (disabled || gameOver) return;

        if (flipped.length === 0) {
            setFlipped([id])
            setMoves(moves + 1)
            return;
        }

        if (flipped.length === 1) {
            setDisabled(true)
            if (id !== flipped[0]) {
                setFlipped([...flipped, id])
                checkMatch(id)
                setMoves(moves + 1)
            } else {
                setFlipped([])
                setDisabled(false)
            }
        }
    }

    const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
    const isSolved = (id) => solved.includes(id);

    const handleMaxMovesChange = (e) => {
        const moves = parseInt(e.target.value)
        if (moves >= 0) setMaxMoves(moves)
    }
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-grey-100 p-4'>
            <h1 className='text-3xl font-bold mb-6'>Memory Game</h1>
            {/* Input */}
            <div className='mb-4 flex space-x-4'>
                <div>
                    <label htmlFor="grid-size" className='mr-2'>Grid Size: (max 10)</label>
                    <input
                        type="number"
                        id="grid-size"
                        min="2"
                        max="10"
                        value={gridSize}
                        onChange={handleGridSize}
                        className='border-2 border-gray-300 rounded px-2 py-2 w-16' />
                </div>
                <div>
                    <label htmlFor="max-moves" className='mr-2'>Max Moves: (0 for unlimited)</label>
                    <input
                        type="number"
                        id="max-moves"
                        min="0"
                        value={maxMoves}
                        onChange={handleMaxMovesChange}
                        className='border-2 border-gray-300 rounded px-2 py-2 w-16' />
                </div>
            </div>

            <div className='mb-4 text-xl'>
                Moves: {moves} {moves > 0 ? `/ ${maxMoves}` : ""}
            </div>

            {/* Game Board */}
            <div className={`grid gap-2 mb-4`}
                style={{
                    gridTemplateColumns: `repeat(${gridSize},minmax(0,1fr))`,
                    width: `min(100%,${gridSize * 5.5}rem)`
                }}
            >
                {
                    cards.map((card) => (
                        <div key={card.id}
                            onClick={() => handleClick(card.id)}
                            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${isFlipped(card.id) ? isSolved(card.id) ? 'bg-green-500 text-white' : 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-400'} ${gameOver ? 'pointer-events-none' : ''}`}
                        >
                            {isFlipped(card.id) ? card.number : "?"}
                        </div>
                    ))
                }
            </div>

            {/* Result */}
            {gameOver && <div className={`mt-4 text-4xl font-bold ${won ? 'text-green-600' : 'text-red-600'} animate-bounce`}>
                {won ? 'You Won!' : 'Game Over'}
            </div>}

            {/* Reset / Play Again Btn */}
            <button className='mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
                onClick={initializeGame}
            >{won ? "Play Again" : "Reset Game"}</button>
        </div>
    )
}

export default MemoryGame