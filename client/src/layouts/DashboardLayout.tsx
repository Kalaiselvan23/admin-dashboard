import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar />
      <main className="flex-1 p-6 md:p-8">
        <Outlet/>
      </main>
      <Toaster />

    </div>
  )
}

