// Tic Tac Toe Game
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [gameMode, setGameMode] = useState(null); // null, 'pvp', 'pvc'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  // Check for winner
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  // Check if board is full
  const isBoardFull = (squares) => {
    return squares.every(square => square !== null);
  };

  // Minimax algorithm for AI
  const minimax = (squares, isMaximizing) => {
    const result = calculateWinner(squares);
    
    if (result && result.winner === 'O') return 10;
    if (result && result.winner === 'X') return -10;
    if (isBoardFull(squares)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const score = minimax(squares, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const score = minimax(squares, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // Get best move for AI
  const getBestMove = (squares) => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        const score = minimax(squares, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  // Computer makes a move
  useEffect(() => {
    if (gameMode === 'pvc' && !isXNext && !calculateWinner(board) && !isBoardFull(board)) {
      const timer = setTimeout(() => {
        const newBoard = [...board];
        const bestMove = getBestMove(newBoard);
        if (bestMove !== null) {
          newBoard[bestMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 500); // Small delay to make it feel more natural

      return () => clearTimeout(timer);
    }
  }, [isXNext, board, gameMode]);

  // Handle square click
  const handlePress = (index) => {
    if (board[index] || calculateWinner(board)) {
      return;
    }

    // In PvC mode, only allow player to make moves when it's X's turn
    if (gameMode === 'pvc' && !isXNext) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  // Check game status
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setTimeout(() => {
        Alert.alert(
          'Game Over!',
          `${result.winner} wins!`,
          [{ text: 'New Game', onPress: resetBoard }]
        );
        setScores(prev => ({
          ...prev,
          [result.winner]: prev[result.winner] + 1
        }));
      }, 100);
    } else if (isBoardFull(board)) {
      setTimeout(() => {
        Alert.alert(
          'Game Over!',
          "It's a draw!",
          [{ text: 'New Game', onPress: resetBoard }]
        );
        setScores(prev => ({
          ...prev,
          draws: prev.draws + 1
        }));
      }, 100);
    }
  }, [board]);

  // Reset board
  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  // Reset game completely
  const resetGame = () => {
    setGameMode(null);
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setScores({ X: 0, O: 0, draws: 0 });
  };

  // Render game mode selection screen
  if (gameMode === null) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.modeSelectionContainer}>
          <Text style={styles.title}>Tic Tac Toe</Text>
          <Text style={styles.subtitle}>Choose Game Mode</Text>
          
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => setGameMode('pvp')}
          >
            <Text style={styles.modeButtonText}>👥 Player vs Player</Text>
            <Text style={styles.modeButtonSubtext}>Play with a friend</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => setGameMode('pvc')}
          >
            <Text style={styles.modeButtonText}>🤖 Player vs Computer</Text>
            <Text style={styles.modeButtonSubtext}>Challenge the AI</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render game board
  const result = calculateWinner(board);
  const winningLine = result ? result.line : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.gameContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Tic Tac Toe</Text>
          <Text style={styles.modeText}>
            {gameMode === 'pvp' ? '👥 Player vs Player' : '🤖 vs Computer'}
          </Text>
        </View>

        <View style={styles.scoreBoard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>X</Text>
            <Text style={styles.scoreValue}>{scores.X}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Draws</Text>
            <Text style={styles.scoreValue}>{scores.draws}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>O</Text>
            <Text style={styles.scoreValue}>{scores.O}</Text>
          </View>
        </View>

        <Text style={styles.turnText}>
          {result 
            ? `Winner: ${result.winner}` 
            : isBoardFull(board)
            ? "It's a Draw!"
            : `Current Turn: ${isXNext ? 'X' : 'O'}`}
        </Text>

        <View style={styles.board}>
          {board.map((square, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.square,
                winningLine.includes(index) && styles.winningSquare
              ]}
              onPress={() => handlePress(index)}
            >
              <Text style={[
                styles.squareText,
                square === 'X' ? styles.xText : styles.oText
              ]}>
                {square}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={resetBoard}>
            <Text style={styles.buttonText}>New Round</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={resetGame}
          >
            <Text style={styles.buttonText}>Change Mode</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  modeSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 40,
  },
  modeText: {
    fontSize: 18,
    color: '#666',
  },
  modeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 320,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  modeButtonSubtext: {
    fontSize: 14,
    color: '#e0f2f1',
    textAlign: 'center',
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  turnText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
    aspectRatio: 1,
    marginBottom: 30,
  },
  square: {
    width: '33%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  winningSquare: {
    backgroundColor: '#c8e6c9',
  },
  squareText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  xText: {
    color: '#2196F3',
  },
  oText: {
    color: '#f44336',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  secondaryButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
