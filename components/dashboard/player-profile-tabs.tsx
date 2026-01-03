'use client'

import { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Calendar,
  BarChart3,
  StickyNote,
  FolderOpen,
  Table,
} from 'lucide-react'

interface PlayerProfileTabsProps {
  overviewTab: ReactNode
  formsTab: ReactNode
  eventsTab: ReactNode
  performanceTab: ReactNode
  notesTab: ReactNode
  filesTab: ReactNode
  spreadsheetsTab: ReactNode
}

export function PlayerProfileTabs({
  overviewTab,
  formsTab,
  eventsTab,
  performanceTab,
  notesTab,
  filesTab,
  spreadsheetsTab,
}: PlayerProfileTabsProps) {
  return (
    <Tabs defaultValue="overview" className="flex-1 flex flex-col">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="forms">
          <FileText className="me-2 h-4 w-4" />
          Forms
        </TabsTrigger>
        <TabsTrigger value="events">
          <Calendar className="me-2 h-4 w-4" />
          Events
        </TabsTrigger>
        <TabsTrigger value="performance">
          <BarChart3 className="me-2 h-4 w-4" />
          Performance
        </TabsTrigger>
        <TabsTrigger value="notes">
          <StickyNote className="me-2 h-4 w-4" />
          Notes
        </TabsTrigger>
        <TabsTrigger value="files">
          <FolderOpen className="me-2 h-4 w-4" />
          Files
        </TabsTrigger>
        <TabsTrigger value="spreadsheets">
          <Table className="me-2 h-4 w-4" />
          Spreadsheets
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6 space-y-6">
        {overviewTab}
      </TabsContent>

      <TabsContent value="forms" className="mt-6">
        {formsTab}
      </TabsContent>

      <TabsContent value="events" className="mt-6">
        {eventsTab}
      </TabsContent>

      <TabsContent value="performance" className="mt-6">
        {performanceTab}
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        {notesTab}
      </TabsContent>

      <TabsContent value="files" className="mt-6">
        {filesTab}
      </TabsContent>

      <TabsContent value="spreadsheets" className="mt-6">
        {spreadsheetsTab}
      </TabsContent>
    </Tabs>
  )
}
