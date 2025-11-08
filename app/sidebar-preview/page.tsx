'use client'

export default function SidebarPreviewPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Preview</h2>
      </div>
      <div className="flex flex-1 items-center justify-center bg-muted/30">
        <div className="rounded-lg border bg-background p-8 shadow-sm">
          <p className="text-muted-foreground">Sidebar preview content</p>
        </div>
      </div>
    </div>
  )
}
