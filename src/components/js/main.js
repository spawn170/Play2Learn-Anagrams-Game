const { useState, useEffect } = React;

// Example anagrams
const anagramSets = [
  ["stop","pots","tops","spot","post","opts"],
  ["bared","beard","bread","debar"],
  ["rat","tar","art"],
  ["listen","silent","enlist","tinsel"]
];

function App() {
  // --- General State ---
  const [screen, setScreen] = useState("menu");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // --- Anagram State ---
  const [wordLength, setWordLength] = useState(5);
  const [word, setWord] = useState("");
  const [anagrams, setAnagrams] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [guessInput, setGuessInput] = useState("");

  // --- Math Game State ---
  const [mathQuestion, setMathQuestion] = useState({text:"", answer:0});
  const [answer, setAnswer] = useState("");

  // --- Timer ---
  useEffect(() => {
    if (screen === "anagramPlay" || screen === "mathPlay") {
      if (timeLeft <= 0) {
        setScreen(screen === "anagramPlay" ? "anagramGameOver" : "mathGameOver");
        return;
      }
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [screen, timeLeft]);

  // --- Anagram Handlers ---
  const startAnagramGame = () => {
    setScreen("anagramPlay");
    setScore(0);
    setTimeLeft(60);
    setGuesses([]);

    const choices = anagramSets.filter(arr => arr[0].length === Number(wordLength));
    const set = choices[Math.floor(Math.random() * choices.length)];
    const randomWord = set[Math.floor(Math.random() * set.length)];

    setWord(randomWord);
    setAnagrams(set.filter(w => w !== randomWord));
  };

  const handleAnagramGuess = (e) => {
    e.preventDefault();
    if (anagrams.includes(guessInput) && !guesses.includes(guessInput)) {
      setGuesses([...guesses, guessInput]);
      setScore(score + 1);
    }
    setGuessInput("");
  };

  // --- Math Game Handlers ---
  const startMathGame = () => {
    setScreen("mathPlay");
    setScore(0);
    setTimeLeft(30);
    generateMathQuestion();
  };

  const generateMathQuestion = () => {
    const a = Math.floor(Math.random()*10)+1;
    const b = Math.floor(Math.random()*10)+1;
    setMathQuestion({text:`${a} + ${b} = ?`, answer:a+b});
    setAnswer("");
  };

  const handleMathAnswer = (e) => {
    e.preventDefault();
    if (parseInt(answer) === mathQuestion.answer) {
      setScore(score + 1);
      generateMathQuestion();
    }
  };

  // --- Render ---
  if (screen === "menu") {
    return (
      <div className="container">
        <h1>Play2Learn</h1>
        <div className="card-container">
          <div className="card">
            <h2>Anagram Hunt</h2>
            <p>Find as many anagrams as you can in 60 seconds!</p>
            <select value={wordLength} onChange={e => setWordLength(e.target.value)}>
              <option value="3">3 letters</option>
              <option value="4">4 letters</option>
              <option value="5">5 letters</option>
            </select>
            <button onClick={startAnagramGame}>Play!</button>
          </div>
          <div className="card">
            <h2>Math Facts Practice</h2>
            <p>Answer as many math questions as you can in 30 seconds!</p>
            <button onClick={startMathGame}>Play!</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "anagramPlay") {
    return (
      <div className="game">
        <h2>Find Anagrams for: <span style={{color:'#4CAF50'}}>{word}</span></h2>
        <p>Score: <strong>{score}</strong> | Time Left: <strong>{timeLeft}s</strong></p>
        <form onSubmit={handleAnagramGuess}>
          <input
            type="text"
            value={guessInput}
            onChange={e => setGuessInput(e.target.value)}
            placeholder="Type an anagram"
          />
          <button type="submit">Guess</button>
        </form>
        {guesses.length > 0 && (
          <div style={{marginTop:'1rem'}}>
            <h3>Correct Answers:</h3>
            <ul>{guesses.map((g,i) => <li key={i}>{g}</li>)}</ul>
          </div>
        )}
      </div>
    );
  }

  if (screen === "mathPlay") {
    return (
      <div className="game math-game">
        <h2>Math Facts Practice</h2>
        <p>Score: <strong>{score}</strong> | Time Left: 
          <span className={`timer ${timeLeft <= 5 ? 'warning' : ''}`}> {timeLeft}s</span>
        </p>
        <div className="math-question">{mathQuestion.text}</div>
        <form onSubmit={handleMathAnswer}>
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  if (screen === "anagramGameOver") {
    return (
      <div className="game-over">
        <h1>Game Over!</h1>
        <p>Final Score: {score}</p>
        <button onClick={() => setScreen("menu")}>Back to Menu</button>
      </div>
    );
  }

  if (screen === "mathGameOver") {
    return (
      <div className="game-over">
        <h1>Time's Up!</h1>
        <p>Final Score: {score}</p>
        <button onClick={() => setScreen("menu")}>Back to Menu</button>
      </div>
    );
  }

  return null;
}

// Mount React
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
