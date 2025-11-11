'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageCard } from '@/components/ui/page-card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/date-utils'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { Label } from '@/components/ui/label'
import type { FormWithDetails } from '@/app/actions/forms'

interface FormResponse {
  id: string
  personOrg: {
    id: string
    person: {
      id: string
      firstName: string
      lastName: string
      email: string | null
      photo: string | null
    }
  }
  user: {
    id: string
    name: string | null
    email: string | null
  } | null
  responses: Record<string, any>
  submittedAt: Date
}

interface FormResponsesTableProps {
  form: FormWithDetails
  responses: FormResponse[]
  total: number
  page: number
  pageSize: number
}

export function FormResponsesTable({
  form,
  responses,
  total,
  page,
  pageSize,
}: FormResponsesTableProps) {
  const router = useRouter()
  const { preferences } = useUserPreferences()
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null)

  const totalPages = Math.ceil(total / pageSize)
  const schema = form.schema as any
  const fields = schema?.fields || []

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/forms/${form.id}/responses?page=${newPage}&pageSize=${pageSize}`)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/dashboard/forms/${form.id}/responses?page=0&pageSize=${newPageSize}`)
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      <PageCard
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard/forms')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{form.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {form.description || 'Form responses'}
              </p>
            </div>
          </div>
        }
        headerActions={
          <div className="flex items-center gap-4">
            <div className="text-end">
              <div className="text-sm text-muted-foreground">Total Responses</div>
              <div className="text-2xl font-semibold">{total}</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // TODO: Implement send reminders functionality
                alert('Send reminders functionality will be implemented with email integration (Resend)')
              }}
            >
              <Mail className="me-2 h-4 w-4" />
              Send Reminders
            </Button>
          </div>
        }
      >
        {responses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No responses yet.</p>
          </div>
        ) : (
          <>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response) => (
                    <TableRow
                      key={response.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedResponse(response)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            {response.personOrg.person.photo ? (
                              <AvatarImage
                                src={response.personOrg.person.photo}
                                alt={`${response.personOrg.person.firstName} ${response.personOrg.person.lastName}`}
                              />
                            ) : (
                              <AvatarFallback>
                                {response.personOrg.person.firstName.charAt(0)}
                                {response.personOrg.person.lastName.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {response.personOrg.person.firstName} {response.personOrg.person.lastName}
                            </div>
                            {response.personOrg.person.email && (
                              <div className="text-sm text-muted-foreground">
                                {response.personOrg.person.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {formatDate(response.submittedAt, preferences || undefined)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {response.user ? (
                          <span className="text-sm">{response.user.name || response.user.email}</span>
                        ) : (
                          <Badge variant="outline">Self-submitted</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedResponse(response)
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                  <SelectTrigger className="h-9 w-[120px]">
                    <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size} rows
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total} responses
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </PageCard>

      {/* Response Detail Dialog */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Response Details</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedResponse.personOrg.person.firstName}{' '}
                    {selectedResponse.personOrg.person.lastName}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedResponse(null)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {fields.map((field: any) => {
                const value = selectedResponse.responses[field.id]
                return (
                  <div key={field.id} className="space-y-2">
                    <Label className="font-medium">{field.label}</Label>
                    <div className="text-sm">
                      {value === null || value === undefined ? (
                        <span className="text-muted-foreground">—</span>
                      ) : Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-2">
                          {value.map((v: string, i: number) => (
                            <Badge key={i} variant="secondary">
                              {v}
                            </Badge>
                          ))}
                        </div>
                      ) : typeof value === 'object' ? (
                        <pre className="text-xs bg-muted p-2 rounded">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      ) : (
                        <span>{String(value)}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

