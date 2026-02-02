// Distribute 30 entry numbers fairly among players
export const distributeEntries = (numPlayers) => {
  const totalEntries = 30;
  const assignments = {};

  if (numPlayers === 0) return assignments;

  const entriesPerPlayer = Math.floor(totalEntries / numPlayers);
  const extraEntries = totalEntries % numPlayers;

  let currentEntry = 1;

  for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
    const entriesToAssign = playerIndex < extraEntries
      ? entriesPerPlayer + 1
      : entriesPerPlayer;

    for (let i = 0; i < entriesToAssign; i++) {
      assignments[currentEntry] = playerIndex;
      currentEntry++;
    }
  }

  return assignments;
};

// Shuffle array (Fisher-Yates)
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Distribute entries randomly
export const distributeEntriesRandomly = (numPlayers) => {
  const allEntries = Array.from({ length: 30 }, (_, i) => i + 1);
  const shuffled = shuffleArray(allEntries);

  const assignments = {};
  const entriesPerPlayer = Math.floor(30 / numPlayers);
  const extraEntries = 30 % numPlayers;

  let index = 0;

  for (let playerIndex = 0; playerIndex < numPlayers; playerIndex++) {
    const count = playerIndex < extraEntries ? entriesPerPlayer + 1 : entriesPerPlayer;

    for (let i = 0; i < count; i++) {
      assignments[shuffled[index]] = playerIndex;
      index++;
    }
  }

  return assignments;
};

// Get entries for a specific player
export const getPlayerEntries = (assignments, playerIndex) => {
  return Object.entries(assignments)
    .filter(([_, pIndex]) => pIndex === playerIndex)
    .map(([entry, _]) => parseInt(entry))
    .sort((a, b) => a - b);
};

// Check if there's a winner
export const checkForWinner = (eliminations) => {
  const remaining = 30 - eliminations.length;

  if (remaining === 1) {
    for (let i = 1; i <= 30; i++) {
      if (!eliminations.includes(i)) {
        return i;
      }
    }
  }

  return null;
};
