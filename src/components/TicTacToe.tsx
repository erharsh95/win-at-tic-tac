import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Player = "X" | "O" | null;
type Board = Player[];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player>(null);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (board: Board): Player => {
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameOver(true);
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (newBoard.every(cell => cell !== null)) {
      setGameOver(true);
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameOver(false);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Tic Tac Toe
          </h1>
          <p className="text-muted-foreground">
            {gameOver 
              ? winner 
                ? `🎉 Player ${winner} wins!` 
                : "It's a draw!"
              : `Player ${currentPlayer}'s turn`
            }
          </p>
        </div>

        <Card className="p-6 bg-gradient-card border-2 border-border/50 shadow-2xl">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                className={`
                  aspect-square bg-game-cell hover:bg-game-cell-hover 
                  border-2 border-border rounded-xl transition-all duration-200
                  flex items-center justify-center text-3xl font-bold
                  ${!cell && !gameOver ? 'hover:scale-105 hover:shadow-lg' : ''}
                  ${cell === 'X' ? 'text-game-player-x' : cell === 'O' ? 'text-game-player-o' : ''}
                  ${gameOver && winner && checkWinningCell(index, board, winningCombinations) 
                    ? 'ring-2 ring-game-winner-glow bg-game-winner-glow/10' 
                    : ''
                  }
                `}
                disabled={!!cell || gameOver}
              >
                {cell && (
                  <span className="animate-in zoom-in-50 duration-200">
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex gap-4">
                <span className="text-game-player-x font-medium">X: {scores.X}</span>
                <span className="text-game-player-o font-medium">O: {scores.O}</span>
                <span className="text-muted-foreground">Draws: {scores.draws}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={resetGame} 
                variant="default" 
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                New Game
              </Button>
              <Button 
                onClick={resetScores} 
                variant="outline" 
                className="px-4"
              >
                Reset Scores
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const checkWinningCell = (index: number, board: Board, winningCombinations: number[][]): boolean => {
  return winningCombinations.some(combination => 
    combination.includes(index) && 
    combination.every(i => board[i] && board[i] === board[combination[0]])
  );
};

export default TicTacToe;