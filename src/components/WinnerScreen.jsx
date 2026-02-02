import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const WinnerScreen = ({ winnerEntry, players, assignments, wrestlers, onReset }) => {
  const playerIndex = assignments[winnerEntry];
  const player = players[playerIndex];
  const wrestler = wrestlers[winnerEntry] || 'Unknown Wrestler';

  useEffect(() => {
    // Fire confetti
    const duration = 5000;
    const end = Date.now() + duration;

    const colors = ['#C8102E', '#FFD700', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Big burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-gradient-to-br from-rumble-primary to-red-900 rounded-lg p-12 shadow-2xl">
          <div className="mb-6">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-5xl font-bold text-rumble-secondary mb-2">
              WINNER!
            </h1>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-8 mb-8">
            <div className="text-3xl font-bold text-white mb-4">
              {player.name}
            </div>
            <div className="text-2xl text-gray-300 mb-2">
              {wrestler}
            </div>
            <div className="text-xl text-rumble-secondary font-bold">
              Entry #{winnerEntry}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-lg text-gray-200">
              Congratulations on winning the Royal Rumble Party Game!
            </p>

            <button
              onClick={onReset}
              className="bg-rumble-secondary hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-bold text-xl transition transform hover:scale-105"
            >
              Start New Game
            </button>
          </div>
        </div>

        <div className="mt-8 text-gray-400">
          <p>🎉 Thanks for playing! 🎉</p>
        </div>
      </div>
    </div>
  );
};

export default WinnerScreen;
