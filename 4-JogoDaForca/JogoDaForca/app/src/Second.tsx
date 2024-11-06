import './App.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameWord from './Components/game-word';
import { Link } from 'react-router-dom';
import { HangmanDrawing } from './hangmandrawing';
import Alura from '../src/assets/alura.png';
import './Second.css';
import { useWords } from './WordsContext';

type GameHistory = {
  word: string;
  date: string;
  result: string;
};

const Second: React.FC = () => {
  const { words } = useWords();

  function pickRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }

  const [wordToGuess, setWordToGuess] = useState(pickRandomWord().toUpperCase());
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>(() => {
    const savedHistory = localStorage.getItem('gameHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [winCount, setWinCount] = useState<number>(() => {
    const savedWinCount = localStorage.getItem('winCount');
    return savedWinCount ? JSON.parse(savedWinCount) : 0;
  });

  const [loseCount, setLoseCount] = useState<number>(() => {
    const savedLoseCount = localStorage.getItem('loseCount');
    return savedLoseCount ? JSON.parse(savedLoseCount) : 0;
  });

  useEffect(() => {
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
  }, [gameHistory]);

  useEffect(() => {
    localStorage.setItem('winCount', JSON.stringify(winCount));
  }, [winCount]);

  useEffect(() => {
    localStorage.setItem('loseCount', JSON.stringify(loseCount));
  }, [loseCount]);

  const incorrectLetters = guessedLetters.filter(
    letter => !wordToGuess.toUpperCase().includes(letter)
  );

  const isLoser = incorrectLetters.length >= 10;
  const isWinner = wordToGuess
    .split("")
    .every(letter => guessedLetters.includes(letter.toUpperCase()));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (!gameOver && !guessedLetters.includes(letter)) {
        setGuessedLetters(currentLetters => [...currentLetters, letter.toUpperCase()]);
      }
    },
    [guessedLetters, gameOver]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (!gameOver && key.match(/^[A-Z]$/) && !guessedLetters.includes(key)) {
        addGuessedLetter(key);
      }
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters, addGuessedLetter, gameOver]);

  useEffect(() => {
    if (isWinner || isLoser) {
      setGameOver(true);

      const newHistory: GameHistory = {
        word: wordToGuess,
        date: new Date().toLocaleString(),
        result: isWinner ? 'Ganhou' : 'Perdeu'
      };
      setGameHistory(prevHistory => [...prevHistory, newHistory]);

      if (isWinner) {
        setWinCount(prevWinCount => prevWinCount + 1);
      } else if (isLoser) {
        setLoseCount(prevLoseCount => prevLoseCount + 1);
      }
    }
  }, [isWinner, isLoser, wordToGuess]);

  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const clearGameHistory = () => {
    localStorage.removeItem('gameHistory');
    setGameHistory([]);
  };

  const resetScores = () => {
    localStorage.removeItem('winCount');
    localStorage.removeItem('loseCount');
    setWinCount(0);
    setLoseCount(0);
  };

  return (
    <div className='pagetwo'>
      <header className='header'>
        <img className='logo' src={Alura} />
      </header>
      <main>
        <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
        <GameWord reveal={isLoser} wordToGuess={wordToGuess} guessedLetters={guessedLetters} />

        <div className='erradas'>
          <div id='erradas-span' style={{ display: 'flex', marginTop: '25px', width: '100%', gap: '40px', marginBottom: '25px' }}>
            {incorrectLetters.map((letter, index) => (
              <span key={index} style={{ color: '#495057', fontSize: '20px', flexWrap: 'wrap', opacity: '0.7' }}>
                {letter}
              </span>
            ))}
          </div>
        </div>

        {isLoser && <div className='result'>Você perdeu!</div>}
        {isWinner && <div className='result'>Você ganhou!</div>}

        <input
          ref={inputRef}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
          }}
          type="text"
        />

        <div className='button-segunda-container'>
          <button className='button-segunda' onClick={() => {
            setWordToGuess(pickRandomWord().toUpperCase());
            setGuessedLetters([]);
            setGameOver(false);
          }}>Novo Jogo
          </button>
          <Link to='/'>
            <button className='button-segunda' id='btnseg' onClick={() => {
              setGameOver(true);
              setWordToGuess(pickRandomWord().toUpperCase());
            }}>Desistir</button>
          </Link>
        </div>

        {/* Histórico de Partidas */}
        <div className='historico-wrap'>
          <h3>Histórico de Partidas:</h3>
          <ul>
            {gameHistory.map((game, index) => (
              <li key={index}>
                {game.date} - {game.word} - {game.result}
              </li>
            ))}
          </ul>
          <button className='btn-hist' onClick={clearGameHistory}>Limpar Histórico</button>
        </div>

        {/* Placar */}
        <div className='scoreboard'>
          <h3>Placar:</h3>
          <p>Vitórias: {winCount}</p>
          <p>Derrotas: {loseCount}</p>
          <button className='btn-reset' onClick={resetScores}>Resetar Placar</button>
        </div>
      </main>
    </div>
  );
}

export default Second;
