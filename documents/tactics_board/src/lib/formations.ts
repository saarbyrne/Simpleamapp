// Formation definitions with player positions
// Positions are in percentage of field dimensions (0-100 for both x and y)
// For HORIZONTAL pitch: X=0 is left (own goal), X=100 is right (opponent goal)
// Y=0 is top, Y=100 is bottom

export interface FormationPosition {
  x: number; // 0-100 percentage from left (own goal to opponent goal)
  y: number; // 0-100 percentage from top to bottom  
  role: string; // Player role/position name
}

export interface Formation {
  id: string;
  name: string;
  description: string;
  positions: FormationPosition[];
  category: 'defensive' | 'balanced' | 'attacking';
  era: 'classic' | 'modern' | 'contemporary';
}

export const formations: Formation[] = [
  {
    id: '4-4-2',
    name: '4-4-2',
    description: 'Classic balanced formation with two strikers',
    category: 'balanced',
    era: 'classic',
    positions: [
      { x: 10, y: 50, role: 'GK' },      // Goalkeeper - left side (own goal)
      { x: 25, y: 20, role: 'LB' },      // Left Back
      { x: 25, y: 40, role: 'CB' },      // Center Back
      { x: 25, y: 60, role: 'CB' },      // Center Back  
      { x: 25, y: 80, role: 'RB' },      // Right Back
      { x: 50, y: 20, role: 'LM' },      // Left Midfielder
      { x: 50, y: 40, role: 'CM' },      // Center Midfielder
      { x: 50, y: 60, role: 'CM' },      // Center Midfielder
      { x: 50, y: 80, role: 'RM' },      // Right Midfielder
      { x: 75, y: 40, role: 'ST' },      // Striker
      { x: 75, y: 60, role: 'ST' },      // Striker
    ],
  },
  {
    id: '4-3-3',
    name: '4-3-3',
    description: 'Modern attacking formation with width and creativity',
    category: 'attacking',
    era: 'modern',
    positions: [
      { x: 10, y: 50, role: 'GK' },      // Goalkeeper
      { x: 25, y: 20, role: 'LB' },      // Left Back
      { x: 25, y: 40, role: 'CB' },      // Center Back
      { x: 25, y: 60, role: 'CB' },      // Center Back
      { x: 25, y: 80, role: 'RB' },      // Right Back
      { x: 45, y: 30, role: 'CM' },      // Center Midfielder
      { x: 50, y: 50, role: 'CM' },      // Center Midfielder
      { x: 45, y: 70, role: 'CM' },      // Center Midfielder
      { x: 75, y: 25, role: 'LW' },      // Left Winger
      { x: 75, y: 50, role: 'ST' },      // Striker
      { x: 75, y: 75, role: 'RW' },      // Right Winger
    ],
  },
  {
    id: '3-5-2',
    name: '3-5-2',
    description: 'Attacking formation with wing-backs and two strikers',
    category: 'attacking',
    era: 'modern',
    positions: [
      { x: 10, y: 50, role: 'GK' },      // Goalkeeper
      { x: 25, y: 30, role: 'CB' },      // Center Back
      { x: 25, y: 50, role: 'CB' },      // Center Back
      { x: 25, y: 70, role: 'CB' },      // Center Back
      { x: 50, y: 15, role: 'LWB' },     // Left Wing-back
      { x: 50, y: 35, role: 'CM' },      // Center Midfielder
      { x: 55, y: 50, role: 'CM' },      // Center Midfielder
      { x: 50, y: 65, role: 'CM' },      // Center Midfielder
      { x: 50, y: 85, role: 'RWB' },     // Right Wing-back
      { x: 75, y: 40, role: 'ST' },      // Striker
      { x: 75, y: 60, role: 'ST' },      // Striker
    ],
  },
  {
    id: '4-2-3-1',
    name: '4-2-3-1',
    description: 'Balanced formation with double pivot and attacking midfielder',
    category: 'balanced',
    era: 'contemporary',
    positions: [
      { x: 10, y: 50, role: 'GK' },      // Goalkeeper
      { x: 25, y: 20, role: 'LB' },      // Left Back
      { x: 25, y: 40, role: 'CB' },      // Center Back
      { x: 25, y: 60, role: 'CB' },      // Center Back
      { x: 25, y: 80, role: 'RB' },      // Right Back
      { x: 45, y: 40, role: 'CDM' },     // Defensive Midfielder
      { x: 45, y: 60, role: 'CDM' },     // Defensive Midfielder
      { x: 65, y: 25, role: 'LM' },      // Left Midfielder
      { x: 65, y: 50, role: 'CAM' },     // Attacking Midfielder
      { x: 65, y: 75, role: 'RM' },      // Right Midfielder
      { x: 80, y: 50, role: 'ST' },      // Striker
    ],
  },
  {
    id: '3-4-3',
    name: '3-4-3',
    description: 'Ultra-attacking formation with three center-backs',
    category: 'attacking',
    era: 'contemporary',
    positions: [
      { x: 10, y: 50, role: 'GK' },      // Goalkeeper
      { x: 25, y: 30, role: 'CB' },      // Center Back
      { x: 25, y: 50, role: 'CB' },      // Center Back
      { x: 25, y: 70, role: 'CB' },      // Center Back
      { x: 50, y: 20, role: 'LM' },      // Left Midfielder
      { x: 50, y: 40, role: 'CM' },      // Center Midfielder
      { x: 50, y: 60, role: 'CM' },      // Center Midfielder
      { x: 50, y: 80, role: 'RM' },      // Right Midfielder
      { x: 75, y: 25, role: 'LW' },      // Left Winger
      { x: 75, y: 50, role: 'ST' },      // Striker
      { x: 75, y: 75, role: 'RW' },      // Right Winger
    ],
  },
  {
    id: '5-3-2',
    name: '5-3-2',
    description: 'Defensive formation with wing-backs and solid midfield',
    category: 'defensive',
    era: 'modern',
    positions: [
      { x: 10, y: 50, role: 'GK' },      // Goalkeeper
      { x: 25, y: 15, role: 'LWB' },     // Left Wing-back
      { x: 25, y: 35, role: 'CB' },      // Center Back
      { x: 25, y: 50, role: 'CB' },      // Center Back
      { x: 25, y: 65, role: 'CB' },      // Center Back
      { x: 25, y: 85, role: 'RWB' },     // Right Wing-back
      { x: 55, y: 35, role: 'CM' },      // Center Midfielder
      { x: 55, y: 50, role: 'CM' },      // Center Midfielder
      { x: 55, y: 65, role: 'CM' },      // Center Midfielder
      { x: 75, y: 40, role: 'ST' },      // Striker
      { x: 75, y: 60, role: 'ST' },      // Striker
    ],
  },
  {
    id: '4-1-4-1',
    name: '4-1-4-1',
    description: 'Defensive formation with dedicated defensive midfielder',
    category: 'defensive',
    era: 'modern',
    positions: [
      { x: 10, y: 50, role: 'GK' },      // Goalkeeper
      { x: 25, y: 20, role: 'LB' },      // Left Back
      { x: 25, y: 40, role: 'CB' },      // Center Back
      { x: 25, y: 60, role: 'CB' },      // Center Back
      { x: 25, y: 80, role: 'RB' },      // Right Back
      { x: 40, y: 50, role: 'CDM' },     // Defensive Midfielder
      { x: 55, y: 20, role: 'LM' },      // Left Midfielder
      { x: 55, y: 40, role: 'CM' },      // Center Midfielder
      { x: 55, y: 60, role: 'CM' },      // Center Midfielder
      { x: 55, y: 80, role: 'RM' },      // Right Midfielder
      { x: 75, y: 50, role: 'ST' },      // Striker
    ],
  },
];

// Helper function to get formation by ID
export const getFormationById = (id: string): Formation | undefined => {
  return formations.find(formation => formation.id === id);
};

// Helper function to get formations by category
export const getFormationsByCategory = (category: Formation['category']): Formation[] => {
  return formations.filter(formation => formation.category === category);
};

// Helper function to flip formation coordinates for away teams
export const flipFormationForAwayTeam = (formation: Formation): Formation => {
  return {
    ...formation,
    positions: formation.positions.map(position => ({
      ...position,
      x: 100 - position.x, // Mirror horizontally: flip X coordinates
    })),
  };
};

// Helper function to get formation with team-specific positioning
export const getFormationForTeam = (
  formation: Formation,
  teamType: "home" | "away"
): Formation => {
  if (teamType === "away") {
    return flipFormationForAwayTeam(formation);
  }
  return formation;
};

// Helper function to convert percentage positions to canvas coordinates
export const getCanvasPosition = (
  formationPosition: FormationPosition,
  canvasWidth: number,
  canvasHeight: number,
  padding: number = 20
): { x: number; y: number } => {
  const fieldWidth = canvasWidth - padding * 2;
  const fieldHeight = canvasHeight - padding * 2;
  
  return {
    x: padding + (formationPosition.x / 100) * fieldWidth,
    y: padding + (formationPosition.y / 100) * fieldHeight,
  };
};