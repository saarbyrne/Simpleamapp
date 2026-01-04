import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <div className="relative flex items-center border border-input rounded-md px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 h-10 bg-background">
            <Search className="h-4 w-4 opacity-50 mr-2 flex-shrink-0" />
            <SidebarInput
              id="search"
              placeholder="Search the docs..."
              className="border-0 shadow-none focus-visible:ring-0 px-0 h-10"
            />
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
