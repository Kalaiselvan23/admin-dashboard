import { DistributedListTable } from "@/components/distributed-list-table"

export default function Distributed() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Distributed Lists</h1>
        <p className="text-muted-foreground">View and manage data distributed to agents</p>
      </div>

      <DistributedListTable />
    </div>
  )
}
