// Sport-specific element generator for Excalidraw
// Using any types for Excalidraw to avoid import issues
type ExcalidrawElement = any

export type SportElementType =
  | 'player'
  | 'cone'
  | 'ball'
  | 'goal'
  | 'pitch-full'
  | 'pitch-half'
  | 'arrow-movement'
  | 'arrow-pass'

export interface SportElementOptions {
  x: number
  y: number
  label?: string
  color?: string
  size?: 'small' | 'medium' | 'large'
}

const COLORS = {
  player: {
    team1: '#1971c2',
    team2: '#e03131',
    neutral: '#495057',
  },
  equipment: {
    cone: '#f76707',
    ball: '#ffffff',
    goal: '#868e96',
  },
  field: {
    line: '#ffffff',
    fill: '#2f9e44',
  },
}

const SIZES = {
  small: 30,
  medium: 40,
  large: 50,
}

// Generate unique ID for Excalidraw elements
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15)
}

export function createPlayerElement(options: SportElementOptions): Partial<ExcalidrawElement>[] {
  const size = SIZES[options.size || 'medium']
  const color = options.color || COLORS.player.team1

  const elements: Partial<ExcalidrawElement>[] = [
    {
      id: generateId(),
      type: 'ellipse',
      x: options.x,
      y: options.y,
      width: size,
      height: size,
      strokeColor: color,
      backgroundColor: color + '40', // Add transparency
      fillStyle: 'solid',
      strokeWidth: 2,
      roughness: 0,
      opacity: 100,
      angle: 0,
      strokeStyle: 'solid',
      roundness: null,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      groupIds: [],
    } as any,
  ]

  // Add label if provided
  if (options.label) {
    elements.push({
      id: generateId(),
      type: 'text',
      x: options.x + size / 2 - (options.label.length * 4),
      y: options.y + size + 5,
      width: options.label.length * 8,
      height: 20,
      text: options.label,
      fontSize: 14,
      fontFamily: 1,
      textAlign: 'center',
      strokeColor: color,
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      roughness: 0,
      opacity: 100,
      angle: 0,
      strokeStyle: 'solid',
      roundness: null,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      groupIds: [],
    } as any)
  }

  return elements
}

export function createConeElement(options: SportElementOptions): Partial<ExcalidrawElement> {
  const size = SIZES[options.size || 'small']

  return {
    id: generateId(),
    type: 'diamond',
    x: options.x,
    y: options.y,
    width: size * 0.6,
    height: size * 0.8,
    strokeColor: COLORS.equipment.cone,
    backgroundColor: COLORS.equipment.cone + '60',
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 0,
    opacity: 100,
    angle: 0,
    strokeStyle: 'solid',
    roundness: null,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
      groupIds: [],
  } as any
}

export function createBallElement(options: SportElementOptions): Partial<ExcalidrawElement> {
  const size = SIZES.small

  return {
    id: generateId(),
    type: 'ellipse',
    x: options.x,
    y: options.y,
    width: size,
    height: size,
    strokeColor: '#000000',
    backgroundColor: COLORS.equipment.ball,
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 0,
    opacity: 100,
    angle: 0,
    strokeStyle: 'solid',
    roundness: null,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
      groupIds: [],
  } as any
}

export function createGoalElement(options: SportElementOptions): Partial<ExcalidrawElement>[] {
  const width = 100
  const height = 60

  return [
    // Goal frame
    {
      id: generateId(),
      type: 'rectangle',
      x: options.x,
      y: options.y,
      width,
      height,
      strokeColor: COLORS.equipment.goal,
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 3,
      roughness: 0,
      opacity: 100,
      angle: 0,
      strokeStyle: 'solid',
      roundness: null,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      groupIds: [],
    } as any,
    // Net pattern
    {
      id: generateId(),
      type: 'line',
      x: options.x,
      y: options.y + height / 2,
      width,
      height: 0,
      points: [[0, 0], [width, 0]],
      strokeColor: COLORS.equipment.goal,
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      roughness: 0,
      opacity: 50,
      angle: 0,
      strokeStyle: 'dashed',
      roundness: null,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      groupIds: [],
    } as any,
  ]
}

export function createFootballPitchElement(
  options: SportElementOptions & { type: 'full' | 'half' }
): Partial<ExcalidrawElement>[] {
  const width = options.type === 'full' ? 800 : 400
  const height = 520
  const elements: Partial<ExcalidrawElement>[] = []

  // Main pitch rectangle
  elements.push({
    id: generateId(),
    type: 'rectangle',
    x: options.x,
    y: options.y,
    width,
    height,
    strokeColor: COLORS.field.line,
    backgroundColor: COLORS.field.fill,
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 0,
    opacity: 100,
    angle: 0,
    strokeStyle: 'solid',
    roundness: null,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
      groupIds: [],
  } as any)

  // Center line
  if (options.type === 'full') {
    elements.push({
      id: generateId(),
      type: 'line',
      x: options.x + width / 2,
      y: options.y,
      width: 0,
      height,
      points: [[0, 0], [0, height]],
      strokeColor: COLORS.field.line,
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      roughness: 0,
      opacity: 100,
      angle: 0,
      strokeStyle: 'solid',
      roundness: null,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      groupIds: [],
    } as any)

    // Center circle
    elements.push({
      id: generateId(),
      type: 'ellipse',
      x: options.x + width / 2 - 50,
      y: options.y + height / 2 - 50,
      width: 100,
      height: 100,
      strokeColor: COLORS.field.line,
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      roughness: 0,
      opacity: 100,
      angle: 0,
      strokeStyle: 'solid',
      roundness: null,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      groupIds: [],
    } as any)
  }

  // Penalty areas
  const penaltyAreaWidth = 160
  const penaltyAreaHeight = 120

  if (options.type === 'full') {
    // Left penalty area
    elements.push({
      id: generateId(),
      type: 'rectangle',
      x: options.x,
      y: options.y + (height - penaltyAreaHeight) / 2,
      width: penaltyAreaWidth,
      height: penaltyAreaHeight,
      strokeColor: COLORS.field.line,
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 2,
      roughness: 0,
      opacity: 100,
      angle: 0,
      strokeStyle: 'solid',
      roundness: null,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      groupIds: [],
    } as any)
  }

  // Right penalty area (or only one for half pitch)
  elements.push({
    id: generateId(),
    type: 'rectangle',
    x: options.x + width - penaltyAreaWidth,
    y: options.y + (height - penaltyAreaHeight) / 2,
    width: penaltyAreaWidth,
    height: penaltyAreaHeight,
    strokeColor: COLORS.field.line,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 0,
    opacity: 100,
    angle: 0,
    strokeStyle: 'solid',
    roundness: null,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
      groupIds: [],
  } as any)

  return elements
}

export function createMovementArrowElement(
  from: { x: number; y: number },
  to: { x: number; y: number },
  color?: string
): Partial<ExcalidrawElement> {
  return {
    id: generateId(),
    type: 'arrow',
    x: from.x,
    y: from.y,
    width: to.x - from.x,
    height: to.y - from.y,
    points: [
      [0, 0],
      [to.x - from.x, to.y - from.y],
    ],
    strokeColor: color || '#000000',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 0,
    opacity: 100,
    angle: 0,
    strokeStyle: 'solid',
    roundness: { type: 2 },
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
      groupIds: [],
    startBinding: null,
    endBinding: null,
    lastCommittedPoint: null,
    startArrowhead: null,
    endArrowhead: 'arrow',
  } as any
}

export function createSportElement(
  type: SportElementType,
  options: SportElementOptions & { type?: 'full' | 'half'; to?: { x: number; y: number } }
): Partial<ExcalidrawElement> | Partial<ExcalidrawElement>[] {
  switch (type) {
    case 'player':
      return createPlayerElement(options)
    case 'cone':
      return createConeElement(options)
    case 'ball':
      return createBallElement(options)
    case 'goal':
      return createGoalElement(options)
    case 'pitch-full':
      return createFootballPitchElement({ ...options, type: 'full' })
    case 'pitch-half':
      return createFootballPitchElement({ ...options, type: 'half' })
    case 'arrow-movement':
    case 'arrow-pass':
      if (options.to) {
        return createMovementArrowElement(
          { x: options.x, y: options.y },
          options.to,
          type === 'arrow-pass' ? '#e03131' : '#000000'
        )
      }
      throw new Error('Arrow requires "to" coordinates')
    default:
      throw new Error(`Unknown element type: ${type}`)
  }
}
