"use client";

import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Tag,
  Save,
  Loader2,
} from "lucide-react";
import { Note } from "./types";

interface NoteCreationDialogProps {
  onSave: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  children: React.ReactNode;
}

const categories = [
  "Tactical Analysis",
  "Training Session",
  "Player Development", 
  "Match Preparation",
  "Opposition Analysis",
  "Team Management",
  "Personal Reflection",
];

const suggestedTags = [
  "formations",
  "pressing",
  "build-up",
  "set-pieces",
  "player-feedback",
  "match-prep",
  "drill-ideas",
  "analysis",
  "urgent",
  "follow-up",
];

export function NoteCreationDialog({ onSave, children }: NoteCreationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [voiceNote, setVoiceNote] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload to storage and get URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          // In a real app, you'd upload the audio blob
          setVoiceNote("voice-recording-url");
        }
      });

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave({
      title,
      content,
      tags,
      category,
      priority,
      voiceNote: voiceNote || undefined,
      images: images.length > 0 ? images : undefined,
    });

    // Reset form
    setTitle("");
    setContent("");
    setTags([]);
    setCategory("");
    setPriority("medium");
    setImages([]);
    setVoiceNote("");
    setNewTag("");
    
    setIsSaving(false);
    setIsOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags([]);
    setCategory("");
    setPriority("medium");
    setImages([]);
    setVoiceNote("");
    setNewTag("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Coaching Note</DialogTitle>
          <DialogDescription>
            Capture your insights, observations, and tactical thoughts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., High press vs low block analysis..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
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

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Your observations, tactical insights, player notes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Voice Recording */}
          <div className="space-y-2">
            <Label>Voice Note</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className="flex items-center gap-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Record Voice Note
                  </>
                )}
              </Button>
              {voiceNote && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Voice recorded
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setVoiceNote("")}
                  />
                </Badge>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Images</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Add Images
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-1 flex-wrap mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTag);
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddTag(newTag)}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-1 flex-wrap">
              {suggestedTags.filter(tag => !tags.includes(tag)).slice(0, 6).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handleAddTag(tag)}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}