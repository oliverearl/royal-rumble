import React, { useState, useEffect } from 'react';
import { getPlayerEntries } from '../utils/gameLogic';
import { generateWrestlerId } from '../utils/stringUtils';

const LiveMatchScreen = ({ players, assignments, wrestlers, eliminations, onUpdateWrestler, onToggleElimination, onCheckWinner, onReset }) => {
  const [wrestlerList, setWrestlerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);

  const handleResetClick = () => {
    if (window.confirm('Are you sure you want to reset the game? All current progress will be lost.')) {
      onReset();
    }
  };

  useEffect(() => {
    // Load wrestler list - use Vite's base URL
    fetch(`${import.meta.env.BASE_URL}data/wrestlers.json`)
      .then(res => res.json())
      .then(data => setWrestlerList(data))
      .catch(err => console.error('Failed to load wrestlers:', err));
  }, []);

  useEffect(() => {
    // Check for winner whenever eliminations change
    onCheckWinner();
  }, [eliminations, onCheckWinner]);

  const getPlayerForEntry = (entryNum) => {
    const playerIndex = assignments[entryNum];
    return playerIndex !== undefined ? players[playerIndex] : null;
  };

  const getRemainingCount = () => {
    return 30 - eliminations.length;
  };

  const getUsedWrestlers = () => {
    // Get all wrestler names currently assigned (excluding the one being edited)
    return Object.entries(wrestlers)
      .filter(([entry, name]) => parseInt(entry) !== editingEntry && name)
      .map(([_, name]) => name.toLowerCase().trim());
  };

  const getFilteredWrestlers = (search) => {
    if (!search) return wrestlerList;
    const lower = search.toLowerCase();
    const usedWrestlers = getUsedWrestlers();

    return wrestlerList.filter(name =>
      name.toLowerCase().includes(lower) &&
      !usedWrestlers.includes(name.toLowerCase())
    );
  };

  const isWrestlerAlreadyUsed = (wrestlerName) => {
    const usedWrestlers = getUsedWrestlers();
    return usedWrestlers.includes(wrestlerName.toLowerCase().trim());
  };

  const handleWrestlerSelect = (entryNum, wrestlerName) => {
    const trimmedName = wrestlerName.trim();

    if (!trimmedName) {
      setEditingEntry(null);
      setSearchTerm('');
      return;
    }

    // Check if wrestler is already used
    if (isWrestlerAlreadyUsed(trimmedName)) {
      alert(`"${trimmedName}" has already been assigned to another entry!`);
      setSearchTerm('');
      return;
    }

    onUpdateWrestler(entryNum, trimmedName);
    setEditingEntry(null);
    setSearchTerm('');
  };

  const entries = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-rumble-primary mb-2">
          Royal Rumble - LIVE
        </h1>
        <div className="text-2xl font-bold text-rumble-secondary">
          {getRemainingCount()} Remaining
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left">Entry #</th>
                <th className="px-4 py-3 text-left">Wrestler</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entryNum) => {
                const player = getPlayerForEntry(entryNum);
                const wrestler = wrestlers[entryNum] || '';
                const isEliminated = eliminations.includes(entryNum);
                const isAssigned = assignments[entryNum] !== undefined;

                return (
                  <tr
                    key={entryNum}
                    className={`border-t border-gray-700 ${
                      isEliminated ? 'bg-gray-900/50 opacity-50' : 'bg-gray-800'
                    } ${!isAssigned ? 'opacity-40' : ''}`}
                  >
                    <td className="px-4 py-3 font-bold text-rumble-secondary">
                      #{entryNum}
                    </td>
                    <td className="px-4 py-3">
                      {editingEntry === entryNum ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onBlur={() => {
                              if (searchTerm.trim()) {
                                handleWrestlerSelect(entryNum, searchTerm.trim());
                              } else {
                                setEditingEntry(null);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && searchTerm.trim()) {
                                handleWrestlerSelect(entryNum, searchTerm.trim());
                              }
                            }}
                            placeholder="Enter wrestler name..."
                            className="w-full px-2 py-1 bg-gray-900 rounded border border-rumble-primary focus:outline-none"
                            autoFocus
                          />
                          {searchTerm && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded max-h-48 overflow-y-auto">
                              {getFilteredWrestlers(searchTerm).length > 0 ? (
                                getFilteredWrestlers(searchTerm).map((name) => (
                                  <div
                                    key={generateWrestlerId(name)}
                                    onMouseDown={() => handleWrestlerSelect(entryNum, name)}
                                    className="px-3 py-2 hover:bg-rumble-primary cursor-pointer"
                                  >
                                    {name}
                                  </div>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-gray-500 italic">
                                  {wrestlerList.some(w => w.toLowerCase().includes(searchTerm.toLowerCase()))
                                    ? 'All matching wrestlers already assigned'
                                    : 'No matches found - press Enter to add'}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          onClick={() => !isEliminated && setEditingEntry(entryNum)}
                          className={`cursor-pointer hover:text-rumble-secondary ${
                            !wrestler ? 'text-gray-500 italic' : ''
                          }`}
                        >
                          {wrestler || 'Click to enter wrestler'}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {player ? (
                        <span className="font-semibold">{player.name}</span>
                      ) : (
                        <span className="text-gray-500 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEliminated ? (
                        <span className="text-red-500 font-semibold">ELIMINATED</span>
                      ) : (
                        <span className="text-green-500 font-semibold">ACTIVE</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isAssigned && wrestler && (
                        <button
                          onClick={() => onToggleElimination(entryNum)}
                          className={`px-3 py-1 rounded font-semibold transition ${
                            isEliminated
                              ? 'bg-green-700 hover:bg-green-600 text-white'
                              : 'bg-red-700 hover:bg-red-600 text-white'
                          }`}
                        >
                          {isEliminated ? '↺ Restore' : '✕ Eliminate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2 text-rumble-secondary">Player Standings</h3>
          <div className="space-y-2">
            {players.map((player, index) => {
              const playerEntries = getPlayerEntries(assignments, index);
              const activeCount = playerEntries.filter(e => !eliminations.includes(e)).length;

              return (
                <div key={index} className="flex justify-between items-center">
                  <span>{player.name}</span>
                  <span className="font-bold text-rumble-secondary">
                    {activeCount} / {playerEntries.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleResetClick}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          title="Reset game and return to setup"
        >
          ↺ Reset Game
        </button>
      </div>
    </div>
  );
};

export default LiveMatchScreen;
