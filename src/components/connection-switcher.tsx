import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import {Link} from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function ConnectionSwitcher({
  connections,
}: {
  connections: {
    name: string
    logo: string | React.ForwardRefExoticComponent<React.RefAttributes<SVGSVGElement>>
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeConnection, setActiveConnection] = React.useState(connections[0])

  if (!activeConnection) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <i className={`${activeConnection.logo} text-center  size-4 shrink-0`} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeConnection.name}</span>
                <span className="truncate text-xs">{activeConnection.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
             Connections
            </DropdownMenuLabel>
            {connections.map((connection, index) => (
              <DropdownMenuItem
                key={connection.name}
                onClick={() => setActiveConnection(connection)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-xs border">
                  <i className={`${connection.logo} text-center size-4 shrink-0`} />
                </div>
                {connection.name}
                <DropdownMenuShortcut>ctrl {index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium"><Link  to={"/addceonnection"}>Add Connection</Link></div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
