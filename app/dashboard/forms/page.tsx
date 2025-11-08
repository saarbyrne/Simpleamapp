import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Eye, Copy, MoreHorizontal } from 'lucide-react'

const mockForms = [
  {
    id: 'FRM-101',
    title: 'Offseason Hydration Survey',
    category: 'Health & Recovery',
    status: 'Active',
    responses: 142,
    updated: 'Apr 12, 2025',
    owner: 'Ava Turner',
  },
  {
    id: 'FRM-097',
    title: 'Performance Goal Setting',
    category: 'Coaching',
    status: 'Draft',
    responses: 0,
    updated: 'Mar 28, 2025',
    owner: 'Marcus Reed',
  },
  {
    id: 'FRM-082',
    title: 'Injury Follow-up Check-in',
    category: 'Medical',
    status: 'Active',
    responses: 63,
    updated: 'Mar 25, 2025',
    owner: 'Sierra Neal',
  },
  {
    id: 'FRM-071',
    title: 'Weekly Wellness Pulse',
    category: 'Health & Recovery',
    status: 'Active',
    responses: 205,
    updated: 'Mar 20, 2025',
    owner: 'Ava Turner',
  },
  {
    id: 'FRM-055',
    title: 'Academics Progress Report',
    category: 'Education',
    status: 'Archived',
    responses: 318,
    updated: 'Feb 05, 2025',
    owner: 'Devon Kelly',
  },
]

const statusVariants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Active: 'default',
  Draft: 'secondary',
  Archived: 'outline',
}

export default function FormsPage() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-8">
      <div className="flex w-full max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)_220px]">
        <Card>
          <CardHeader>
            <CardTitle>Forms workspace</CardTitle>
            <CardDescription>Choose a form to review or edit submissions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Title</p>
              <p className="text-sm text-muted-foreground">Filters</p>
            </div>
            <div className="space-y-3">
              <Input placeholder="Search by title or owner" />
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="health">
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health & Recovery</SelectItem>
                  <SelectItem value="coaching">Coaching</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="owner">
                <SelectTrigger>
                  <SelectValue placeholder="Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Any owner</SelectItem>
                  <SelectItem value="ava">Ava Turner</SelectItem>
                  <SelectItem value="marcus">Marcus Reed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary" className="w-full">
              Apply filters
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>Forms</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Download CSV
                </Button>
                <Button size="sm">Create form</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Form</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Responses</TableHead>
                    <TableHead>Last updated</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        <div className="font-medium">{form.title}</div>
                        <p className="text-xs text-muted-foreground">{form.id}</p>
                      </TableCell>
                      <TableCell>{form.category}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[form.status] ?? 'default'}>{form.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{form.responses}</TableCell>
                      <TableCell>{form.updated}</TableCell>
                      <TableCell>{form.owner}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="size-8" aria-label="Preview form">
                            <Eye className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8" aria-label="Duplicate form">
                            <Copy className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8" aria-label="More actions">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-col gap-4 border-t pt-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {mockForms.length} forms · Updated just now
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Quick links for column controls and form utilities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-between">
                Manage columns
                <span className="text-xs text-muted-foreground">6 visible</span>
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                Share workspace
                <span className="text-xs text-muted-foreground">2 viewers</span>
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                Automation rules
                <span className="text-xs text-muted-foreground">3 active</span>
              </Button>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <p className="font-semibold uppercase text-muted-foreground">Columns</p>
              {['Category', 'Status', 'Responses', 'Last updated', 'Owner'].map((column) => (
                <Button key={column} variant="outline" size="sm" className="w-full justify-between">
                  {column}
                  <span className="text-muted-foreground">Visible</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
