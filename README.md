# Tic Tac Toe - React Native Expo

A feature-rich Tic Tac Toe game built with React Native and Expo, offering two exciting game modes.

## Features

✨ **Two Game Modes:**
- 👥 **Player vs Player** - Play with a friend on the same device
- 🤖 **Player vs Computer** - Challenge an AI opponent using the Minimax algorithm

🎯 **Game Features:**
- Beautiful, intuitive UI
- Real-time score tracking
- Winning line highlighting
- Smart AI opponent (unbeatable when playing optimally)
- Smooth animations and transitions

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator, or `w` for web

## How to Play

1. **Choose Game Mode:**
   - Select "Player vs Player" to play with a friend
   - Select "Player vs Computer" to challenge the AI

2. **Game Rules:**
   - Players take turns placing X and O on a 3x3 grid
   - First player to get 3 in a row (horizontal, vertical, or diagonal) wins
   - If all squares are filled with no winner, it's a draw

3. **In Player vs Computer Mode:**
   - You play as X (blue)
   - Computer plays as O (red)
   - Computer uses the Minimax algorithm for optimal play

4. **Score Tracking:**
   - Scores are tracked for X, O, and draws
   - Use "New Round" to play again with the same mode
   - Use "Change Mode" to return to mode selection

## Technical Details

- **Framework:** React Native with Expo
- **AI Algorithm:** Minimax algorithm for unbeatable computer opponent
- **State Management:** React Hooks (useState, useEffect)
- **Styling:** React Native StyleSheet

## Project Structure

```
├── App.js              # Main application file with game logic
├── app.json            # Expo configuration
├── package.json        # Project dependencies
└── babel.config.js     # Babel configuration
```

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app (for testing on physical devices)

## License

MIT License - Feel free to use this project for learning or personal use.
