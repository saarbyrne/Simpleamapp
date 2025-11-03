"use client"

import { useState } from "react"
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Hash, Activity, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deletePlayer } from "@/app/actions/players"

interface PlayerProfileProps {
  player: {
    id: string
    firstName: string
    lastName: string
    dateOfBirth: Date | null
    nationality: string | null
    phone: string | null
    email: string | null
    photo: string | null
    position: string | null
    jerseyNumber: number | null
    status: 'active' | 'injured'
    tags: string[]
    joinedAt: Date
  }
}

export function PlayerProfile({ player }: PlayerProfileProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fullName = `${player.firstName} ${player.lastName}`
  const initials = `${player.firstName[0]}${player.lastName[0]}`
  const age = player.dateOfBirth
    ? Math.floor((Date.now() - player.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null

  const handleDelete = async () => {
    setLoading(true)
    const result = await deletePlayer(player.id)

    if (result.error) {
      alert(result.error)
      setLoading(false)
      return
    }

    router.push('/dashboard/players')
    router.refresh()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/players">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
            <p className="text-sm text-muted-foreground">
              {player.position || 'No position'} {player.jerseyNumber && `#${player.jerseyNumber}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Player</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {fullName}? This action cannot be undone.
              All associated data including forms, attendance records, and notes will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? 'Deleting...' : 'Delete Player'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={player.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.firstName}`}
                alt={fullName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {/* Details Grid */}
            <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {player.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{player.email}</p>
                  </div>
                </div>
              )}

              {player.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm">{player.phone}</p>
                  </div>
                </div>
              )}

              {player.dateOfBirth && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="text-sm">{age} years old</p>
                  </div>
                </div>
              )}

              {player.nationality && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Nationality</p>
                    <p className="text-sm">{player.nationality}</p>
                  </div>
                </div>
              )}

              {player.jerseyNumber && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Jersey Number</p>
                    <p className="text-sm">{player.jerseyNumber}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={player.status === 'active' ? 'default' : 'destructive'}>
                    {player.status === 'active' ? 'Available' : 'Injured'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {player.tags && player.tags.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-2">
                {player.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Player&apos;s personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">First Name</p>
                  <p className="text-lg">{player.firstName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                  <p className="text-lg">{player.lastName}</p>
                </div>
                {player.dateOfBirth && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                    <p className="text-lg">
                      {new Date(player.dateOfBirth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined Team</p>
                  <p className="text-lg">
                    {new Date(player.joinedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
              <CardDescription>Player&apos;s role and status within the team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Position</p>
                  <p className="text-lg">{player.position || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jersey Number</p>
                  <p className="text-lg">{player.jerseyNumber || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Availability Status</p>
                  <Badge variant={player.status === 'active' ? 'default' : 'destructive'}>
                    {player.status === 'active' ? 'Available' : 'Injured'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Statistics</CardTitle>
              <CardDescription>Track player performance metrics and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Statistics tracking will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>Injury history, wellness checks, and medical notes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Medical records will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Player&apos;s activity log and change history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Activity history will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
