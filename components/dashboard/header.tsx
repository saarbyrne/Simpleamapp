'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export type BreadcrumbItemType = {
  label: string
  href?: string
}

type DashboardHeaderProps = {
  breadcrumbs: BreadcrumbItemType[]
}

export function DashboardHeader({ breadcrumbs }: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-10 shrink-0 w-full overflow-x-hidden bg-background">
      <header className="flex h-16 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
        <Breadcrumb className="min-w-0 flex-1 overflow-hidden">
          <BreadcrumbList className="flex-nowrap overflow-x-auto overflow-y-hidden">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <div key={item.href || item.label} className="flex items-center gap-2 shrink-0">
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </div>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
    </div>
  )
}
