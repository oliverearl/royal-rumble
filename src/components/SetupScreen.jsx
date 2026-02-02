import React, { useState } from 'react';

const SetupScreen = ({ onStartGame }) => {
  const [players, setPlayers] = useState([{ name: '', numbers: [] }]);
  const [assignmentMode, setAssignmentMode] = useState('random'); // 'random' or 'manual'
  const [error, setError] = useState('');
  const [manualInputs, setManualInputs] = useState({}); // Store raw text for manual inputs
  const [inputErrors, setInputErrors] = useState({}); // Store validation errors for manual inputs

  const addPlayer = () => {
    if (players.length < 30) {
      setPlayers([...players, { name: '', numbers: [] }]);
    }
  };

  const removePlayer = (index) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
      // Clean up manual input for removed player
      const newManualInputs = { ...manualInputs };
      delete newManualInputs[index];
      // Reindex remaining inputs
      const reindexed = {};
      Object.keys(newManualInputs).forEach(key => {
        const idx = parseInt(key);
        if (idx > index) {
          reindexed[idx - 1] = newManualInputs[key];
        } else {
          reindexed[idx] = newManualInputs[key];
        }
      });
      setManualInputs(reindexed);
    }
  };

  const updatePlayerName = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const validateManualInput = (text) => {
    if (!text.trim()) {
      return { valid: true, numbers: [] };
    }

    // Check for non-numerical characters (allow commas, spaces, and numbers only)
    if (!/^[\d,\s]+$/.test(text)) {
      return { valid: false, error: 'Only numbers and commas allowed', numbers: [] };
    }

    // Parse and validate numbers
    const parts = text.split(',');
    const numbers = [];

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed === '') continue;

      const num = parseFloat(trimmed);

      // Check for decimals
      if (trimmed.includes('.')) {
        return { valid: false, error: 'Decimals not allowed', numbers: [] };
      }

      // Check if it's a valid integer
      if (!Number.isInteger(num)) {
        return { valid: false, error: 'Invalid number format', numbers: [] };
      }

      // Check range
      if (num < 1 || num > 30) {
        return { valid: false, error: 'Numbers must be between 1-30', numbers: [] };
      }

      numbers.push(num);
    }

    // Check for duplicates within this input
    const uniqueNumbers = [...new Set(numbers)];
    if (uniqueNumbers.length !== numbers.length) {
      return { valid: false, error: 'Duplicate numbers in entry', numbers: [] };
    }

    return { valid: true, numbers: uniqueNumbers };
  };

  const updateManualInput = (index, text) => {
    // Store the raw text
    setManualInputs({
      ...manualInputs,
      [index]: text
    });

    // Validate input in real-time
    if (text.trim()) {
      const validation = validateManualInput(text);
      setInputErrors({
        ...inputErrors,
        [index]: validation.error
      });
    } else {
      // Clear error if input is empty
      const newErrors = { ...inputErrors };
      delete newErrors[index];
      setInputErrors(newErrors);
    }
  };

  const parseNumbers = (text) => {
    if (!text) return [];
    const validation = validateManualInput(text);
    return validation.valid ? validation.numbers : [];
  };

  const parseAllManualInputs = () => {
    // Parse all manual inputs when starting the game
    const newPlayers = players.map((player, index) => ({
      ...player,
      numbers: parseNumbers(manualInputs[index] || '')
    }));
    setPlayers(newPlayers);
    return newPlayers;
  };

  const validateAndStart = () => {
    // Check minimum players
    if (players.length < 2) {
      setError('At least 2 players are required to start the game');
      return;
    }

    // Parse manual inputs first if in manual mode
    let playersToValidate = players;
    if (assignmentMode === 'manual') {
      playersToValidate = parseAllManualInputs();
    }

    // Check all players have names
    const emptyNames = playersToValidate.some(p => !p.name.trim());
    if (emptyNames) {
      setError('All players must have names');
      return;
    }

    // Check for duplicate names
    const names = playersToValidate.map(p => p.name.trim().toLowerCase());
    if (new Set(names).size !== names.length) {
      setError('Player names must be unique');
      return;
    }

    if (assignmentMode === 'manual') {
      // Check for input validation errors
      const hasInputErrors = Object.values(inputErrors).some(err => err);
      if (hasInputErrors) {
        setError('Please fix validation errors in entry numbers');
        return;
      }

      // Validate manual number assignments - check for duplicates across players
      const allNumbers = new Set();
      const duplicates = [];

      playersToValidate.forEach((player) => {
        player.numbers.forEach(num => {
          if (allNumbers.has(num)) {
            duplicates.push(num);
          }
          allNumbers.add(num);
        });
      });

      if (duplicates.length > 0) {
        setError(`Entry number(s) ${duplicates.join(', ')} assigned to multiple players`);
        return;
      }

      if (allNumbers.size === 0) {
        setError('At least one player must have entry numbers assigned');
        return;
      }

      // Create assignments from manual entries
      const assignments = {};
      playersToValidate.forEach((player, playerIndex) => {
        player.numbers.forEach(num => {
          assignments[num] = playerIndex;
        });
      });

      onStartGame(playersToValidate.map(p => ({ name: p.name.trim() })), assignments);
    } else {
      // Random assignment - will be handled by the parent component
      onStartGame(playersToValidate.map(p => ({ name: p.name.trim() })), null);
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

        {players.length < 2 && (
          <div className="mb-4 bg-yellow-900/30 border border-yellow-600 text-yellow-200 px-4 py-2 rounded text-sm">
            ⚠️ At least 2 players required to start the game
          </div>
        )}

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
                    value={manualInputs[index] || ''}
                    onChange={(e) => updateManualInput(index, e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-900 rounded border focus:outline-none ${
                      inputErrors[index]
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-gray-600 focus:border-rumble-primary'
                    }`}
                  />
                  {inputErrors[index] && (
                    <p className="text-red-400 text-xs mt-1">{inputErrors[index]}</p>
                  )}
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
