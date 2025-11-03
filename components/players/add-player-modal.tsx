"use client"

/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from "react"
import { UserPlus, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { createPlayer } from "@/app/actions/players"
import { uploadPlayerPhoto } from "@/lib/storage/upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const positions = [
  "Forward",
  "Midfielder",
  "Defender",
  "Goalkeeper",
  "Winger",
  "Striker",
  "Center Back",
  "Full Back",
  "Attacking Midfielder",
  "Defensive Midfielder",
]

const nationalities = [
  "USA",
  "England",
  "Spain",
  "France",
  "Germany",
  "Brazil",
  "Argentina",
  "Portugal",
  "Italy",
  "Netherlands",
  "Belgium",
  "Mexico",
  "Canada",
  "Australia",
  "Japan",
  "South Korea",
  "China",
  "Egypt",
  "Nigeria",
  "South Africa",
]

export function AddPlayerModal() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    phone: "",
    email: "",
    position: "",
    jerseyNumber: "",
    status: "active" as "active" | "injured",
  })

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      phone: "",
      email: "",
      position: "",
      jerseyNumber: "",
      status: "active",
    })
    setPhotoFile(null)
    setPhotoPreview(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.')
      return
    }

    setPhotoFile(file)
    setError("")

    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      let photoUrl: string | undefined

      if (photoFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', photoFile)
        const uploadResult = await uploadPlayerPhoto(formDataUpload)

        if (uploadResult.error) {
          setError(uploadResult.error)
          setLoading(false)
          return
        }

        photoUrl = uploadResult.url
      }

      const result = await createPlayer({
        ...formData,
        photo: photoUrl,
        jerseyNumber: formData.jerseyNumber ? parseInt(formData.jerseyNumber, 10) : undefined,
        tags: [],
      })

      if (result.error) {
        setError(result.error)
        return
      }

      resetForm()
      setIsOpen(false)
      router.refresh()
    } catch {
      setError("Failed to create player. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Add new player</DialogTitle>
          <DialogDescription>
            Capture the baseline information you need before assigning positions, loads, and notes.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)] px-6">
          <form onSubmit={handleSubmit} id="add-player-form" className="space-y-6 pb-6">
            {error && (
              <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Personal details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Alex"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Morgan"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => setFormData({ ...formData, nationality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map((nat) => (
                        <SelectItem key={nat} value={nat}>
                          {nat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="player@club.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 000 1234"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="photo">Player Photo</Label>
                  <div className="flex items-center gap-4">
                    {photoPreview && (
                      <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="photo"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                      <p className="mt-2 text-xs text-gray-500">
                        JPEG, PNG or WebP. Max 5MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Team profile</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="position">Primary position</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jerseyNumber">Jersey number</Label>
                  <Input
                    id="jerseyNumber"
                    type="number"
                    min="0"
                    max="99"
                    placeholder="21"
                    value={formData.jerseyNumber}
                    onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "injured") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Available</SelectItem>
                      <SelectItem value="injured">Injured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="add-player-form" disabled={loading}>
            {loading ? "Adding..." : "Add player"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
