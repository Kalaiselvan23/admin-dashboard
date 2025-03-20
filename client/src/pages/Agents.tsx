import { AgentForm } from "@/components/agent-form"
import { AgentTable } from "@/components/agent-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Agents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
        <p className="text-muted-foreground">Add, edit, and manage your agents</p>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Agent List</TabsTrigger>
          <TabsTrigger value="add">Add New Agent</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <AgentTable />
        </TabsContent>
        <TabsContent value="add" className="mt-4">
          <AgentForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
