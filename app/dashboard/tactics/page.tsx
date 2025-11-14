'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Target } from 'lucide-react'
import { TacticalBoardEditor } from '@/components/tactics/tactical-board-editor'

// Mock data for tactics boards
interface TacticalBoard {
  id: string
  title: string
  formation: string
  phase_of_play?: string
  created_at: string
  opponent?: string
  match_date?: string
  objectives?: string[]
  last_used?: string
  is_template?: boolean
}

const mockBoards: TacticalBoard[] = [
  {
    id: '1',
    title: '4-3-3 High Press vs Low Block',
    formation: '4-3-3',
    phase_of_play: 'Attacking',
    created_at: '2024-01-15',
    opponent: 'City FC',
    match_date: '2024-01-20',
    objectives: ['High press', 'Quick transitions', 'Wide play'],
    last_used: '2024-01-18'
  },
  {
    id: '2',
    title: 'Defensive Shape - Low Block',
    formation: '4-4-2',
    phase_of_play: 'Defensive',
    created_at: '2024-01-12',
    is_template: true,
    objectives: ['Compact shape', 'Counter-attack prep']
  },
  {
    id: '3',
    title: 'Build-up Play from GK',
    formation: '4-3-3',
    phase_of_play: 'Build-up',
    created_at: '2024-01-10',
    objectives: ['Progressive passing', 'Overload midfield']
  }
]


export default function TacticsPage() {
  const [boards, setBoards] = useState<TacticalBoard[]>(mockBoards)
  const [editingBoard, setEditingBoard] = useState<TacticalBoard | null>(null)

  const handleCreateBoard = () => {
    const newBoard: TacticalBoard = {
      id: `board_${Date.now()}`,
      title: 'New Tactical Board',
      formation: '4-3-3',
      phase_of_play: 'Attacking',
      created_at: new Date().toISOString().split('T')[0],
      objectives: [],
    }
    setEditingBoard(newBoard)
  }

  const handleEditBoard = (board: TacticalBoard) => {
    setEditingBoard(board)
  }

  const handleSaveBoard = (updatedBoard: TacticalBoard) => {
    setBoards(prev => {
      const existingIndex = prev.findIndex(b => b.id === updatedBoard.id)
      if (existingIndex >= 0) {
        // Update existing board
        const updated = [...prev]
        updated[existingIndex] = updatedBoard
        return updated
      } else {
        // Add new board
        return [...prev, updatedBoard]
      }
    })
    setEditingBoard(null)
  }

  const handleBackFromEditor = () => {
    setEditingBoard(null)
  }

  if (editingBoard) {
    return (
      <TacticalBoardEditor
        board={editingBoard}
        onBack={handleBackFromEditor}
        onSave={handleSaveBoard}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tactics</h1>
          <p className="text-muted-foreground">
            Create and manage tactical boards for match preparation
          </p>
        </div>
        <Button onClick={handleCreateBoard}>
          <Plus className="h-4 w-4 mr-2" />
          New Board
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Title</th>
              <th className="text-left p-4 font-medium">Formation</th>
              <th className="text-left p-4 font-medium">Phase</th>
              <th className="text-left p-4 font-medium">Opponent</th>
              <th className="text-left p-4 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board) => (
              <tr
                key={board.id}
                className="border-b hover:bg-muted/50 cursor-pointer"
                onClick={() => handleEditBoard(board)}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{board.title}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {board.formation}
                  </span>
                </td>
                <td className="p-4">
                  {board.phase_of_play && (
                    <span className="text-sm text-muted-foreground">{board.phase_of_play}</span>
                  )}
                </td>
                <td className="p-4">
                  {board.opponent && (
                    <span className="text-sm">vs {board.opponent}</span>
                  )}
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(board.created_at).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {boards.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tactics boards yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first tactical board to start planning strategies
          </p>
          <Button onClick={handleCreateBoard}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Board
          </Button>
        </div>
      )}
    </div>
  )
}
