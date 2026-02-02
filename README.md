# Royal Rumble Party Assistant 🏆

A React + Tailwind web application that acts as a companion game for the WWE Royal Rumble. Perfect for watch parties!

## Features

- **Player Setup**: Add 1-30 players with random or manual entry number assignment
- **Fair Distribution**: Automatically assigns entry numbers fairly when fewer than 30 players
- **Live Match Tracking**: Track wrestlers and eliminations in real-time
- **Winner Celebration**: Confetti animation when a winner is determined
- **Persistence**: Game state saved to localStorage - refresh-safe!
- **Wrestler Database**: Pre-loaded wrestler list with autocomplete (free-text entry also supported)

## How It Works

The Royal Rumble:
- 30 wrestlers enter one by one at timed intervals
- Each entrant is assigned an entry number (1–30)
- Wrestlers are eliminated over time until only one remains

This app lets you:
1. Assign entry numbers to players in your group
2. Track which wrestler enters at each number
3. Mark eliminations as they happen
4. Automatically determine the winner!

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **canvas-confetti** - Winner celebration
- **GitHub Pages** - Static hosting

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Deployment

This project is configured to deploy automatically to GitHub Pages via GitHub Actions.

### Setup GitHub Pages

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Under "Build and deployment", select:
   - **Source**: GitHub Actions
4. Push to the `main` branch to trigger deployment

The site will be available at: `https://<username>.github.io/Rumble/`

### Update Base Path

If your repository name is different from "Rumble", update the `base` property in `vite.config.js`:

```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

## Contributing Wrestler Data

Want to add more wrestlers? Edit `/public/data/wrestlers.json`:

```json
[
  {
    "id": "wrestler_name",
    "name": "Wrestler Display Name"
  }
]
```

The `id` field should be a lowercase, underscore-separated version of the name.

## Usage Guide

### Setup Phase
1. Add players (1-30)
2. Choose assignment mode:
   - **Random**: Entry numbers distributed automatically and fairly
   - **Manual**: Players pick their own numbers
3. Click "Start Game"

### Live Match Phase
1. As wrestlers enter, click on each entry to add the wrestler's name
2. Use the autocomplete or type freely
3. Click "✕ Eliminate" when a wrestler is eliminated
4. Player standings update in real-time

### Winner Phase
- Automatically triggered when only one entry remains
- Shows confetti celebration
- Displays winner's name, wrestler, and entry number
- Click "Start New Game" to reset

## Persistence

All game data is saved to browser localStorage:
- Players and assignments
- Wrestler names
- Eliminations
- Current game state

Refreshing the page won't lose your progress!

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- localStorage API
- CSS Grid & Flexbox

## License

This project is open source and available under the MIT License.

## Disclaimer

This project is not affiliated with or endorsed by WWE. All trademarks and copyrights belong to their respective owners.

## Support

Issues? Suggestions? Open an issue on GitHub!

---

Made with ❤️ for Royal Rumble fans
