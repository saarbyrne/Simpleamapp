"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  ArrowLeft,
  Save,
  Undo2,
  Redo2,
  Eraser,
  Users,
  User,
  MousePointer2,
  PenTool,
  ArrowRight,
  Square,
  Minus,
  Grid3X3,
  UserPlus,
  X,
  Film,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Plus,
  Settings,
  RotateCcw,
} from "lucide-react";
import { AddTeamDialog } from "./add-team-dialog";

interface TacticalBoard {
  id: string;
  title: string;
  formation: string;
  phase_of_play?: string;
  created_at: string;
  opponent?: string;
  match_date?: string;
  objectives?: string[];
}

interface Player {
  id: string;
  name: string;
  number: number;
  position: { x: number; y: number };
  team: "home" | "away";
}

interface DrawnObject {
  id: string;
  type: "player" | "opposition" | "arrow" | "zone" | "line" | "drawing";
  position: { x: number; y: number };
  endPosition?: { x: number; y: number };
  team?: "home" | "away";
  label?: string;
  path?: { x: number; y: number }[];
}

interface Keyframe {
  id: string;
  name: string;
  timestamp: number;
  players: Player[];
  objects: DrawnObject[];
}

interface TacticalBoardEditorProps {
  board: TacticalBoard;
  onBack: () => void;
  onSave: (board: TacticalBoard) => void;
}

const fieldBackgrounds = [
  { id: "empty", label: "Empty" },
  { id: "full", label: "Full Pitch" },
  { id: "attacking", label: "Attacking Half" },
  { id: "defensive", label: "Defensive Half" },
];

const drawingTools = [
  { id: "select", label: "Select", icon: MousePointer2, cursor: "default", shortcut: "S" },
  { id: "player", label: "Player", icon: Users, cursor: "crosshair", shortcut: "P" },
  { id: "opposition", label: "Opposition", icon: User, cursor: "crosshair", shortcut: "O" },
  { id: "arrow", label: "Arrow", icon: ArrowRight, cursor: "crosshair", shortcut: "A" },
  { id: "zone", label: "Zone", icon: Square, cursor: "crosshair", shortcut: "Z" },
  { id: "line", label: "Line", icon: Minus, cursor: "crosshair", shortcut: "L" },
  { id: "pen", label: "Draw", icon: PenTool, cursor: "crosshair", shortcut: "D" },
  { id: "eraser", label: "Eraser", icon: Eraser, cursor: "pointer", shortcut: "E" },
];

const formations = [
  "4-3-3",
  "4-4-2",
  "3-5-2",
  "4-2-3-1",
  "3-4-3",
  "5-3-2",
];

const phaseOptions = [
  "Build-up",
  "Attacking",
  "Defensive",
  "Transition",
  "Set Pieces",
];

type ToolState = "idle" | "drawing" | "dragging" | "selecting";

export function TacticalBoardEditor({
  board,
  onBack,
  onSave,
}: TacticalBoardEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Core state
  const [selectedTool, setSelectedTool] = useState("select");
  const [toolState, setToolState] = useState<ToolState>("idle");
  const [fieldBackground, setFieldBackground] = useState("full");
  const [showGrid, setShowGrid] = useState(false);
  
  // Drawing state
  const [players, setPlayers] = useState<Player[]>([]);
  const [drawnObjects, setDrawnObjects] = useState<DrawnObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  
  // Animation state
  const [keyframes, setKeyframes] = useState<Keyframe[]>([
    {
      id: "1",
      name: "Start",
      timestamp: 0,
      players: [],
      objects: [],
    },
  ]);
  const [currentKeyframe, setCurrentKeyframe] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(3);
  
  // Interaction state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [previewObject, setPreviewObject] = useState<DrawnObject | null>(null);
  
  // Canvas dimensions
  const [canvasSize, setCanvasSize] = useState({
    width: 800,
    height: 600,
  });
  
  // History management
  const [undoStack, setUndoStack] = useState<{
    players: Player[];
    objects: DrawnObject[];
  }[]>([]);
  const [redoStack, setRedoStack] = useState<{
    players: Player[];
    objects: DrawnObject[];
  }[]>([]);
  
  // Settings
  const [boardSettings, setBoardSettings] = useState({
    title: board.title,
    formation: board.formation,
    phase_of_play: board.phase_of_play || "",
    objectives: board.objectives?.join(", ") || "",
    opponent: board.opponent || "",
    notes: "",
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Memoized cursor style for performance
  const currentCursor = useMemo(() => {
    const tool = drawingTools.find(t => t.id === selectedTool);
    return tool?.cursor || "default";
  }, [selectedTool]);

  // History management utilities
  const saveToHistory = useCallback(() => {
    setUndoStack(prev => [...prev, { players: [...players], objects: [...drawnObjects] }]);
    setRedoStack([]); // Clear redo stack when new action is performed
  }, [players, drawnObjects]);

  // Keyframe state restoration - Enhanced to ensure proper deep copy
  const restoreKeyframeState = useCallback((keyframe: Keyframe) => {
    // Deep clone to prevent reference issues
    const clonedPlayers = keyframe.players.map(player => ({
      ...player,
      position: { ...player.position }
    }));
    
    const clonedObjects = keyframe.objects.map(obj => ({
      ...obj,
      position: { ...obj.position },
      endPosition: obj.endPosition ? { ...obj.endPosition } : undefined,
      path: obj.path ? obj.path.map(point => ({ ...point })) : undefined
    }));
    
    setPlayers(clonedPlayers);
    setDrawnObjects(clonedObjects);
    setSelectedObject(null);
  }, []);

  // Removed recording mode - keyframes are now captured explicitly when added

  // Playback animation system using useEffect
  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
  }, []);

  // Handle playback toggle
  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      stopPlayback();
    } else {
      if (keyframes.length <= 1) return;
      
      // If we're at the last frame, restart from the beginning
      if (currentKeyframe >= keyframes.length - 1) {
        setCurrentKeyframe(0);
        restoreKeyframeState(keyframes[0]);
      }
      
      setIsPlaying(true);
    }
  }, [isPlaying, stopPlayback, keyframes, currentKeyframe, restoreKeyframeState]);

  // Playback without looping - stops at the end
  useEffect(() => {
    if (!isPlaying || keyframes.length <= 1) {
      return;
    }

    const playNextFrame = () => {
      setCurrentKeyframe(prev => {
        const nextFrame = prev + 1;
        
        // Stop playback if we've reached the end (no looping)
        if (nextFrame >= keyframes.length) {
          setIsPlaying(false);
          return prev; // Stay on last frame
        }
        
        const keyframe = keyframes[nextFrame];
        restoreKeyframeState(keyframe);
        
        // Schedule next frame if not at end
        if (nextFrame + 1 < keyframes.length) {
          playbackTimerRef.current = setTimeout(() => {
            playNextFrame();
          }, 2000 / playbackSpeed);
        } else {
          // This will be the last frame, stop after displaying it
          playbackTimerRef.current = setTimeout(() => {
            setIsPlaying(false);
          }, 2000 / playbackSpeed);
        }
        
        return nextFrame;
      });
    };

    // Start the playback
    playbackTimerRef.current = setTimeout(() => {
      playNextFrame();
    }, 2000 / playbackSpeed);

    return () => {
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    };
  }, [isPlaying, keyframes.length, playbackSpeed, restoreKeyframeState]);

  // Navigate to specific keyframe
  const goToKeyframe = useCallback((index: number) => {
    if (index >= 0 && index < keyframes.length && index !== currentKeyframe) {
      // Stop playback when manually navigating
      if (isPlaying) {
        stopPlayback();
      }
      
      setCurrentKeyframe(index);
      const keyframe = keyframes[index];
      if (keyframe) {
        restoreKeyframeState(keyframe);
      }
    }
  }, [keyframes, restoreKeyframeState, isPlaying, stopPlayback, currentKeyframe]);

  // Delete selected object function
  const deleteSelectedObject = useCallback(() => {
    if (!selectedObject) return;
    
    saveToHistory();
    
    // Check if it's a player
    const playerToDelete = players.find(p => p.id === selectedObject);
    if (playerToDelete) {
      setPlayers(prev => prev.filter(p => p.id !== selectedObject));
      setSelectedObject(null);
      return;
    }
    
    // Check if it's a drawn object
    const objectToDelete = drawnObjects.find(obj => obj.id === selectedObject);
    if (objectToDelete) {
      setDrawnObjects(prev => prev.filter(obj => obj.id !== selectedObject));
      setSelectedObject(null);
      return;
    }
  }, [selectedObject, players, drawnObjects, saveToHistory]);

  // Enhanced keyframe management with proper object handling
  const addKeyframe = useCallback(() => {
    const newKeyframe: Keyframe = {
      id: Date.now().toString(),
      name: `Frame ${keyframes.length + 1}`,
      timestamp: Date.now(),
      players: players.map(player => ({
        ...player,
        position: { ...player.position }
      })),
      objects: drawnObjects.map(obj => ({
        ...obj,
        position: { ...obj.position },
        endPosition: obj.endPosition ? { ...obj.endPosition } : undefined,
        path: obj.path ? obj.path.map(point => ({ ...point })) : undefined
      })),
    };
    
    setKeyframes(prev => [...prev, newKeyframe]);
    // Auto-focus the new keyframe
    setCurrentKeyframe(keyframes.length);
  }, [players, drawnObjects, keyframes.length]);

  const removeKeyframe = useCallback((index: number) => {
    if (keyframes.length <= 1) return;
    
    // Stop playback if removing current or future frame
    if (isPlaying && index <= currentKeyframe) {
      stopPlayback();
    }
    
    const newKeyframes = keyframes.filter((_, i) => i !== index);
    setKeyframes(newKeyframes);
    
    // Adjust current keyframe if necessary
    if (currentKeyframe >= newKeyframes.length) {
      const newIndex = newKeyframes.length - 1;
      setCurrentKeyframe(newIndex);
      restoreKeyframeState(newKeyframes[newIndex]);
    } else if (currentKeyframe === index) {
      // If we removed the current frame, go to the previous one
      const newIndex = Math.max(0, index - 1);
      setCurrentKeyframe(newIndex);
      restoreKeyframeState(newKeyframes[newIndex]);
    }
  }, [keyframes, currentKeyframe, isPlaying, stopPlayback, restoreKeyframeState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    };
  }, []);

  // Tool selection
  const handleToolSelect = useCallback((toolId: string) => {
    if (selectedTool === toolId && toolId !== "select") {
      setSelectedTool("select");
    } else {
      setSelectedTool(toolId);
    }
    setSelectedObject(null);
    setToolState("idle");
    setPreviewObject(null);
    setCurrentPath([]);
  }, [selectedTool]);

  // Canvas sizing
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const backgroundCanvas = backgroundCanvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !backgroundCanvas || !container) return;

    const containerRect = container.getBoundingClientRect();
    if (containerRect.width <= 0 || containerRect.height <= 0) return;

    const padding = 32;
    const availableWidth = Math.max(containerRect.width - padding, 200);
    const availableHeight = Math.max(containerRect.height - padding, 150);
    
    const aspectRatio = 4 / 3;
    let width = availableWidth;
    let height = width / aspectRatio;
    
    if (height > availableHeight) {
      height = availableHeight;
      width = height * aspectRatio;
    }
    
    width = Math.max(width, 300);
    height = Math.max(height, 225);

    if (
      Math.abs(canvasSize.width - width) > 2 ||
      Math.abs(canvasSize.height - height) > 2
    ) {
      setCanvasSize({ width, height });

      const devicePixelRatio = window.devicePixelRatio || 1;
      
      // Setup main canvas
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Setup background canvas
      backgroundCanvas.width = width * devicePixelRatio;
      backgroundCanvas.height = height * devicePixelRatio;
      backgroundCanvas.style.width = `${width}px`;
      backgroundCanvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      const bgCtx = backgroundCanvas.getContext("2d");
      
      if (ctx) {
        ctx.scale(devicePixelRatio, devicePixelRatio);
      }
      if (bgCtx) {
        bgCtx.scale(devicePixelRatio, devicePixelRatio);
      }
    }
  }, [canvasSize.width, canvasSize.height]);

  // Canvas resize observer
  useEffect(() => {
    updateCanvasSize();
    
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateCanvasSize]);

  // Background rendering
  const drawBackground = useCallback(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvasSize.width <= 0 || canvasSize.height <= 0) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Always draw green field background
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Only draw field lines and markings if not empty
    if (fieldBackground !== "empty") {
      // Draw field lines
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;

      const padding = 20;
      const fieldWidth = canvasSize.width - padding * 2;
      const fieldHeight = canvasSize.height - padding * 2;

      // Outer boundaries
      ctx.strokeRect(padding, padding, fieldWidth, fieldHeight);
    }

    // Only draw field details if not empty
    if (fieldBackground !== "empty") {
      const padding = 20;
      const fieldWidth = canvasSize.width - padding * 2;
      const fieldHeight = canvasSize.height - padding * 2;
      const centerX = canvasSize.width / 2;
      const centerY = canvasSize.height / 2;

      // Center line and circle
      if (fieldBackground === "full") {
        ctx.beginPath();
        ctx.moveTo(centerX, padding);
        ctx.lineTo(centerX, canvasSize.height - padding);
        ctx.stroke();

        ctx.beginPath();
        const circleRadius = Math.max(Math.min(fieldWidth, fieldHeight) * 0.1, 10);
        ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Penalty areas
      const penaltyWidth = fieldWidth * 0.125;
      const penaltyHeight = fieldHeight * 0.27;
      const goalWidth = fieldWidth * 0.05;
      const goalHeight = fieldHeight * 0.13;

      if (fieldBackground === "full" || fieldBackground === "attacking") {
        ctx.strokeRect(
          canvasSize.width - padding - penaltyWidth,
          centerY - penaltyHeight / 2,
          penaltyWidth,
          penaltyHeight,
        );
        ctx.strokeRect(
          canvasSize.width - padding - goalWidth,
          centerY - goalHeight / 2,
          goalWidth,
          goalHeight,
        );
      }

      if (fieldBackground === "full" || fieldBackground === "defensive") {
        ctx.strokeRect(
          padding,
          centerY - penaltyHeight / 2,
          penaltyWidth,
          penaltyHeight,
        );
        ctx.strokeRect(
          padding,
          centerY - goalHeight / 2,
          goalWidth,
          goalHeight,
        );
      }
    }

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;

      const gridSize = Math.min(canvasSize.width, canvasSize.height) / 20;

      for (let x = 0; x < canvasSize.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvasSize.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize.width, y);
        ctx.stroke();
      }
    }
  }, [fieldBackground, showGrid, canvasSize]);

  // Dynamic content rendering
  const drawDynamicContent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvasSize.width <= 0 || canvasSize.height <= 0) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const playerRadius = Math.max(Math.abs(canvasSize.width * 0.015), 8);

    // Draw players
    players.forEach((player) => {
      const isSelected = selectedObject === player.id;
      const isHovered = selectedTool === "eraser";
      
      ctx.fillStyle = player.team === "home" ? "#3b82f6" : "#ef4444";
      
      if (isSelected) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
      } else if (isHovered) {
        ctx.strokeStyle = "#ff4444";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "transparent";
        ctx.lineWidth = 3;
      }

      ctx.beginPath();
      ctx.arc(
        player.position.x,
        player.position.y,
        Math.max(playerRadius, 1),
        0,
        Math.PI * 2,
      );
      ctx.fill();

      if (isSelected || isHovered) {
        ctx.stroke();
      }

      // Player number
      ctx.fillStyle = "white";
      ctx.font = `${Math.max(playerRadius * 0.7, 8)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        player.number.toString(),
        player.position.x,
        player.position.y,
      );
    });

    // Draw objects
    drawnObjects.forEach((obj) => {
      const isSelected = selectedObject === obj.id;
      const isHovered = selectedTool === "eraser";
      const lineWidth = Math.max(canvasSize.width * 0.004, 2);

      switch (obj.type) {
        case "opposition":
          ctx.fillStyle = "#ef4444";
          
          if (isSelected) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 4;
          } else if (isHovered) {
            ctx.strokeStyle = "#ff4444";
            ctx.lineWidth = 2;
          } else {
            ctx.strokeStyle = "transparent";
            ctx.lineWidth = 3;
          }

          ctx.beginPath();
          ctx.arc(
            obj.position.x,
            obj.position.y,
            Math.max(playerRadius, 1),
            0,
            Math.PI * 2,
          );
          ctx.fill();

          if (isSelected || isHovered) {
            ctx.stroke();
          }

          // Draw X for opposition
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          const crossSize = Math.max(playerRadius * 0.5, 3);
          ctx.beginPath();
          ctx.moveTo(
            obj.position.x - crossSize,
            obj.position.y - crossSize,
          );
          ctx.lineTo(
            obj.position.x + crossSize,
            obj.position.y + crossSize,
          );
          ctx.moveTo(
            obj.position.x + crossSize,
            obj.position.y - crossSize,
          );
          ctx.lineTo(
            obj.position.x - crossSize,
            obj.position.y + crossSize,
          );
          ctx.stroke();
          break;

        case "arrow":
          if (obj.endPosition) {
            ctx.strokeStyle = isSelected ? "#ffffff" : isHovered ? "#ff4444" : "#fbbf24";
            ctx.lineWidth = isSelected || isHovered ? lineWidth + 1 : lineWidth;
            ctx.beginPath();
            ctx.moveTo(obj.position.x, obj.position.y);
            ctx.lineTo(obj.endPosition.x, obj.endPosition.y);
            ctx.stroke();

            // Arrow head
            const angle = Math.atan2(
              obj.endPosition.y - obj.position.y,
              obj.endPosition.x - obj.position.x,
            );
            const arrowSize = Math.max(playerRadius * 0.8, 5);
            ctx.beginPath();
            ctx.moveTo(obj.endPosition.x, obj.endPosition.y);
            ctx.lineTo(
              obj.endPosition.x - arrowSize * Math.cos(angle - Math.PI / 6),
              obj.endPosition.y - arrowSize * Math.sin(angle - Math.PI / 6),
            );
            ctx.lineTo(
              obj.endPosition.x - arrowSize * Math.cos(angle + Math.PI / 6),
              obj.endPosition.y - arrowSize * Math.sin(angle + Math.PI / 6),
            );
            ctx.closePath();
            ctx.fillStyle = isSelected ? "#ffffff" : isHovered ? "#ff4444" : "#fbbf24";
            ctx.fill();
          }
          break;

        case "zone":
          if (obj.endPosition) {
            ctx.strokeStyle = isSelected ? "#ffffff" : isHovered ? "#ff4444" : "#8b5cf6";
            ctx.fillStyle = isSelected
              ? "rgba(255, 255, 255, 0.2)"
              : isHovered
              ? "rgba(255, 68, 68, 0.2)"
              : "rgba(139, 92, 246, 0.2)";
            ctx.lineWidth = isSelected || isHovered ? lineWidth + 1 : lineWidth;

            const width = obj.endPosition.x - obj.position.x;
            const height = obj.endPosition.y - obj.position.y;

            ctx.fillRect(obj.position.x, obj.position.y, width, height);
            ctx.strokeRect(obj.position.x, obj.position.y, width, height);
          }
          break;

        case "line":
          if (obj.endPosition) {
            ctx.strokeStyle = isSelected ? "#fbbf24" : isHovered ? "#ff4444" : "#ffffff";
            ctx.lineWidth = isSelected || isHovered ? lineWidth + 1 : lineWidth;
            ctx.beginPath();
            ctx.moveTo(obj.position.x, obj.position.y);
            ctx.lineTo(obj.endPosition.x, obj.endPosition.y);
            ctx.stroke();
          }
          break;

        case "drawing":
          if (obj.path && obj.path.length > 1) {
            ctx.strokeStyle = isSelected ? "#ffffff" : isHovered ? "#ff4444" : "#ff6b35";
            ctx.lineWidth = isSelected || isHovered ? Math.max(lineWidth + 1, 4) : Math.max(lineWidth, 3);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.beginPath();
            ctx.moveTo(obj.path[0].x, obj.path[0].y);
            for (let i = 1; i < obj.path.length; i++) {
              ctx.lineTo(obj.path[i].x, obj.path[i].y);
            }
            ctx.stroke();
          }
          break;
      }
    });

    // Draw preview object during drawing
    if (previewObject) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      
      switch (previewObject.type) {
        case "zone":
          if (previewObject.endPosition) {
            ctx.strokeStyle = "#8b5cf6";
            ctx.fillStyle = "rgba(139, 92, 246, 0.1)";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);

            const width = previewObject.endPosition.x - previewObject.position.x;
            const height = previewObject.endPosition.y - previewObject.position.y;

            ctx.fillRect(previewObject.position.x, previewObject.position.y, width, height);
            ctx.strokeRect(previewObject.position.x, previewObject.position.y, width, height);
          }
          break;

        case "arrow":
          if (previewObject.endPosition) {
            ctx.strokeStyle = "#fbbf24";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            
            ctx.beginPath();
            ctx.moveTo(previewObject.position.x, previewObject.position.y);
            ctx.lineTo(previewObject.endPosition.x, previewObject.endPosition.y);
            ctx.stroke();
          }
          break;

        case "line":
          if (previewObject.endPosition) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            
            ctx.beginPath();
            ctx.moveTo(previewObject.position.x, previewObject.position.y);
            ctx.lineTo(previewObject.endPosition.x, previewObject.endPosition.y);
            ctx.stroke();
          }
          break;
      }
      
      ctx.restore();
    }

    // Draw current drawing path
    if (currentPath.length > 1) {
      ctx.strokeStyle = "#ff6b35";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.8;

      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }
  }, [players, drawnObjects, selectedObject, canvasSize, previewObject, currentPath, selectedTool]);

  // Rendering effects
  useEffect(() => {
    drawBackground();
  }, [drawBackground]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      drawDynamicContent();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [drawDynamicContent]);

  // Coordinate calculation
  const getCanvasCoordinates = useCallback((
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    try {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in event
        ? event.touches[0]?.clientX || event.changedTouches[0]?.clientX
        : event.clientX;
      const clientY = "touches" in event
        ? event.touches[0]?.clientY || event.changedTouches[0]?.clientY
        : event.clientY;

      if (!canvasSize.width || !canvasSize.height || rect.width <= 0 || rect.height <= 0) {
        return { x: 0, y: 0 };
      }

      return {
        x: Math.max(0, Math.min(
          (clientX - rect.left) * (canvasSize.width / rect.width),
          canvasSize.width,
        )),
        y: Math.max(0, Math.min(
          (clientY - rect.top) * (canvasSize.height / rect.height),
          canvasSize.height,
        )),
      };
    } catch (error) {
      console.error('Coordinate calculation error:', error);
      return { x: 0, y: 0 };
    }
  }, [canvasSize]);

  // Object detection with improved performance
  const findObjectAt = useCallback((x: number, y: number) => {
    if (canvasSize.width <= 0 || canvasSize.height <= 0) return null;

    const playerRadius = Math.max(Math.abs(canvasSize.width * 0.015), 8);

    // Check players first
    for (const player of [...players].reverse()) {
      const dx = player.position.x - x;
      const dy = player.position.y - y;
      if (Math.sqrt(dx * dx + dy * dy) <= playerRadius) {
        return { type: "player", id: player.id, object: player };
      }
    }

    // Check drawn objects
    for (const obj of [...drawnObjects].reverse()) {
      if (obj.type === "player" || obj.type === "opposition") {
        const dx = obj.position.x - x;
        const dy = obj.position.y - y;
        if (Math.sqrt(dx * dx + dy * dy) <= playerRadius) {
          return { type: "object", id: obj.id, object: obj };
        }
      } else if (obj.type === "drawing" && obj.path) {
        // Check if point is near drawing path
        for (const point of obj.path) {
          const dx = point.x - x;
          const dy = point.y - y;
          if (Math.sqrt(dx * dx + dy * dy) <= 10) {
            return { type: "object", id: obj.id, object: obj };
          }
        }
      } else if ((obj.type === "arrow" || obj.type === "line") && obj.endPosition) {
        // Check if point is near line
        const lineLength = Math.sqrt(
          Math.pow(obj.endPosition.x - obj.position.x, 2) + 
          Math.pow(obj.endPosition.y - obj.position.y, 2)
        );
        if (lineLength > 0) {
          const t = Math.max(0, Math.min(1,
            ((x - obj.position.x) * (obj.endPosition.x - obj.position.x) + 
             (y - obj.position.y) * (obj.endPosition.y - obj.position.y)) / (lineLength * lineLength)
          ));
          const closestX = obj.position.x + t * (obj.endPosition.x - obj.position.x);
          const closestY = obj.position.y + t * (obj.endPosition.y - obj.position.y);
          const distance = Math.sqrt(Math.pow(x - closestX, 2) + Math.pow(y - closestY, 2));
          if (distance <= 8) {
            return { type: "object", id: obj.id, object: obj };
          }
        }
      } else if (obj.type === "zone" && obj.endPosition) {
        // Check if point is inside zone
        const minX = Math.min(obj.position.x, obj.endPosition.x);
        const maxX = Math.max(obj.position.x, obj.endPosition.x);
        const minY = Math.min(obj.position.y, obj.endPosition.y);
        const maxY = Math.max(obj.position.y, obj.endPosition.y);
        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
          return { type: "object", id: obj.id, object: obj };
        }
      }
    }

    return null;
  }, [players, drawnObjects, canvasSize]);

  // Canvas interaction handlers
  const handleCanvasStart = useCallback((
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    event.preventDefault();
    const coords = getCanvasCoordinates(event);

    try {
      if (selectedTool === "select") {
        const foundObject = findObjectAt(coords.x, coords.y);
        if (foundObject) {
          setSelectedObject(foundObject.id);
          setToolState("dragging");
          setStartPoint(coords);
        } else {
          setSelectedObject(null);
          setToolState("idle");
        }
        return;
      }

      if (selectedTool === "eraser") {
        const foundObject = findObjectAt(coords.x, coords.y);
        if (foundObject) {
          saveToHistory();
          // Delete the object immediately
          if (foundObject.type === "player") {
            setPlayers(prev => prev.filter(p => p.id !== foundObject.id));
          } else {
            setDrawnObjects(prev => prev.filter(obj => obj.id !== foundObject.id));
          }
        }
        return;
      }

      // Save state before making changes
      saveToHistory();

      if (selectedTool === "player") {
        const newPlayer: Player = {
          id: `player-${Date.now()}`,
          name: `Player ${players.filter((p) => p.team === "home").length + 1}`,
          number: players.filter((p) => p.team === "home").length + 1,
          position: coords,
          team: "home",
        };
        setPlayers(prev => [...prev, newPlayer]);
        setToolState("idle");
        return;
      }

      if (selectedTool === "opposition") {
        const newOpposition: DrawnObject = {
          id: `opp-${Date.now()}`,
          type: "opposition",
          position: coords,
          team: "away",
        };
        setDrawnObjects(prev => [...prev, newOpposition]);
        setToolState("idle");
        return;
      }

      if (["arrow", "zone", "line"].includes(selectedTool)) {
        setToolState("drawing");
        setStartPoint(coords);
        setIsDrawing(true);
        
        // Create preview object
        setPreviewObject({
          id: "preview",
          type: selectedTool as "arrow" | "zone" | "line",
          position: coords,
          endPosition: coords,
        });
        return;
      }

      if (selectedTool === "pen") {
        setToolState("drawing");
        setIsDrawing(true);
        setCurrentPath([coords]);
        return;
      }
    } catch (error) {
      console.error('Canvas start error:', error);
    }
  }, [selectedTool, getCanvasCoordinates, findObjectAt, players, saveToHistory]);

  const handleCanvasMove = useCallback((
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    event.preventDefault();
    const coords = getCanvasCoordinates(event);

    try {
      if (selectedTool === "select" && selectedObject && toolState === "dragging" && startPoint) {
        // Move selected object
        const selectedPlayer = players.find(p => p.id === selectedObject);
        if (selectedPlayer) {
          setPlayers(prev =>
            prev.map((p) =>
              p.id === selectedObject ? { ...p, position: coords } : p,
            ),
          );
        }

        const selectedDrawnObject = drawnObjects.find(obj => obj.id === selectedObject);
        if (selectedDrawnObject) {
          setDrawnObjects(prev =>
            prev.map((obj) =>
              obj.id === selectedObject ? { ...obj, position: coords } : obj,
            ),
          );
        }
        return;
      }

      if (!isDrawing) return;

      if (["arrow", "zone", "line"].includes(selectedTool) && startPoint) {
        // Update preview object with live feedback
        setPreviewObject({
          id: "preview",
          type: selectedTool as "arrow" | "zone" | "line",
          position: startPoint,
          endPosition: coords,
        });
        return;
      }

      if (selectedTool === "pen") {
        // Add point to current drawing path
        setCurrentPath(prev => [...prev, coords]);
        return;
      }
    } catch (error) {
      console.error('Canvas move error:', error);
    }
  }, [isDrawing, selectedTool, selectedObject, startPoint, getCanvasCoordinates, players, drawnObjects, toolState]);

  const handleCanvasEnd = useCallback((
    event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    event.preventDefault();
    const coords = getCanvasCoordinates(event);

    try {
      // Handle dragging end for select tool
      if (selectedTool === "select" && toolState === "dragging") {
        setToolState("idle");
        setStartPoint(null);
        return;
      }

      if (!isDrawing) {
        setToolState("idle");
        return;
      }

      if (["arrow", "zone", "line"].includes(selectedTool) && startPoint) {
        const newObject: DrawnObject = {
          id: `${selectedTool}-${Date.now()}`,
          type: selectedTool as "arrow" | "zone" | "line",
          position: startPoint,
          endPosition: coords,
        };
        setDrawnObjects(prev => [...prev, newObject]);
        setPreviewObject(null);
      }

      if (selectedTool === "pen" && currentPath.length > 1) {
        const newDrawing: DrawnObject = {
          id: `drawing-${Date.now()}`,
          type: "drawing",
          position: currentPath[0],
          path: [...currentPath],
        };
        setDrawnObjects(prev => [...prev, newDrawing]);
        setCurrentPath([]);
      }

      setIsDrawing(false);
      setStartPoint(null);
      setToolState("idle");
    } catch (error) {
      console.error('Canvas end error:', error);
    }
  }, [isDrawing, selectedTool, toolState, startPoint, currentPath, getCanvasCoordinates]);

  // Undo/Redo
  const handleUndo = useCallback(() => {
    try {
      if (undoStack.length === 0) return;

      const lastState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, { players: [...players], objects: [...drawnObjects] }]);
      setUndoStack(prev => prev.slice(0, -1));
      setPlayers(lastState.players);
      setDrawnObjects(lastState.objects);
      setSelectedObject(null);
    } catch (error) {
      console.error('Undo error:', error);
    }
  }, [undoStack, players, drawnObjects]);

  const handleRedo = useCallback(() => {
    try {
      if (redoStack.length === 0) return;

      const nextState = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, { players: [...players], objects: [...drawnObjects] }]);
      setRedoStack(prev => prev.slice(0, -1));
      setPlayers(nextState.players);
      setDrawnObjects(nextState.objects);
      setSelectedObject(null);
    } catch (error) {
      console.error('Redo error:', error);
    }
  }, [redoStack, players, drawnObjects]);

  // Add team functionality - now uses the proper AddTeamDialog
  const handleAddTeam = useCallback((newPlayers: Player[]) => {
    saveToHistory();
    setPlayers(prev => [...prev, ...newPlayers]);
  }, [saveToHistory]);

  // Clear team functionality
  const handleClearTeam = useCallback((teamType: "home" | "away") => {
    saveToHistory();
    setPlayers(prev => prev.filter(p => p.team !== teamType));
    setDrawnObjects(prev => prev.filter(obj => obj.team !== teamType));
    setSelectedObject(null);
  }, [saveToHistory]);

  // Save board
  const handleSave = useCallback(() => {
    try {
      const updatedBoard = {
        ...board,
        ...boardSettings,
        objectives: boardSettings.objectives
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      onSave(updatedBoard);
    } catch (error) {
      console.error('Save error:', error);
    }
  }, [board, boardSettings, onSave]);

  // Team statistics
  const teamStats = useMemo(() => {
    const homePlayers = players.filter(p => p.team === "home").length;
    const awayPlayers = players.filter(p => p.team === "away").length;
    const homeObjects = drawnObjects.filter(obj => obj.team === "home").length;
    const awayObjects = drawnObjects.filter(obj => obj.team === "away").length;
    
    return {
      home: { players: homePlayers, objects: homeObjects },
      away: { players: awayPlayers, objects: awayObjects },
    };
  }, [players, drawnObjects]);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold">{boardSettings.title}</h1>
              <p className="text-sm text-muted-foreground">
                {boardSettings.formation}
                {boardSettings.phase_of_play && ` • ${boardSettings.phase_of_play}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Board Settings</DialogTitle>
                  <DialogDescription>
                    Configure your tactical board settings
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={boardSettings.title}
                      onChange={(e) =>
                        setBoardSettings((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="formation">Formation</Label>
                      <Select
                        value={boardSettings.formation}
                        onValueChange={(value) =>
                          setBoardSettings((prev) => ({
                            ...prev,
                            formation: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {formations.map((formation) => (
                            <SelectItem key={formation} value={formation}>
                              {formation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phase">Phase</Label>
                      <Select
                        value={boardSettings.phase_of_play}
                        onValueChange={(value) =>
                          setBoardSettings((prev) => ({
                            ...prev,
                            phase_of_play: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                        <SelectContent>
                          {phaseOptions.map((phase) => (
                            <SelectItem key={phase} value={phase}>
                              {phase}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Objectives</Label>
                    <Input
                      id="objectives"
                      value={boardSettings.objectives}
                      onChange={(e) =>
                        setBoardSettings((prev) => ({
                          ...prev,
                          objectives: e.target.value,
                        }))
                      }
                      placeholder="High press, Quick transitions"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="opponent">Opponent</Label>
                    <Input
                      id="opponent"
                      value={boardSettings.opponent}
                      onChange={(e) =>
                        setBoardSettings((prev) => ({
                          ...prev,
                          opponent: e.target.value,
                        }))
                      }
                      placeholder="Opposition team"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={boardSettings.notes}
                      onChange={(e) =>
                        setBoardSettings((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsSettingsOpen(false)}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* Left Sidebar */}
          <div className="w-full md:w-80 border-r bg-card/50 overflow-y-auto">
            <Card className="border-0 rounded-none">
              {/* Desktop Header */}
              <CardHeader className="hidden md:block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onBack}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle className="text-lg">{boardSettings.title}</CardTitle>
                      <CardDescription>
                        {boardSettings.formation}
                        {boardSettings.phase_of_play && ` • ${boardSettings.phase_of_play}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Board Settings</DialogTitle>
                          <DialogDescription>
                            Configure your tactical board settings
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={boardSettings.title}
                              onChange={(e) =>
                                setBoardSettings((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="formation">Formation</Label>
                              <Select
                                value={boardSettings.formation}
                                onValueChange={(value) =>
                                  setBoardSettings((prev) => ({
                                    ...prev,
                                    formation: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {formations.map((formation) => (
                                    <SelectItem key={formation} value={formation}>
                                      {formation}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phase">Phase</Label>
                              <Select
                                value={boardSettings.phase_of_play}
                                onValueChange={(value) =>
                                  setBoardSettings((prev) => ({
                                    ...prev,
                                    phase_of_play: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select phase" />
                                </SelectTrigger>
                                <SelectContent>
                                  {phaseOptions.map((phase) => (
                                    <SelectItem key={phase} value={phase}>
                                      {phase}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="objectives">Objectives</Label>
                            <Input
                              id="objectives"
                              value={boardSettings.objectives}
                              onChange={(e) =>
                                setBoardSettings((prev) => ({
                                  ...prev,
                                  objectives: e.target.value,
                                }))
                              }
                              placeholder="High press, Quick transitions"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="opponent">Opponent</Label>
                            <Input
                              id="opponent"
                              value={boardSettings.opponent}
                              onChange={(e) =>
                                setBoardSettings((prev) => ({
                                  ...prev,
                                  opponent: e.target.value,
                                }))
                              }
                              placeholder="Opposition team"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                              id="notes"
                              value={boardSettings.notes}
                              onChange={(e) =>
                                setBoardSettings((prev) => ({
                                  ...prev,
                                  notes: e.target.value,
                                }))
                              }
                              placeholder="Additional notes..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => setIsSettingsOpen(false)}>
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">


                {/* Animation & Keyframes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">
                      Animation
                    </Label>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Playback Controls - moved above keyframes */}
                    <div className="flex items-center gap-1 p-2 bg-muted/30 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => goToKeyframe(Math.max(0, currentKeyframe - 1))}
                        disabled={currentKeyframe <= 0 || isPlaying}
                        title="Previous Frame"
                      >
                        <SkipBack className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={togglePlayback}
                        disabled={keyframes.length <= 1}
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => goToKeyframe(Math.min(keyframes.length - 1, currentKeyframe + 1))}
                        disabled={currentKeyframe >= keyframes.length - 1 || isPlaying}
                        title="Next Frame"
                      >
                        <SkipForward className="h-3 w-3" />
                      </Button>
                      
                      {/* Speed Toggle */}
                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              disabled={isPlaying}
                            >
                              {playbackSpeed}x
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setPlaybackSpeed(1)}
                              className="text-xs"
                            >
                              1x Normal
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setPlaybackSpeed(2)}
                              className="text-xs"
                            >
                              2x Fast
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setPlaybackSpeed(3)}
                              className="text-xs"
                            >
                              3x Faster
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Keyframes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs">Keyframes ({keyframes.length})</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={addKeyframe}
                          className="h-6 px-2"
                          disabled={isPlaying}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="space-y-1 max-h-80 overflow-y-auto">
                        {keyframes.map((keyframe, index) => (
                          <div
                            key={keyframe.id}
                            className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${
                              currentKeyframe === index 
                                ? 'bg-primary/20 border border-primary/30' 
                                : 'bg-muted/50 hover:bg-muted'
                            }`}
                            onClick={() => goToKeyframe(index)}
                          >
                            <span className="truncate flex-1">
                              {keyframe.name} {currentKeyframe === index && '•'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeKeyframe(index);
                              }}
                              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground ml-1"
                              disabled={keyframes.length <= 1 || isPlaying}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Canvas Container */}
            <div 
              ref={containerRef}
              className="flex-1 flex items-center justify-center p-4 bg-muted/20"
            >
              <div className="w-full h-full max-w-5xl flex items-center justify-center relative">
                {/* Background Canvas - Static field rendering */}
                <canvas
                  ref={backgroundCanvasRef}
                  className="absolute border border-border rounded-md shadow-lg bg-background"
                  style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    touchAction: "none",
                  }}
                />
                
                {/* Main Canvas - Dynamic content */}
                <canvas
                  ref={canvasRef}
                  className="absolute border border-border rounded-md shadow-lg"
                  onMouseDown={handleCanvasStart}
                  onMouseMove={handleCanvasMove}
                  onMouseUp={handleCanvasEnd}
                  onTouchStart={handleCanvasStart}
                  onTouchMove={handleCanvasMove}
                  onTouchEnd={handleCanvasEnd}
                  style={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    touchAction: "none",
                    cursor: currentCursor,
                  }}
                />
              </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="border-t bg-background/95 backdrop-blur-sm">
              <div className="flex items-center justify-center p-3">
                <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
                  {/* Drawing Tools */}
                  {drawingTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Tooltip key={tool.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={selectedTool === tool.id ? "default" : "ghost"}
                            size="sm"
                            className="h-10 w-10 p-0"
                            onClick={() => handleToolSelect(tool.id)}
                          >
                            <Icon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="flex items-center gap-2">
                            <span>{tool.label}</span>
                            <kbd className="bg-muted px-1 rounded text-xs">{tool.shortcut}</kbd>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* History Controls */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={handleUndo}
                        disabled={undoStack.length === 0}
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <span>Undo</span>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={handleRedo}
                        disabled={redoStack.length === 0}
                      >
                        <Redo2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <span>Redo</span>
                    </TooltipContent>
                  </Tooltip>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Field View Control */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 px-3 w-24 text-xs"
                        onClick={() => {
                          const currentIndex = fieldBackgrounds.findIndex(bg => bg.id === fieldBackground);
                          const nextIndex = (currentIndex + 1) % fieldBackgrounds.length;
                          setFieldBackground(fieldBackgrounds[nextIndex].id);
                        }}
                      >
                        {fieldBackgrounds.find(bg => bg.id === fieldBackground)?.label || "Field"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <span>Field View (Click to cycle)</span>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={showGrid ? "default" : "ghost"}
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => setShowGrid(!showGrid)}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <span>Toggle Grid</span>
                    </TooltipContent>
                  </Tooltip>

                  <Separator orientation="vertical" className="h-6 mx-1" />

                  {/* Team Management */}
                  <div className="flex items-center bg-muted/30 rounded-lg p-1">
                    <AddTeamDialog
                      onAddTeam={handleAddTeam}
                      canvasWidth={canvasSize.width}
                      canvasHeight={canvasSize.height}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-r-none"
                        title="Add Full Team"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </AddTeamDialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-l-none border-l border-border"
                          disabled={teamStats.home.players === 0 && teamStats.away.players === 0}
                          title="Clear Team"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {teamStats.home.players > 0 && (
                          <DropdownMenuItem onClick={() => handleClearTeam("home")}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              Clear Home Team ({teamStats.home.players})
                            </div>
                          </DropdownMenuItem>
                        )}
                        {teamStats.away.players > 0 && (
                          <DropdownMenuItem onClick={() => handleClearTeam("away")}>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              Clear Away Team ({teamStats.away.players})
                            </div>
                          </DropdownMenuItem>
                        )}
                        {teamStats.home.players > 0 && teamStats.away.players > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                handleClearTeam("home");
                                handleClearTeam("away");
                              }}
                            >
                              Clear All Teams
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}