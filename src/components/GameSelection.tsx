import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GameData } from "@/pages/Index";

interface GameSelectionProps {
  onStartGame: (data: GameData) => void;
}

const GameSelection = ({ onStartGame }: GameSelectionProps) => {
  const [selectedMode, setSelectedMode] = useState<'pvp' | 'pvc' | null>(null);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  const handleModeSelect = (mode: 'pvp' | 'pvc') => {
    setSelectedMode(mode);
    if (mode === 'pvc') {
      setPlayer2('Computer');
    } else {
      setPlayer2('');
    }
  };

  const handleStartGame = () => {
    if (!selectedMode || !player1.trim()) return;
    
    const gameData: GameData = {
      mode: selectedMode,
      player1: player1.trim() || 'Player 1',
      player2: selectedMode === 'pvc' ? 'Computer' : (player2.trim() || 'Player 2')
    };
    
    onStartGame(gameData);
  };

  const isValid = selectedMode && player1.trim() && 
    (selectedMode === 'pvc' || player2.trim());

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-8 bg-gradient-card border-2 border-border/50 shadow-2xl">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent text-center mb-8">
          🎮 Tic Tac Toe
        </h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Choose Game Mode</h2>
            <div className="space-y-3">
              <Button
                variant={selectedMode === 'pvp' ? 'default' : 'outline'}
                className="w-full p-4 text-lg"
                onClick={() => handleModeSelect('pvp')}
              >
                👥 Player vs Player
              </Button>
              <Button
                variant={selectedMode === 'pvc' ? 'default' : 'outline'}
                className="w-full p-4 text-lg"
                onClick={() => handleModeSelect('pvc')}
              >
                🤖 Player vs Computer
              </Button>
            </div>
          </div>

          {selectedMode && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <h2 className="text-xl font-semibold text-center">Enter Player Names</h2>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="player1">Player 1 (X):</Label>
                  <Input
                    id="player1"
                    value={player1}
                    onChange={(e) => setPlayer1(e.target.value)}
                    placeholder="Enter name"
                    maxLength={15}
                    className="mt-1"
                  />
                </div>
                
                {selectedMode === 'pvp' && (
                  <div>
                    <Label htmlFor="player2">Player 2 (O):</Label>
                    <Input
                      id="player2"
                      value={player2}
                      onChange={(e) => setPlayer2(e.target.value)}
                      placeholder="Enter name"
                      maxLength={15}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={handleStartGame}
            disabled={!isValid}
            className="w-full p-4 text-lg bg-gradient-primary hover:opacity-90"
          >
            🚀 Start Game
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameSelection;