import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table@8.20.5";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  UserPlus,
  Mail,
  Edit,
} from "lucide-react@0.487.0";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type Player = {
  id: string;
  name: string;
  position: string;
  status: "active" | "injured";
  nationality: string;
  tags: string[];
  avatar: string;
};

const countryFlags: Record<string, string> = {
  USA: "🇺🇸",
  Spain: "🇪🇸",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  China: "🇨🇳",
  Egypt: "🇪🇬",
  Brazil: "🇧🇷",
  Australia: "🇦🇺",
  Japan: "🇯🇵",
};

const data: Player[] = [
  {
    id: "1",
    name: "Marcus Johnson",
    position: "Forward",
    status: "active",
    nationality: "USA",
    tags: ["Captain", "Starter"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
  },
  {
    id: "2",
    name: "Elena Rodriguez",
    position: "Midfielder",
    status: "injured",
    nationality: "Spain",
    tags: ["Starter"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
  },
  {
    id: "3",
    name: "James Wilson",
    position: "Defender",
    status: "active",
    nationality: "England",
    tags: ["Reserve"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  {
    id: "4",
    name: "Sophie Chen",
    position: "Goalkeeper",
    status: "active",
    nationality: "China",
    tags: ["Starter", "Young Talent"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
  },
  {
    id: "5",
    name: "Ahmed Hassan",
    position: "Midfielder",
    status: "active",
    nationality: "Egypt",
    tags: ["Captain", "Starter"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
  },
  {
    id: "6",
    name: "Isabella Santos",
    position: "Forward",
    status: "injured",
    nationality: "Brazil",
    tags: ["Reserve"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
  },
  {
    id: "7",
    name: "Oliver Brown",
    position: "Defender",
    status: "active",
    nationality: "Australia",
    tags: ["Starter"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  },
  {
    id: "8",
    name: "Yuki Tanaka",
    position: "Midfielder",
    status: "active",
    nationality: "Japan",
    tags: ["Reserve", "Young Talent"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
  },
];

interface PlayersTableProps {
  onPlayerClick?: (playerId: string, playerName: string) => void;
}

export function PlayersTable({ onPlayerClick }: PlayersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Player>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Player Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar} alt={row.getValue("name")} />
            <AvatarFallback>{row.getValue<string>("name").slice(0, 2)}</AvatarFallback>
          </Avatar>
          <button
            onClick={() => onPlayerClick?.(row.original.id, row.original.name)}
            className="hover:underline cursor-pointer"
          >
            {row.getValue("name")}
          </button>
        </div>
      ),
    },
    {
      accessorKey: "position",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Position
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("position")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "injured" ? "destructive" : "default"} className={status === "active" ? "bg-green-600 hover:bg-green-600" : ""}>
            {status === "injured" ? "Injured" : "Available"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "nationality",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Nationality
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const nationality = row.getValue("nationality") as string;
        const flag = countryFlags[nationality] || "🏳️";
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">{flag}</span>
            <span>{nationality}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[];
        return (
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const player = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(player.id)}>
                Copy player ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onPlayerClick?.(player.id, player.name)}>
                <Edit className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete player
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Filter players..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={(table.getColumn("position")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) =>
              table.getColumn("position")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              <SelectItem value="Forward">Forward</SelectItem>
              <SelectItem value="Midfielder">Midfielder</SelectItem>
              <SelectItem value="Defender">Defender</SelectItem>
              <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Available</SelectItem>
              <SelectItem value="injured">Injured</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={(table.getColumn("nationality")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) =>
              table.getColumn("nationality")?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Nationality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="USA">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <span>USA</span>
                </div>
              </SelectItem>
              <SelectItem value="Spain">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇪🇸</span>
                  <span>Spain</span>
                </div>
              </SelectItem>
              <SelectItem value="England">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                  <span>England</span>
                </div>
              </SelectItem>
              <SelectItem value="China">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇨🇳</span>
                  <span>China</span>
                </div>
              </SelectItem>
              <SelectItem value="Egypt">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇪🇬</span>
                  <span>Egypt</span>
                </div>
              </SelectItem>
              <SelectItem value="Brazil">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇧🇷</span>
                  <span>Brazil</span>
                </div>
              </SelectItem>
              <SelectItem value="Australia">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇦🇺</span>
                  <span>Australia</span>
                </div>
              </SelectItem>
              <SelectItem value="Japan">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇯🇵</span>
                  <span>Japan</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedRowsCount > 0 && (
        <div className="flex items-center justify-between rounded-md border border-border bg-muted/50 px-4 py-2">
          <div className="text-sm">
            {selectedRowsCount} of {table.getFilteredRowModel().rows.length} row(s) selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Message selected
            </Button>
            <Button variant="outline" size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add to group
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete selected
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedRowsCount} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
