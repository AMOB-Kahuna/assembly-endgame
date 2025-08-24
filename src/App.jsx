import { useState, useEffect } from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"

export default function AssemblyEndgame() {
    // State values
    const [difficulty, setDifficulty] = useState("easy")
    const [currentWord, setCurrentWord] = useState(() => getRandomWord(difficulty))
    const [guessedLetters, setGuessedLetters] = useState([])
    const [showSettings, setShowSettings] = useState(false)

    useEffect( () => {
        setCurrentWord(getRandomWord(difficulty))
        setGuessedLetters([])
    }, [difficulty])

    // Derived values
    const numGuessesLeft = languages.length - 1
    const wrongGuessCount =
        guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const isGameWon =
        currentWord ? currentWord.split("").every(letter => guessedLetters.includes(letter)) : null
    const isGameLost = wrongGuessCount >= numGuessesLeft
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    // Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }

    function startNewGame() {
        setCurrentWord(getRandomWord(difficulty))
        setGuessedLetters([])
    }

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span
                className={className}
                style={styles}
                key={lang.name}
            >
                {lang.name}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={letterClassName}>
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })

        return (
            <button
                className={className}
                key={letter}
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
                onClick={() => addGuessedLetter(letter)}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="farewell-message">
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
                </p>
            )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        }
        if (isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }

        return null
    }

    return (
        <>
            <main className={clsx(showSettings && "blur")}>
                {
                    isGameWon && 
                        <Confetti
                            recycle={false}
                            numberOfPieces={1000}
                        />
                }
                <header>
                    <h1>Assembly: Endgame</h1>
                    <p>Guess the word within 8 attempts to keep the
                    programming world safe from Assembly!</p>
                </header>

                <section
                    aria-live="polite"
                    role="status"
                    className={gameStatusClass}
                >
                    {renderGameStatus()}
                </section>

                <section className="language-chips">
                    {languageElements}
                </section>

                <section className="word">
                    {letterElements}
                </section>

                {/* Combined visually-hidden aria-live region for status updates */}
                <section
                    className="sr-only"
                    aria-live="polite"
                    role="status"
                >
                    <p>
                        {currentWord.includes(lastGuessedLetter) ?
                            `Correct! The letter ${lastGuessedLetter} is in the word.` :
                            `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                        }
                        You have {numGuessesLeft} attempts left.
                    </p>
                    <p>Current word: {currentWord.split("").map(letter =>
                        guessedLetters.includes(letter) ? letter + "." : "blank.")
                        .join(" ")}</p>

                </section>

                <section className="keyboard">
                    {keyboardElements}
                </section>

                {isGameOver &&
                    <button
                        className="new-game"
                        onClick={startNewGame}
                    >New Game</button>}
                
            </main>
            
            <aside className={clsx("settings", showSettings && "show-settings")}>
                <button 
                    className="settings-btn"
                    onClick={() => setShowSettings(prevState => !prevState)}
                >{!showSettings ? 
                    <i className="fa fa-gear" aria-hidden="true"></i> :
                    <i class="fa fa-times-circle" aria-hidden="true"></i>
                }</button>

                <div>
                    <fieldset>
                        <legend>Settings</legend>
                        <div>
                            <label htmlFor="difficulty">Difficulty: </label>
                            <select 
                                name="difficulty"
                                id="difficulty"
                                value={difficulty}
                                className={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option value="easy" className="easy">Easy</option>
                                <option value="medium" className="medium">Medium</option>
                                <option value="hard" className="hard">Hard</option>
                            </select>
                        </div>
                    </fieldset>
                </div>
            </aside>
        </>
    )
}
