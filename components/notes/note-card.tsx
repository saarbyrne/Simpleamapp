'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RichTextViewer } from './rich-text-editor'
import { MoreVertical, Edit, Trash2, User, Calendar } from 'lucide-react'
import { NoteWithAuthor } from '@/app/actions/notes'
import Link from 'next/link'

interface NoteCardProps {
  note: NoteWithAuthor
  currentUserId?: string
  onEdit?: (note: NoteWithAuthor) => void
  onDelete?: (noteId: string) => void
  showLinkedEntities?: boolean
}

const visibilityConfig = {
  public: {
    label: 'Public',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  medical: {
    label: 'Medical',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  mental_health: {
    label: 'Mental Health',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  coaches: {
    label: 'Coaches',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  private: {
    label: 'Private',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  },
}

export function NoteCard({
  note,
  currentUserId,
  onEdit,
  onDelete,
  showLinkedEntities = true,
}: NoteCardProps) {
  const isAuthor = currentUserId === note.author.id
  const visibilityInfo = visibilityConfig[note.privacyLevel as keyof typeof visibilityConfig] || {
    label: note.privacyLevel,
    color: 'bg-gray-100 text-gray-800',
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-10 w-10">
              {note.author.avatar ? (
                <AvatarImage src={note.author.avatar} alt={note.author.name} />
              ) : (
                <AvatarFallback>
                  {note.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{note.author.name}</span>
                <Badge className={visibilityInfo.color}>{visibilityInfo.label}</Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </span>
              </div>

              {note.title && (
                <h3 className="font-semibold text-lg leading-tight">{note.title}</h3>
              )}

              {showLinkedEntities && (
                <>
                  {/* Legacy linked entities */}
                  {(note.linkedPerson || note.linkedEvent) && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {note.linkedPerson && (
                        <Link
                          href={`/dashboard/players/${note.linkedPerson.id}`}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <User className="h-3 w-3" />
                          {note.linkedPerson.firstName} {note.linkedPerson.lastName}
                        </Link>
                      )}
                      {note.linkedEvent && (
                        <Link
                          href={`/dashboard/calendar/events/${note.linkedEvent.id}`}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Calendar className="h-3 w-3" />
                          {note.linkedEvent.title}
                        </Link>
                      )}
                    </div>
                  )}
                  
                  {/* New multi-entity links */}
                  {note.links && note.links.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {note.links.filter(link => link.targetType === 'person').length > 0 && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <User className="h-3 w-3" />
                          {note.links.filter(link => link.targetType === 'person').length} 
                          {note.links.filter(link => link.targetType === 'person').length === 1 ? ' Player' : ' Players'}
                        </Badge>
                      )}
                      {note.links.filter(link => link.targetType === 'event').length > 0 && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Calendar className="h-3 w-3" />
                          {note.links.filter(link => link.targetType === 'event').length} 
                          {note.links.filter(link => link.targetType === 'event').length === 1 ? ' Event' : ' Events'}
                        </Badge>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {isAuthor && (onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(note)}>
                    <Edit className="me-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(note.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="me-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <RichTextViewer content={note.content} />

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
