"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
} from "lucide-react";
import { useAuth } from "../auth/auth-provider";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner@2.0.3";

interface Player {
  id: string;
  name: string;
  jersey_number?: number;
  position: string;
  age?: number;
  status: "active" | "injured" | "suspended" | "inactive";
  team_id: string;
  coach_id: string;
  created_at: string;
}

const POSITIONS = [
  "Goalkeeper",
  "Right Back",
  "Centre Back",
  "Left Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Right Winger",
  "Left Winger",
  "Centre Forward",
  "Striker",
];

const STATUS_OPTIONS = [
  {
    value: "active",
    label: "Active",
    variant: "default" as const,
  },
  {
    value: "injured",
    label: "Injured",
    variant: "destructive" as const,
  },
  {
    value: "suspended",
    label: "Suspended",
    variant: "secondary" as const,
  },
  {
    value: "inactive",
    label: "Inactive",
    variant: "outline" as const,
  },
];

export function PlayerManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] =
    useState<string>("all");
  const [selectedStatus, setSelectedStatus] =
    useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] =
    useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    jersey_number: "",
    position: "",
    age: "",
    status: "active" as Player["status"],
  });

  // Fetch players
  const { data: players = [], isLoading } = useQuery({
    queryKey: ["players", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("coach_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Player[];
    },
    enabled: !!user?.id,
  });

  // Add player mutation
  const addPlayerMutation = useMutation({
    mutationFn: async (
      playerData: Omit<Player, "id" | "created_at">,
    ) => {
      const { data, error } = await supabase
        .from("players")
        .insert([playerData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player added successfully");
      setIsAddDialogOpen(false);
      setNewPlayer({
        name: "",
        jersey_number: "",
        position: "",
        age: "",
        status: "active",
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add player");
    },
  });

  // Update player mutation
  const updatePlayerMutation = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Player> & { id: string }) => {
      const { data, error } = await supabase
        .from("players")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player updated successfully");
      setEditingPlayer(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update player");
    },
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", playerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete player");
    },
  });

  const handleAddPlayer = () => {
    if (!user?.id) return;

    const playerData = {
      name: newPlayer.name,
      jersey_number: newPlayer.jersey_number
        ? parseInt(newPlayer.jersey_number)
        : undefined,
      position: newPlayer.position,
      age: newPlayer.age ? parseInt(newPlayer.age) : undefined,
      status: newPlayer.status,
      team_id: user.team_id || "default-team",
      coach_id: user.id,
    };

    addPlayerMutation.mutate(playerData);
  };

  const handleUpdatePlayer = (updates: Partial<Player>) => {
    if (!editingPlayer) return;
    updatePlayerMutation.mutate({
      id: editingPlayer.id,
      ...updates,
    });
  };

  const handleDeletePlayer = (playerId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this player?",
      )
    ) {
      deletePlayerMutation.mutate(playerId);
    }
  };

  // Filter players based on search and filters
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPosition =
      selectedPosition === "all" ||
      player.position === selectedPosition;
    const matchesStatus =
      selectedStatus === "all" ||
      player.status === selectedStatus;

    return matchesSearch && matchesPosition && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Player Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedPosition}
              onValueChange={setSelectedPosition}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All positions
                </SelectItem>
                {POSITIONS.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Player
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Player</DialogTitle>
                  <DialogDescription>
                    Add a new player to your squad
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="player-name">Name</Label>
                    <Input
                      id="player-name"
                      value={newPlayer.name}
                      onChange={(e) =>
                        setNewPlayer((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Player name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select
                      value={newPlayer.position}
                      onValueChange={(value) =>
                        setNewPlayer((prev) => ({
                          ...prev,
                          position: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map((position) => (
                          <SelectItem
                            key={position}
                            value={position}
                          >
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newPlayer.status}
                      onValueChange={(
                        value: Player["status"],
                      ) =>
                        setNewPlayer((prev) => ({
                          ...prev,
                          status: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem
                            key={status.value}
                            value={status.value}
                          >
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleAddPlayer}
                    className="w-full"
                    disabled={
                      !newPlayer.name ||
                      !newPlayer.position ||
                      addPlayerMutation.isPending
                    }
                  >
                    {addPlayerMutation.isPending
                      ? "Adding..."
                      : "Add Player"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Players Table */}
          {isLoading ? (
            <div className="text-center py-8">
              Loading players...
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {players.length === 0
                ? "No players added yet"
                : "No players match your filters"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-20">#</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="w-16">Age</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">
                        {player.name}
                      </TableCell>
                      <TableCell>
                        {player.jersey_number || "-"}
                      </TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell>{player.age || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            STATUS_OPTIONS.find(
                              (s) => s.value === player.status,
                            )?.variant
                          }
                        >
                          {
                            STATUS_OPTIONS.find(
                              (s) => s.value === player.status,
                            )?.label
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setEditingPlayer(player)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeletePlayer(player.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Player Dialog */}
      <Dialog
        open={!!editingPlayer}
        onOpenChange={() => setEditingPlayer(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>
              Update player information
            </DialogDescription>
          </DialogHeader>
          {editingPlayer && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editingPlayer.name}
                  onChange={(e) =>
                    setEditingPlayer((prev) =>
                      prev
                        ? { ...prev, name: e.target.value }
                        : null,
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jersey Number</Label>
                  <Input
                    type="number"
                    value={editingPlayer.jersey_number || ""}
                    onChange={(e) =>
                      setEditingPlayer((prev) =>
                        prev
                          ? {
                              ...prev,
                              jersey_number: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={editingPlayer.age || ""}
                    onChange={(e) =>
                      setEditingPlayer((prev) =>
                        prev
                          ? {
                              ...prev,
                              age: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            }
                          : null,
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Select
                  value={editingPlayer.position}
                  onValueChange={(value) =>
                    setEditingPlayer((prev) =>
                      prev
                        ? { ...prev, position: value }
                        : null,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POSITIONS.map((position) => (
                      <SelectItem
                        key={position}
                        value={position}
                      >
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editingPlayer.status}
                  onValueChange={(value: Player["status"]) =>
                    setEditingPlayer((prev) =>
                      prev ? { ...prev, status: value } : null,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() =>
                  handleUpdatePlayer(editingPlayer)
                }
                className="w-full"
                disabled={updatePlayerMutation.isPending}
              >
                {updatePlayerMutation.isPending
                  ? "Updating..."
                  : "Update Player"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}