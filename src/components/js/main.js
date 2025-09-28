const { useState, useEffect } = React;

function App() {
  const [screen, setScreen] = useState("menu");
  const [difficulty, setDifficulty] = useState("easy"); // easy/medium/hard
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerId, setTimerId] = useState(null);

  // Load anagrams.json
  useEffect(() => {
    fetch("./data/anagrams.json")
      .then(res => res.json())
      .then(data => setWords(data));
  }, []);

  // Timer effect
  useEffect(() => {
    if (screen === "game") {
      if (timeLeft <= 0) {
        clearInterval(timerId);
        setScreen("gameOver");
      }
      const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
      setTimerId(id);
      return () => clearInterval(id);
    }
  }, [screen, timeLeft]);

  const startGame = (level) => {
    setDifficulty(level);
    setScore(0);
    setTimeLeft(30);
    setScreen("game");
    pickWord(level);
  };

  const pickWord = (level) => {
    const maxLen = level === "easy" ? 3 : level === "medium" ? 4 : 5;
    const filtered = words.filter(arr => arr[0].length <= maxLen);
    const set = filtered[Math.floor(Math.random() * filtered.length)];
    const word = set[Math.floor(Math.random() * set.length)];
    setCurrentWord(word);
    setScrambledWord(shuffleWord(word));
  };

  const shuffleWord = (word) => {
    return word.split("").sort(() => Math.random() - 0.5).join("");
  };

  const handleGuess = (e) => {
    e.preventDefault();
    const correctSet = words.find(arr => arr.includes(currentWord));
    if (correctSet.includes(guess.toLowerCase()) && guess.toLowerCase() !== currentWord) {
      setScore(score + 1);
      pickWord(difficulty);
    }
    setGuess("");
  };

  if (screen === "menu") {
    return (
      <div className="container">
        <h1>Play2Learn</h1>
        <div className="card-container">
          <div className="card">
            <img src="./src/assets/images/anagram.png" alt="Anagram Game" />
            <h2>Anagram Hunt</h2>
            <p>Find as many anagrams as you can!</p>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">3 letters or less</option>
              <option value="medium">4 letters or less</option>
              <option value="hard">5 letters or less</option>
            </select>
            <button onClick={() => startGame(difficulty)}>Play!</button>
          </div>
          <div className="card">
            <img src="./src/assets/images/math.png" alt="Math Game" />
            <h2>Math Facts Practice</h2>
            <p>Sharpen your mental math skills!</p>
            <button onClick={() => alert("Math game coming soon!")}>Play!</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "game") {
    return (
      <div className="game">
        <h2>Find Anagrams for: <span style={{color:'#4CAF50'}}>{scrambledWord}</span></h2>
        <p>Score: <strong>{score}</strong> | Time Left: 
          <span className={`timer ${timeLeft <= 5 ? 'warning' : ''}`}> {timeLeft}s</span>
        </p>
        <form onSubmit={handleGuess}>
          <input
            type="text"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="Type an anagram"
            autoFocus
          />
          <button type="submit">Guess</button>
        </form>
      </div>
    );
  }

  if (screen === "gameOver") {
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
