import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { useAuth } from "@/contexts/AuthContext"

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || "User"}!</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
          <CardDescription>Your account information and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{user?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Role</p>
              <p className="text-sm text-muted-foreground">{user?.role || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Login</p>
              <p className="text-sm text-muted-foreground">
                {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <DashboardStats />
    </div>
  )
}
