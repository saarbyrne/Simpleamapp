"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BrandingSettings } from './branding-settings'

export function SystemSettingsTabs({
  organization,
  staffContent
}: {
  organization: any
  staffContent: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">System Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage organization settings and team
        </p>
      </div>

      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          {staffContent}
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <BrandingSettings organization={organization} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
