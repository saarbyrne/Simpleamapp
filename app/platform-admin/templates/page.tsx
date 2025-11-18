import { PageHeader } from '@/components/platform-admin/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Palette, TableIcon } from 'lucide-react'

export default function TemplatesPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Templates"
        description="Manage global templates shared across all organizations"
      />

      <div className="flex-1 p-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Form Templates</CardTitle>
                  <CardDescription>Global form templates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage form templates that can be used by all organizations.
              </p>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                Coming soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Drawing Templates</CardTitle>
                  <CardDescription>Global tactical drawings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage tactical drawing templates for formations, drills, and set pieces.
              </p>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                Coming soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TableIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Spreadsheet Templates</CardTitle>
                  <CardDescription>Global spreadsheets</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage spreadsheet templates for performance tracking and analytics.
              </p>
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                Coming soon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
