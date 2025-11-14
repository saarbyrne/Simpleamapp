"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { NoteCreationDialog } from "./note-creation-dialog";
import { NoteList } from "./note-list";
import { InsightCard } from "./insight-card";
import { 
  Plus, 
  FileText, 
  Star, 
  Calendar, 
  Brain,
  BarChart3
} from "lucide-react";
import { Note, Insight } from "./types";
import { sampleNotes, sampleInsights } from "./sample-data";

export function NotesDashboard() {
  const [notes, setNotes] = useState<Note[]>(sampleNotes);

  const handleSaveNote = (noteData: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
  };

  const handleEditNote = (note: Note) => {
    // In a real app, you'd open an edit dialog
    console.log("Edit note:", note);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const handleToggleStar = (noteId: string) => {
    setNotes(notes.map(n => 
      n.id === noteId ? { ...n, starred: !n.starred } : n
    ));
  };

  const starredNotes = notes.filter(n => n.starred);
  const totalNotes = notes.length;
  const notesThisWeek = notes.filter(n => 
    n.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Coaching Notebook</h2>
          <p className="text-muted-foreground">
            Capture insights, track progress, and improve your coaching
          </p>
        </div>
        <NoteCreationDialog onSave={handleSaveNote}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </NoteCreationDialog>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotes}</div>
            <p className="text-xs text-muted-foreground">
              All time coaching notes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notesThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Notes added recently
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{starredNotes.length}</div>
            <p className="text-xs text-muted-foreground">
              Important notes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleInsights.length}</div>
            <p className="text-xs text-muted-foreground">
              Generated insights
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Note List */}
      <NoteList
        notes={notes}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
        onToggleStar={handleToggleStar}
      />
    </div>
  );
}

export function AIInsightsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Insights</h2>
          <p className="text-muted-foreground">
            Personalized coaching recommendations based on your notes and patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Updated daily
          </span>
        </div>
      </div>

      {/* Insights by Category */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">High Priority</CardTitle>
              <Badge variant="destructive" className="text-xs">
                {sampleInsights.filter(i => i.priority === "high").length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {sampleInsights.filter(i => i.priority === "high").slice(0, 2).map((insight) => (
              <div key={insight.id} className="p-2 bg-red-50 dark:bg-red-950/20 rounded text-xs">
                <p className="font-medium">{insight.title}</p>
                <p className="text-muted-foreground line-clamp-2">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Suggestions</CardTitle>
              <Badge className="text-xs">
                {sampleInsights.filter(i => i.type === "suggestion").length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {sampleInsights.filter(i => i.type === "suggestion").slice(0, 2).map((insight) => (
              <div key={insight.id} className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs">
                <p className="font-medium">{insight.title}</p>
                <p className="text-muted-foreground line-clamp-2">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Achievements</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {sampleInsights.filter(i => i.type === "achievement").length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {sampleInsights.filter(i => i.type === "achievement").map((insight) => (
              <div key={insight.id} className="p-2 bg-green-50 dark:bg-green-950/20 rounded text-xs">
                <p className="font-medium">{insight.title}</p>
                <p className="text-muted-foreground line-clamp-2">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* All Insights */}
      <div className="space-y-4">
        <h3 className="font-medium">All Insights</h3>
        <div className="space-y-3">
          {sampleInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
}