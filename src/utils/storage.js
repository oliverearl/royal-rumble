const STORAGE_KEYS = {
  PLAYERS: 'rumble_players',
  ASSIGNMENTS: 'rumble_assignments',
  WRESTLERS: 'rumble_wrestlers',
  ELIMINATIONS: 'rumble_eliminations',
  GAME_STATE: 'rumble_game_state',
};

export const storage = {
  // Players
  savePlayers: (players) => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  },

  loadPlayers: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return data ? JSON.parse(data) : [];
  },

  // Assignments (entry numbers to player mapping)
  saveAssignments: (assignments) => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  },

  loadAssignments: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : {};
  },

  // Wrestlers (entry numbers to wrestler names)
  saveWrestlers: (wrestlers) => {
    localStorage.setItem(STORAGE_KEYS.WRESTLERS, JSON.stringify(wrestlers));
  },

  loadWrestlers: () => {
    const data = localStorage.getItem(STORAGE_KEYS.WRESTLERS);
    return data ? JSON.parse(data) : {};
  },

  // Eliminations (set of eliminated entry numbers)
  saveEliminations: (eliminations) => {
    localStorage.setItem(STORAGE_KEYS.ELIMINATIONS, JSON.stringify(eliminations));
  },

  loadEliminations: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ELIMINATIONS);
    return data ? JSON.parse(data) : [];
  },

  // Game State
  saveGameState: (state) => {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, state);
  },

  loadGameState: () => {
    return localStorage.getItem(STORAGE_KEYS.GAME_STATE) || 'setup';
  },

  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
