"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Users, Target, Shield, Zap } from "lucide-react";
import { formations, Formation, getCanvasPosition, getFormationForTeam } from "../../lib/formations";

interface Player {
  id: string;
  name: string;
  number: number;
  position: { x: number; y: number };
  team: "home" | "away";
}

interface AddTeamDialogProps {
  onAddTeam: (players: Player[]) => void;
  canvasWidth: number;
  canvasHeight: number;
  children: React.ReactNode;
}

export function AddTeamDialog({
  onAddTeam,
  canvasWidth,
  canvasHeight,
  children,
}: AddTeamDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [teamType, setTeamType] = useState<"home" | "away">("home");
  const [startingNumber, setStartingNumber] = useState<string>("1");

  const handleAddTeam = () => {
    const baseFormation = formations.find(f => f.id === selectedFormation);
    if (!baseFormation || !canvasWidth || !canvasHeight) return;

    // Get formation with proper team positioning (flipped for away team)
    const formation = getFormationForTeam(baseFormation, teamType);

    const newPlayers: Player[] = formation.positions.map((position, index) => {
      const canvasPos = getCanvasPosition(position, canvasWidth, canvasHeight);
      const playerNumber = parseInt(startingNumber) + index;
      
      return {
        id: `${teamType}-player-${Date.now()}-${index}`,
        name: `${position.role} ${playerNumber}`,
        number: playerNumber,
        position: canvasPos,
        team: teamType,
      };
    });

    onAddTeam(newPlayers);
    setIsOpen(false);
    setSelectedFormation("");
  };

  const selectedFormationData = formations.find(f => f.id === selectedFormation);

  const getCategoryIcon = (category: Formation['category']) => {
    switch (category) {
      case 'defensive':
        return <Shield className="h-3 w-3" />;
      case 'attacking':
        return <Target className="h-3 w-3" />;
      case 'balanced':
        return <Zap className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: Formation['category']) => {
    switch (category) {
      case 'defensive':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'attacking':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'balanced':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Add Full Team
          </DialogTitle>
          <DialogDescription>
            Add a complete 11-player team using a pre-defined formation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Team Type Selection */}
          <div className="space-y-2">
            <Label>Team Type</Label>
            <RadioGroup
              value={teamType}
              onValueChange={(value: "home" | "away") => setTeamType(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home" className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <div className="flex flex-col">
                    <span>Home Team</span>
                    <span className="text-xs text-muted-foreground">Left side of pitch</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="away" id="away" />
                <Label htmlFor="away" className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="flex flex-col">
                    <span>Away Team</span>
                    <span className="text-xs text-muted-foreground">Right side of pitch</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {/* Visual pitch positioning guide */}
            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Pitch Layout</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-8 rounded border-2 flex items-center justify-center ${
                  teamType === "home" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-border bg-muted/20"
                }`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="ml-1 text-xs">HOME</span>
                </div>
                <div className="w-8 h-6 border rounded text-center text-xs flex items-center justify-center">
                  ⚽
                </div>
                <div className={`flex-1 h-8 rounded border-2 flex items-center justify-center ${
                  teamType === "away" ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-border bg-muted/20"
                }`}>
                  <span className="mr-1 text-xs">AWAY</span>
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Formation Selection */}
          <div className="space-y-2">
            <Label>Formation</Label>
            <Select value={selectedFormation} onValueChange={setSelectedFormation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose formation" />
              </SelectTrigger>
              <SelectContent>
                {formations.map((formation) => (
                  <SelectItem key={formation.id} value={formation.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(formation.category)}
                        <span className="font-medium">{formation.name}</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`ml-2 ${getCategoryColor(formation.category)}`}
                      >
                        {formation.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Formation Details */}
          {selectedFormationData && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{selectedFormationData.name}</h4>
                <div className="flex gap-1">
                  <Badge 
                    variant="outline"
                    className={getCategoryColor(selectedFormationData.category)}
                  >
                    {getCategoryIcon(selectedFormationData.category)}
                    {selectedFormationData.category}
                  </Badge>
                  <Badge variant="outline">
                    {selectedFormationData.era}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedFormationData.description}
              </p>
            </div>
          )}

          {/* Starting Number */}
          <div className="space-y-2">
            <Label>Starting Player Number</Label>
            <Select value={startingNumber} onValueChange={setStartingNumber}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Start from #1 (GK)</SelectItem>
                <SelectItem value="11">Start from #11</SelectItem>
                <SelectItem value="21">Start from #21</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAddTeam}
            disabled={!selectedFormation}
            className="w-full"
          >
            <Users className="h-4 w-4 mr-2" />
            Add {selectedFormationData?.name || 'Team'} Formation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}