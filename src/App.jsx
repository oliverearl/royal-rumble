import React, { useState, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import LiveMatchScreen from './components/LiveMatchScreen';
import WinnerScreen from './components/WinnerScreen';
import Footer from './components/Footer';
import { storage } from './utils/storage';
import { distributeEntriesRandomly, checkForWinner } from './utils/gameLogic';

function App() {
  const [gameState, setGameState] = useState('setup'); // 'setup', 'live', 'winner'
  const [players, setPlayers] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [wrestlers, setWrestlers] = useState({});
  const [eliminations, setEliminations] = useState([]);
  const [winnerEntry, setWinnerEntry] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = storage.loadGameState();
    const savedPlayers = storage.loadPlayers();
    const savedAssignments = storage.loadAssignments();
    const savedWrestlers = storage.loadWrestlers();
    const savedEliminations = storage.loadEliminations();

    if (savedState && savedPlayers.length > 0) {
      setGameState(savedState);
      setPlayers(savedPlayers);
      setAssignments(savedAssignments);
      setWrestlers(savedWrestlers);
      setEliminations(savedEliminations);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (players.length > 0) {
      storage.saveGameState(gameState);
      storage.savePlayers(players);
      storage.saveAssignments(assignments);
      storage.saveWrestlers(wrestlers);
      storage.saveEliminations(eliminations);
    }
  }, [gameState, players, assignments, wrestlers, eliminations]);

  const handleStartGame = (newPlayers, manualAssignments) => {
    setPlayers(newPlayers);

    // If manual assignments provided, use them; otherwise distribute randomly
    const newAssignments = manualAssignments || distributeEntriesRandomly(newPlayers.length);
    setAssignments(newAssignments);

    setWrestlers({});
    setEliminations([]);
    setWinnerEntry(null);
    setGameState('live');
  };

  const handleUpdateWrestler = (entryNum, wrestlerName) => {
    setWrestlers(prev => ({
      ...prev,
      [entryNum]: wrestlerName
    }));
  };

  const handleToggleElimination = (entryNum) => {
    setEliminations(prev => {
      if (prev.includes(entryNum)) {
        return prev.filter(e => e !== entryNum);
      } else {
        return [...prev, entryNum];
      }
    });
  };

  const handleCheckWinner = () => {
    const winner = checkForWinner(eliminations);
    if (winner !== null) {
      setWinnerEntry(winner);
      setGameState('winner');
    }
  };

  const handleReset = () => {
    storage.clearAll();
    setGameState('setup');
    setPlayers([]);
    setAssignments({});
    setWrestlers({});
    setEliminations([]);
    setWinnerEntry(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {gameState === 'setup' && (
        <SetupScreen onStartGame={handleStartGame} />
      )}

      {gameState === 'live' && (
        <LiveMatchScreen
          players={players}
          assignments={assignments}
          wrestlers={wrestlers}
          eliminations={eliminations}
          onUpdateWrestler={handleUpdateWrestler}
          onToggleElimination={handleToggleElimination}
          onCheckWinner={handleCheckWinner}
        />
      )}

      {gameState === 'winner' && (
        <WinnerScreen
          winnerEntry={winnerEntry}
          players={players}
          assignments={assignments}
          wrestlers={wrestlers}
          onReset={handleReset}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
