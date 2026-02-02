import React, { useState } from 'react';
import { getPlayerEntries } from '../utils/gameLogic';

const SetupScreen = ({ onStartGame }) => {
  const [players, setPlayers] = useState([{ name: '', numbers: [] }]);
  const [assignmentMode, setAssignmentMode] = useState('random'); // 'random' or 'manual'
  const [error, setError] = useState('');

  const addPlayer = () => {
    if (players.length < 30) {
      setPlayers([...players, { name: '', numbers: [] }]);
    }
  };

  const removePlayer = (index) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const updatePlayerNumbers = (index, numbers) => {
    const newPlayers = [...players];
    newPlayers[index].numbers = numbers;
    setPlayers(newPlayers);
  };

  const parseNumbers = (text) => {
    const numbers = text.split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n >= 1 && n <= 30);
    return [...new Set(numbers)]; // Remove duplicates
  };

  const validateAndStart = () => {
    // Check all players have names
    const emptyNames = players.some(p => !p.name.trim());
    if (emptyNames) {
      setError('All players must have names');
      return;
    }

    // Check for duplicate names
    const names = players.map(p => p.name.trim().toLowerCase());
    if (new Set(names).size !== names.length) {
      setError('Player names must be unique');
      return;
    }

    if (assignmentMode === 'manual') {
      // Validate manual number assignments
      const allNumbers = new Set();

      players.forEach((player) => {
        player.numbers.forEach(num => {
          if (allNumbers.has(num)) {
            setError(`Number ${num} is assigned to multiple players`);
            return;
          }
          allNumbers.add(num);
        });
      });

      if (error) return;

      if (allNumbers.size === 0) {
        setError('At least one player must have entry numbers assigned');
        return;
      }

      // Create assignments from manual entries
      const assignments = {};
      players.forEach((player, playerIndex) => {
        player.numbers.forEach(num => {
          assignments[num] = playerIndex;
        });
      });

      onStartGame(players.map(p => ({ name: p.name.trim() })), assignments);
    } else {
      // Random assignment - will be handled by the parent component
      onStartGame(players.map(p => ({ name: p.name.trim() })), null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-rumble-primary mb-2">
          Royal Rumble Party Assistant
        </h1>
        <p className="text-gray-400 text-lg">Setup your party game</p>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Assignment Mode</h2>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="random"
              checked={assignmentMode === 'random'}
              onChange={(e) => setAssignmentMode(e.target.value)}
              className="w-4 h-4"
            />
            <span>Random Assignment (Automatic)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="manual"
              checked={assignmentMode === 'manual'}
              onChange={(e) => setAssignmentMode(e.target.value)}
              className="w-4 h-4"
            />
            <span>Manual Assignment</span>
          </label>
        </div>
        <p className="text-sm text-gray-400">
          {assignmentMode === 'random'
            ? 'Entry numbers will be randomly and fairly distributed among players'
            : 'Players can choose their own entry numbers'}
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Players ({players.length})</h2>
          <button
            onClick={addPlayer}
            disabled={players.length >= 30}
            className="bg-rumble-primary hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded font-semibold transition"
          >
            + Add Player
          </button>
        </div>

        <div className="space-y-3">
          {players.map((player, index) => (
            <div key={index} className="flex gap-3 items-start bg-gray-700 p-3 rounded">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={`Player ${index + 1} Name`}
                  value={player.name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 rounded border border-gray-600 focus:border-rumble-primary focus:outline-none"
                />
              </div>

              {assignmentMode === 'manual' && (
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Entry numbers (e.g., 1,15,30)"
                    value={player.numbers.join(', ')}
                    onChange={(e) => updatePlayerNumbers(index, parseNumbers(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-900 rounded border border-gray-600 focus:border-rumble-primary focus:outline-none"
                  />
                </div>
              )}

              <button
                onClick={() => removePlayer(index)}
                disabled={players.length === 1}
                className="bg-red-900 hover:bg-red-800 disabled:bg-gray-600 disabled:cursor-not-allowed px-3 py-2 rounded transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={validateAndStart}
          className="bg-rumble-secondary hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-bold text-xl transition transform hover:scale-105"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;
