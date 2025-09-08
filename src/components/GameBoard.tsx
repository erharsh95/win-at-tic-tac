import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameData } from "@/pages/Index";

interface GameBoardProps {
  gameData: GameData;
  onBackToMenu: () => void;
}

type Player = "X" | "O" | null;
type Board = Player[];

const GameBoard = ({ gameData, onBackToMenu }: GameBoardProps) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = useCallback((board: Board): Player => {
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }, [winningCombinations]);

  const getBestMove = useCallback((board: Board): number => {
    // Minimax algorithm for unbeatable AI
    const minimax = (board: Board, depth: number, isMaximizing: boolean): number => {
      const winner = checkWinner(board);
      
      if (winner === 'O') return 10 - depth;
      if (winner === 'X') return depth - 10;
      if (board.every(cell => cell !== null)) return 0;

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = 'O';
            const score = minimax(board, depth + 1, false);
            board[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = 'X';
            const score = minimax(board, depth + 1, true);
            board[i] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    };

    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }, [checkWinner]);

  const makeMove = useCallback((index: number, player: "X" | "O") => {
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameOver(true);
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
      
      // Auto restart after win
      setTimeout(() => {
        resetGame();
      }, 2000);
    } else if (newBoard.every(cell => cell !== null)) {
      setGameOver(true);
      
      // Auto restart on draw
      setTimeout(() => {
        resetGame();
      }, 1500);
    } else {
      setCurrentPlayer(player === "X" ? "O" : "X");
    }
  }, [board, checkWinner]);

  const handleCellClick = (index: number) => {
    if (board[index] || gameOver || isComputerThinking) return;
    makeMove(index, currentPlayer);
  };

  // Computer move effect
  useEffect(() => {
    if (gameData.mode === 'pvc' && currentPlayer === 'O' && !gameOver) {
      setIsComputerThinking(true);
      const timer = setTimeout(() => {
        const computerMove = getBestMove(board);
        makeMove(computerMove, 'O');
        setIsComputerThinking(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameData.mode, gameOver, board, getBestMove, makeMove]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameOver(false);
    setIsComputerThinking(false);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
  };

  const getCurrentPlayerName = () => {
    return currentPlayer === 'X' ? gameData.player1 : gameData.player2;
  };

  const getStatusMessage = () => {
    if (gameOver) {
      if (winner) {
        const winnerName = winner === 'X' ? gameData.player1 : gameData.player2;
        return `🎉 ${winnerName} wins!`;
      }
      return "🤝 It's a draw! Restarting...";
    }
    
    if (isComputerThinking) {
      return "🤖 Computer is thinking...";
    }
    
    return `${getCurrentPlayerName()}'s turn`;
  };

  const checkWinningCell = (index: number): boolean => {
    if (!winner) return false;
    return winningCombinations.some(combination => 
      combination.includes(index) && 
      combination.every(i => board[i] && board[i] === winner)
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-6 bg-gradient-card border-2 border-border/50 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            🎮 Tic Tac Toe
          </h1>
          <Button variant="outline" onClick={onBackToMenu} className="text-sm">
            ← Menu
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl">
          <div className={`text-center flex-1 ${currentPlayer === 'X' ? 'bg-white/20 rounded-lg p-2' : ''}`}>
            <div className="font-semibold text-game-player-x">{gameData.player1}</div>
            <div className="text-2xl font-bold text-game-player-x">X</div>
            <div className="text-lg font-bold">{scores.X}</div>
          </div>
          
          <div className="text-xl font-bold text-muted-foreground mx-4">VS</div>
          
          <div className={`text-center flex-1 ${currentPlayer === 'O' ? 'bg-white/20 rounded-lg p-2' : ''}`}>
            <div className="font-semibold text-game-player-o">{gameData.player2}</div>
            <div className="text-2xl font-bold text-game-player-o">O</div>
            <div className="text-lg font-bold">{scores.O}</div>
          </div>
        </div>

        <div className="text-center mb-6 p-3 bg-secondary/50 rounded-lg">
          <span className="text-lg font-semibold">{getStatusMessage()}</span>
        </div>

        <div className={`grid grid-cols-3 gap-3 mb-6 ${isComputerThinking ? 'animate-pulse' : ''}`}>
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              className={`
                aspect-square bg-game-cell hover:bg-game-cell-hover 
                border-2 border-border rounded-xl transition-all duration-200
                flex items-center justify-center text-3xl font-bold
                ${!cell && !gameOver && !isComputerThinking ? 'hover:scale-105 hover:shadow-lg' : ''}
                ${cell === 'X' ? 'text-game-player-x bg-primary/10' : cell === 'O' ? 'text-game-player-o bg-accent/10' : ''}
                ${checkWinningCell(index) ? 'ring-2 ring-primary bg-primary/20 animate-pulse' : ''}
              `}
              disabled={!!cell || gameOver || isComputerThinking}
            >
              {cell && (
                <span className="animate-in zoom-in-50 duration-200">
                  {cell}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={resetGame} 
            variant="default" 
            className="flex-1 bg-gradient-primary hover:opacity-90"
          >
            🔄 New Game
          </Button>
          <Button 
            onClick={resetScores} 
            variant="outline" 
            className="px-4"
          >
            📊 Reset
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameBoard;