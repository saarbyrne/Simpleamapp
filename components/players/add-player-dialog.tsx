"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

import { createPlayer } from "@/app/actions/players"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

export function AddPlayerDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!loading) {
      setError("")
      setOpen(nextOpen)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await createPlayer({
        ...formData,
        jerseyNumber: formData.jerseyNumber ? parseInt(formData.jerseyNumber, 10) : undefined,
        tags: [],
      })

      if (result.error) {
        setError(result.error)
        return
      }

      resetForm()
      setOpen(false)
      router.refresh()
    } catch {
      setError("Failed to create player. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Player
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl overflow-hidden p-0">
        <DialogHeader className="space-y-2 border-b border-border/60 px-6 pb-4 pt-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Players
          </p>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Add new player
          </DialogTitle>
          <DialogDescription className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Capture the baseline information you need before assigning positions, loads, and
            notes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10 px-6 pb-6 pt-4">
          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-12">
            <section className="grid gap-6 lg:grid-cols-[220px,1fr]">
              <header className="space-y-1.5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Personal details
                </h3>
                <p className="text-sm text-muted-foreground">
                  Used for communications, age verification, and their player profile.
                </p>
              </header>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Alex"
                      value={formData.firstName}
                      onChange={(event) =>
                        setFormData({ ...formData, firstName: event.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Morgan"
                      value={formData.lastName}
                      onChange={(event) => setFormData({ ...formData, lastName: event.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(event) =>
                        setFormData({ ...formData, dateOfBirth: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) => setFormData({ ...formData, nationality: value })}
                    >
                      <SelectTrigger className="justify-start">
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
                      onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 555 000 1234"
                      value={formData.phone}
                      onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[220px,1fr]">
              <header className="space-y-1.5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Team profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Aligns the player with depth charts, availability reports, and medical notes.
                </p>
              </header>
              <div className="rounded-xl border border-border/60 bg-muted/30 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="position">Primary position</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => setFormData({ ...formData, position: value })}
                    >
                      <SelectTrigger className="justify-start">
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
                      onChange={(event) =>
                        setFormData({ ...formData, jerseyNumber: event.target.value })
                      }
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
                      <SelectTrigger className="justify-start">
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
            </section>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add player"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
