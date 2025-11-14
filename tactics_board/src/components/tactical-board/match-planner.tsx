'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Progress } from '../ui/progress'
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Target,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Star,
  Play,
  BarChart3,
  Lightbulb,
  MessageSquare,
  Link2
} from 'lucide-react'

interface Match {
  id: string
  opponent: string
  date: string
  time: string
  venue: 'Home' | 'Away' | 'Neutral'
  competition: string
  status: 'preparation' | 'matchday' | 'completed'
  importance: 'low' | 'medium' | 'high'
  result?: string
  tactical_prep?: {
    formation: string
    key_objectives: string[]
    opposition_analysis: string
    expected_tactics: string
    counter_strategies: string[]
  }
  post_match?: {
    performance_rating: number
    tactical_success: string[]
    areas_to_improve: string[]
    key_moments: string[]
    player_ratings: { [key: string]: number }
    notes: string
    lessons_learned: string[]
  }
}

interface MatchPlannerProps {
  match?: Match
  onClose: () => void
  onSave: (match: Match) => void
}

const mockMatch: Match = {
  id: '1',
  opponent: 'City FC',
  date: '2024-01-20',
  time: '15:00',
  venue: 'Home',
  competition: 'League',
  status: 'preparation',
  importance: 'high',
  tactical_prep: {
    formation: '4-3-3',
    key_objectives: ['High press', 'Quick transitions', 'Exploit wide areas'],
    opposition_analysis: 'City FC typically plays a 4-4-2 low block with quick counter-attacks through the wings. They are vulnerable to overloads in central areas.',
    expected_tactics: '4-4-2 Low Block',
    counter_strategies: ['Overload central midfield', 'Switch play quickly', 'Press high to prevent transitions']
  }
}

export function MatchPlanner({ match = mockMatch, onClose, onSave }: MatchPlannerProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [matchData, setMatchData] = useState<Match>(match)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const updateMatchData = (updates: Partial<Match>) => {
    setMatchData({ ...matchData, ...updates })
  }

  const updateTacticalPrep = (updates: Partial<Match['tactical_prep']>) => {
    setMatchData({
      ...matchData,
      tactical_prep: { ...matchData.tactical_prep, ...updates } as Match['tactical_prep']
    })
  }

  const updatePostMatch = (updates: Partial<Match['post_match']>) => {
    setMatchData({
      ...matchData,
      post_match: { ...matchData.post_match, ...updates } as Match['post_match']
    })
  }

  const generateAISuggestions = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
  }

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'preparation': return 'bg-blue-500'
      case 'matchday': return 'bg-green-500'
      case 'completed': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getImportanceColor = (importance: Match['importance']) => {
    switch (importance) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(matchData.status)}`} />
                <CardTitle className="text-xl">vs {matchData.opponent}</CardTitle>
                <Badge variant={getImportanceColor(matchData.importance)}>
                  {matchData.importance} priority
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(matchData.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {matchData.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {matchData.venue}
                </div>
                <Badge variant="outline">{matchData.competition}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => onSave(matchData)}>
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tactical">Tactical Prep</TabsTrigger>
          <TabsTrigger value="analysis" disabled={matchData.status !== 'completed'}>
            Post-Match
          </TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Match Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Match Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="opponent">Opponent</Label>
                    <Input
                      id="opponent"
                      value={matchData.opponent}
                      onChange={(e) => updateMatchData({ opponent: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={matchData.date}
                        onChange={(e) => updateMatchData({ date: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={matchData.time}
                        onChange={(e) => updateMatchData({ time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Select 
                        value={matchData.venue} 
                        onValueChange={(value: 'Home' | 'Away' | 'Neutral') => updateMatchData({ venue: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Home">Home</SelectItem>
                          <SelectItem value="Away">Away</SelectItem>
                          <SelectItem value="Neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="importance">Importance</Label>
                      <Select 
                        value={matchData.importance} 
                        onValueChange={(value: 'low' | 'medium' | 'high') => updateMatchData({ importance: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preparation Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preparation Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: 'Opposition analysis completed', done: true },
                    { task: 'Tactical board created', done: true },
                    { task: 'Training sessions planned', done: false },
                    { task: 'Player briefings scheduled', done: false },
                    { task: 'Set piece strategies reviewed', done: false }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className={`text-sm ${item.done ? 'text-muted-foreground line-through' : ''}`}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Preparation Progress</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Linked Tactical Boards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Linked Tactical Boards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Main Formation - 4-3-3', phase: 'Build-up', linked: true },
                  { name: 'High Press Setup', phase: 'Defensive', linked: true },
                  { name: 'Counter Attack Plan', phase: 'Transition', linked: false }
                ].map((board, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="text-sm font-medium">{board.name}</div>
                      <div className="text-xs text-muted-foreground">{board.phase}</div>
                    </div>
                    <Button 
                      variant={board.linked ? "default" : "outline"} 
                      size="sm"
                    >
                      {board.linked ? "Linked" : "Link"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tactical" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Tactical Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Our Tactical Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="formation">Formation</Label>
                  <Select 
                    value={matchData.tactical_prep?.formation || ''} 
                    onValueChange={(value) => updateTacticalPrep({ formation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select formation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4-3-3">4-3-3</SelectItem>
                      <SelectItem value="4-4-2">4-4-2</SelectItem>
                      <SelectItem value="3-5-2">3-5-2</SelectItem>
                      <SelectItem value="4-2-3-1">4-2-3-1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="objectives">Key Objectives</Label>
                  <Textarea
                    id="objectives"
                    value={matchData.tactical_prep?.key_objectives.join(', ') || ''}
                    onChange={(e) => updateTacticalPrep({ 
                      key_objectives: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="e.g., High press, Quick transitions, Wide play"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="counter-strategies">Counter Strategies</Label>
                  <Textarea
                    id="counter-strategies"
                    value={matchData.tactical_prep?.counter_strategies.join(', ') || ''}
                    onChange={(e) => updateTacticalPrep({ 
                      counter_strategies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="Specific tactics to counter opposition"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Opposition Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Opposition Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="expected-tactics">Expected Formation/Tactics</Label>
                  <Input
                    id="expected-tactics"
                    value={matchData.tactical_prep?.expected_tactics || ''}
                    onChange={(e) => updateTacticalPrep({ expected_tactics: e.target.value })}
                    placeholder="e.g., 4-4-2 Low Block"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="opposition-analysis">Tactical Analysis</Label>
                  <Textarea
                    id="opposition-analysis"
                    value={matchData.tactical_prep?.opposition_analysis || ''}
                    onChange={(e) => updateTacticalPrep({ opposition_analysis: e.target.value })}
                    placeholder="Detailed analysis of opposition's strengths, weaknesses, and typical approach"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Tactical Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Tactical Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium text-green-600">Exploit</Label>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs bg-green-50 p-2 rounded">Weak left-back defending</div>
                    <div className="text-xs bg-green-50 p-2 rounded">Slow transitions</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-yellow-600">Be Aware</Label>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs bg-yellow-50 p-2 rounded">Strong aerial presence</div>
                    <div className="text-xs bg-yellow-50 p-2 rounded">Quick counter-attacks</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-red-600">Neutralize</Label>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs bg-red-50 p-2 rounded">Playmaker #10</div>
                    <div className="text-xs bg-red-50 p-2 rounded">Set piece threats</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Overall Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Match Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="result">Final Result</Label>
                  <Input
                    id="result"
                    value={matchData.result || ''}
                    onChange={(e) => updateMatchData({ result: e.target.value })}
                    placeholder="e.g., 2-1 W, 0-0 D, 1-3 L"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="performance-rating">Overall Performance Rating</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => updatePostMatch({ performance_rating: rating })}
                        >
                          <Star 
                            className={`h-5 w-5 ${
                              rating <= (matchData.post_match?.performance_rating || 0) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {matchData.post_match?.performance_rating || 0}/5
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="match-notes">Match Notes</Label>
                  <Textarea
                    id="match-notes"
                    value={matchData.post_match?.notes || ''}
                    onChange={(e) => updatePostMatch({ notes: e.target.value })}
                    placeholder="Overall observations about the match"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tactical Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tactical Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="tactical-success">What Worked Well</Label>
                  <Textarea
                    id="tactical-success"
                    value={matchData.post_match?.tactical_success.join(', ') || ''}
                    onChange={(e) => updatePostMatch({ 
                      tactical_success: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="Successful tactical elements"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="areas-improve">Areas to Improve</Label>
                  <Textarea
                    id="areas-improve"
                    value={matchData.post_match?.areas_to_improve.join(', ') || ''}
                    onChange={(e) => updatePostMatch({ 
                      areas_to_improve: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="Tactical aspects that need work"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="key-moments">Key Moments</Label>
                  <Textarea
                    id="key-moments"
                    value={matchData.post_match?.key_moments.join(', ') || ''}
                    onChange={(e) => updatePostMatch({ 
                      key_moments: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="Decisive moments that changed the game"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lessons Learned */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Lessons Learned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={matchData.post_match?.lessons_learned.join('\n') || ''}
                onChange={(e) => updatePostMatch({ 
                  lessons_learned: e.target.value.split('\n').filter(Boolean) 
                })}
                placeholder="Key lessons and insights for future matches"
                rows={4}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                AI Tactical Analysis
              </CardTitle>
              <CardDescription>
                Get intelligent suggestions and tactical insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateAISuggestions} disabled={isAnalyzing} className="w-full">
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate AI Insights
                  </>
                )}
              </Button>

              {!isAnalyzing && (
                <div className="space-y-4">
                  {/* Mock AI Insights */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-medium text-sm mb-2">Tactical Recommendation</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on City FC's recent matches, they struggle against teams that press high in the first 15 minutes. 
                      Consider starting with an aggressive pressing setup before transitioning to your planned approach.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h4 className="font-medium text-sm mb-2">Formation Advantage</h4>
                    <p className="text-sm text-muted-foreground">
                      Your 4-3-3 formation has a 73% win rate against teams playing 4-4-2. Focus on exploiting the wide areas 
                      where you have numerical advantages.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-yellow-50">
                    <h4 className="font-medium text-sm mb-2">Player Matchups</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider man-marking their playmaker (#10) with your defensive midfielder. 
                      This tactic reduced their chance creation by 40% in similar matchups.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}