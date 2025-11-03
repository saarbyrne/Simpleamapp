"use client"

import { useState, useRef } from "react"
import { Upload, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CSVRow {
  firstName: string
  lastName: string
  dateOfBirth?: string
  nationality?: string
  phone?: string
  email?: string
  position?: string
  jerseyNumber?: string
  status?: 'active' | 'injured'
}

interface ImportResult {
  success: number
  failed: number
  errors: Array<{ row: number; name: string; error: string }>
}

export function ImportPlayersCSV() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, ''))

    const rows: CSVRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const row: any = {}

      headers.forEach((header, index) => {
        const value = values[index]
        if (value) {
          row[header] = value
        }
      })

      // Map common header variations
      rows.push({
        firstName: row.firstname || row.first_name || row['first name'] || '',
        lastName: row.lastname || row.last_name || row['last name'] || '',
        dateOfBirth: row.dateofbirth || row.dob || row.date_of_birth || row['date of birth'],
        nationality: row.nationality || row.country,
        phone: row.phone || row.phonenumber || row.mobile,
        email: row.email || row.emailaddress,
        position: row.position,
        jerseyNumber: row.jerseynumber || row.jersey || row.number,
        status: (row.status === 'injured' ? 'injured' : 'active') as 'active' | 'injured',
      })
    }

    return rows
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const text = await file.text()
      const rows = parseCSV(text)

      const importResult: ImportResult = {
        success: 0,
        failed: 0,
        errors: [],
      }

      // Import players one by one
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]

        if (!row.firstName || !row.lastName) {
          importResult.failed++
          importResult.errors.push({
            row: i + 2, // +2 because row 1 is headers and we start at 0
            name: `${row.firstName || 'Unknown'} ${row.lastName || 'Unknown'}`,
            error: 'First name and last name are required',
          })
          continue
        }

        const result = await createPlayer({
          firstName: row.firstName,
          lastName: row.lastName,
          dateOfBirth: row.dateOfBirth,
          nationality: row.nationality,
          phone: row.phone,
          email: row.email,
          position: row.position,
          jerseyNumber: row.jerseyNumber ? parseInt(row.jerseyNumber, 10) : undefined,
          status: row.status || 'active',
          tags: [],
        })

        if (result.error) {
          importResult.failed++
          importResult.errors.push({
            row: i + 2,
            name: `${row.firstName} ${row.lastName}`,
            error: result.error,
          })
        } else {
          importResult.success++
        }
      }

      setResult(importResult)
      router.refresh()
    } catch (error) {
      alert('Failed to parse CSV file. Please check the format.')
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClose = () => {
    if (!loading) {
      setIsOpen(false)
      setResult(null)
    }
  }

  const downloadTemplate = () => {
    const template = `firstName,lastName,dateOfBirth,nationality,phone,email,position,jerseyNumber,status
Alex,Morgan,1995-05-15,USA,+1 555 0001,alex@example.com,Forward,10,active
Jordan,Smith,1998-03-22,England,+44 7700 900001,jordan@example.com,Midfielder,8,active
Chris,Johnson,1996-11-30,Spain,+34 600 000 001,chris@example.com,Defender,5,active`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'players-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Players from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple players at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium">CSV Template</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Download a template file with the required format
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                Download Template
              </Button>
            </div>
          </div>

          {/* File Upload */}
          {!result && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {loading ? 'Importing...' : 'Select CSV File'}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Required columns: firstName, lastName
              </p>
            </div>
          )}

          {/* Import Results */}
          {result && (
            <div className="space-y-3">
              {result.success > 0 && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Successfully imported {result.success} player{result.success !== 1 ? 's' : ''}
                  </AlertDescription>
                </Alert>
              )}

              {result.failed > 0 && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to import {result.failed} player{result.failed !== 1 ? 's' : ''}
                  </AlertDescription>
                </Alert>
              )}

              {result.errors.length > 0 && (
                <div className="rounded-lg border border-border/60 bg-muted/30 p-4 max-h-60 overflow-y-auto">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Import Errors
                  </h4>
                  <div className="space-y-2">
                    {result.errors.map((error, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">Row {error.row}:</span>{' '}
                        <span className="text-muted-foreground">{error.name}</span> -{' '}
                        <span className="text-destructive">{error.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleClose} disabled={loading}>
            {result ? 'Close' : 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
