'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Toggle } from '../ui/toggle'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Copy, 
  Edit3, 
  Trash2, 
  Clock,
  Star,
  Grid3X3,
  List
} from 'lucide-react'

interface TacticalBoard {
  id: string
  title: string
  formation: string
  phase_of_play?: string
  created_at: string
  opponent?: string
  match_date?: string
  is_template?: boolean
  objectives?: string[]
  last_used?: string
}

interface Match {
  id: string
  opponent: string
  date: string
  time: string
  venue: string
  competition: string
  status: 'upcoming' | 'completed'
  tactical_boards?: string[]
  result?: string
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

const mockMatches: Match[] = [
  {
    id: '1',
    opponent: 'City FC',
    date: '2024-01-20',
    time: '15:00',
    venue: 'Home',
    competition: 'League',
    status: 'upcoming',
    tactical_boards: ['1']
  },
  {
    id: '2',
    opponent: 'United FC',
    date: '2024-01-27',
    time: '14:30',
    venue: 'Away',
    competition: 'Cup',
    status: 'upcoming'
  },
  {
    id: '3',
    opponent: 'Rangers FC',
    date: '2024-01-13',
    time: '16:00',
    venue: 'Home',
    competition: 'League',
    status: 'completed',
    result: '2-1 W'
  }
]

const formations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '3-4-3', '5-3-2']
const phaseOptions = ['Build-up', 'Attacking', 'Defensive', 'Transition', 'Set Pieces']

interface TacticalBoardListProps {
  onEditBoard: (board: TacticalBoard) => void
  onPlanMatch?: (match: Match) => void
}

export function TacticalBoardList({ onEditBoard, onPlanMatch }: TacticalBoardListProps) {
  const [boards] = useState<TacticalBoard[]>(mockBoards)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPhase, setSelectedPhase] = useState<string>('')
  const [selectedFormation, setSelectedFormation] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const filteredBoards = boards.filter(board => {
    const matchesSearch = board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.formation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.opponent?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPhase = !selectedPhase || board.phase_of_play === selectedPhase
    const matchesFormation = !selectedFormation || board.formation === selectedFormation
    
    return matchesSearch && matchesPhase && matchesFormation
  })

  const handleCreateBoard = () => {
    // Create a new board with default values
    const newBoard: TacticalBoard = {
      id: `board_${Date.now()}`, // Generate temporary ID
      title: 'New Tactical Board',
      formation: '4-3-3',
      phase_of_play: 'Attacking',
      created_at: new Date().toISOString().split('T')[0],
      last_used: undefined,
      objectives: [],
      opponent: undefined,
      is_template: false
    }
    
    // Launch directly into the editor
    onEditBoard(newBoard)
  }

  const duplicateBoard = (board: TacticalBoard) => {
    console.log('Duplicating board:', board.id)
  }

  const deleteBoard = (boardId: string) => {
    console.log('Deleting board:', boardId)
  }

  return (
    <div className="space-y-6">
      {/* Search, Filters, and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tactical boards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedFormation || "all"} onValueChange={(value) => setSelectedFormation(value === "all" ? "" : value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Formation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {formations.map(formation => (
                    <SelectItem key={formation} value={formation}>
                      {formation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPhase || "all"} onValueChange={(value) => setSelectedPhase(value === "all" ? "" : value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {phaseOptions.map(phase => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Toggle
                  pressed={viewMode === 'grid'}
                  onPressedChange={() => setViewMode('grid')}
                  size="sm"
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={viewMode === 'table'}
                  onPressedChange={() => setViewMode('table')}
                  size="sm"
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Toggle>
              </div>
              <Button onClick={handleCreateBoard}>
                <Plus className="h-4 w-4 mr-2" />
                New Board
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tactical Boards Content */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBoards.map((board) => (
            <Card key={board.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base line-clamp-2">{board.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {board.formation}
                      </Badge>
                      {board.phase_of_play && (
                        <Badge variant="outline" className="text-xs">
                          {board.phase_of_play}
                        </Badge>
                      )}
                      {board.is_template && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditBoard(board)}>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateBoard(board)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => deleteBoard(board.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {board.objectives && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Objectives:</div>
                    <div className="flex flex-wrap gap-1">
                      {board.objectives.map((objective, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                          {objective}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {board.last_used ? `Used ${board.last_used}` : `Created ${board.created_at}`}
                  </div>
                  {board.opponent && (
                    <div className="text-xs">
                      vs {board.opponent}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Formation</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBoards.map((board) => (
                <TableRow key={board.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onEditBoard(board)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{board.title}</span>
                      {board.is_template && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {board.formation}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {board.phase_of_play && (
                      <Badge variant="outline" className="text-xs">
                        {board.phase_of_play}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {board.opponent || '-'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {board.last_used ? `Used ${board.last_used}` : `Created ${board.created_at}`}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditBoard(board); }}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateBoard(board); }}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); deleteBoard(board.id); }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredBoards.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">
              {searchTerm || selectedPhase || selectedFormation ? 
                'No boards match your filters' : 
                'No tactical boards created yet'
              }
            </div>
            <Button 
              className="mt-4" 
              onClick={handleCreateBoard}
            >
              Create Your First Board
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}