import {  Routes , Route, Link, useLocation } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Fragment, useEffect, useState } from "react"
import Query from "./components/query"

export default function App() {
  const location = useLocation()
  const [pathName, setPathName] = useState<string[]>(location.pathname.split("/"))

  useEffect(() => {
    setPathName(location.pathname.split("/"))
  }, [location])


  return (
      <SidebarProvider>
        <Toaster />
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      {document.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  {pathName.slice(1).map((path, index) => (
                    <Fragment key={index}>
                      <Link to={`/${pathName.slice(1, index + 2).join('/')}`}>
                        {path.charAt(0).toUpperCase() + path.slice(1)}
                      </Link>
                      {index !== pathName.slice(1).length - 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/playground/query" element={<Query/>} />
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
            <Route path="/settings" element={<h1>Settings</h1>} />
          </Routes>
        </SidebarInset>
      </SidebarProvider>
  )
}
  