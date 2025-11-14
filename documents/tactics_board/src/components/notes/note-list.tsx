"use client";

import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Search,
  Grid3X3,
  List,
  Columns,
  Mic,
  Image as ImageIcon,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  StarOff,
} from "lucide-react";
import { formatDistanceToNow } from "../../lib/date-utils";
import { Note } from "./types";

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onToggleStar: (noteId: string) => void;
}

type ViewMode = "table" | "card" | "master-detail";
type SortBy = "created" | "updated" | "title" | "priority";

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function NoteList({ notes, onEdit, onDelete, onToggleStar }: NoteListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("created");
  const [showStarred, setShowStarred] = useState(false);

  // Get all unique categories and tags
  const categories = useMemo(() => {
    return Array.from(new Set(notes.map(note => note.category))).filter(Boolean);
  }, [notes]);

  const allTags = useMemo(() => {
    return Array.from(new Set(notes.flatMap(note => note.tags)));
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let filtered = notes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !categoryFilter || note.category === categoryFilter;
      const matchesTag = !tagFilter || note.tags.includes(tagFilter);
      const matchesPriority = !priorityFilter || note.priority === priorityFilter;
      const matchesStarred = !showStarred || note.starred;

      return matchesSearch && matchesCategory && matchesTag && matchesPriority && matchesStarred;
    });

    // Sort notes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "updated":
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case "created":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  }, [notes, searchQuery, categoryFilter, tagFilter, priorityFilter, showStarred, sortBy]);

  const NoteCard = ({ note }: { note: Note }) => (
    <Card 
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
        selectedNote?.id === note.id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => setSelectedNote(note)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{note.title}</h3>
              {note.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(note)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStar(note.id)}>
                {note.starred ? (
                  <>
                    <StarOff className="h-4 w-4 mr-2" />
                    Unstar
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Star
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(note.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${priorityColors[note.priority]}`}>
            {note.priority}
          </Badge>
          {note.category && (
            <Badge variant="outline" className="text-xs">
              {note.category}
            </Badge>
          )}
          {note.voiceNote && <Mic className="h-3 w-3 text-muted-foreground" />}
          {note.images && note.images.length > 0 && (
            <ImageIcon className="h-3 w-3 text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex gap-1 flex-wrap">
            {note.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
          <span className="shrink-0">
            {formatDistanceToNow(note.createdAt)}
          </span>
        </div>
      </div>
    </Card>
  );

  const TableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredNotes.map((note) => (
          <TableRow 
            key={note.id}
            className="cursor-pointer"
            onClick={() => setSelectedNote(note)}
          >
            <TableCell>
              <div className="flex items-center gap-2">
                <div>
                  <div className="font-medium">{note.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {note.content}
                  </div>
                </div>
                {note.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                {note.voiceNote && <Mic className="h-3 w-3 text-muted-foreground" />}
                {note.images && note.images.length > 0 && (
                  <ImageIcon className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            </TableCell>
            <TableCell>
              {note.category && (
                <Badge variant="outline" className="text-xs">
                  {note.category}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <Badge className={`text-xs ${priorityColors[note.priority]}`}>
                {note.priority}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {note.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {note.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{note.tags.length - 2}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDistanceToNow(note.createdAt)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(note)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleStar(note.id)}>
                    {note.starred ? (
                      <>
                        <StarOff className="h-4 w-4 mr-2" />
                        Unstar
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Star
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(note.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const NoteDetail = ({ note }: { note: Note }) => (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold">{note.title}</h2>
            {note.starred && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Badge className={`text-xs ${priorityColors[note.priority]}`}>
              {note.priority}
            </Badge>
            {note.category && (
              <Badge variant="outline" className="text-xs">
                {note.category}
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(note)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStar(note.id)}>
              {note.starred ? (
                <>
                  <StarOff className="h-4 w-4 mr-2" />
                  Unstar
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-2" />
                  Star
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(note.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="prose prose-sm max-w-none">
        <p className="whitespace-pre-wrap">{note.content}</p>
      </div>

      {note.voiceNote && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="h-4 w-4" />
            <span className="font-medium">Voice Note</span>
          </div>
          <audio controls className="w-full">
            <source src={note.voiceNote} type="audio/mp3" />
          </audio>
        </div>
      )}

      {note.images && note.images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="font-medium">Images</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {note.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Note image ${index + 1}`}
                className="w-full h-32 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}

      {note.tags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Tags</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {note.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground pt-4 border-t">
        <p>Created {formatDistanceToNow(note.createdAt)}</p>
        <p>Updated {formatDistanceToNow(note.updatedAt)}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={showStarred ? "default" : "outline"}
            size="sm"
            onClick={() => setShowStarred(!showStarred)}
            className="shrink-0"
          >
            <Star className="h-4 w-4 mr-1" />
            Starred
          </Button>

          <Select value={categoryFilter || undefined} onValueChange={(value) => setCategoryFilter(value || "")}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tagFilter || undefined} onValueChange={(value) => setTagFilter(value || "")}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priorityFilter || undefined} onValueChange={(value) => setPriorityFilter(value || "")}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "master-detail" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("master-detail")}
            >
              <Columns className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No notes found matching your criteria.</p>
        </div>
      ) : (
        <>
          {viewMode === "card" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}

          {viewMode === "table" && <TableView />}

          {viewMode === "master-detail" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
              <div className="space-y-2">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className={`p-3 cursor-pointer hover:shadow-sm transition-shadow ${
                      selectedNote?.id === note.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedNote(note)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{note.title}</h4>
                          {note.starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                          {note.voiceNote && <Mic className="h-3 w-3 text-muted-foreground" />}
                          {note.images && note.images.length > 0 && (
                            <ImageIcon className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {note.content}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${priorityColors[note.priority]}`}>
                            {note.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(note.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="border rounded-lg p-4">
                {selectedNote ? (
                  <NoteDetail note={selectedNote} />
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Select a note to view details
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}