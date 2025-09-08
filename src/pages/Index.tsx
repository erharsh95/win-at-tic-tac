import { useState } from "react";
import GameSelection from "@/components/GameSelection";
import GameBoard from "@/components/GameBoard";

export interface GameData {
  mode: 'pvp' | 'pvc';
  player1: string;
  player2: string;
}

const Index = () => {
  const [gameData, setGameData] = useState<GameData | null>(null);

  const handleStartGame = (data: GameData) => {
    setGameData(data);
  };

  const handleBackToMenu = () => {
    setGameData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4 flex items-center justify-center">
      {!gameData ? (
        <GameSelection onStartGame={handleStartGame} />
      ) : (
        <GameBoard gameData={gameData} onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
};

export default Index;
