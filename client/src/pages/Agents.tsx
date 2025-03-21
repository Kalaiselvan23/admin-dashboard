import { useState } from "react"
import { AgentForm } from "@/components/agent-form"
import { AgentTable } from "@/components/agent-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Agent {
  id: string
  name: string
  email: string
  mobile: string
  status: "active" | "inactive"
  createdAt: string
}

export default function Agents() {
  const [currentTab, setCurrentTab] = useState("list")
  const [agentToEdit, setAgentToEdit] = useState<Agent | null>(null)
  
  const handleEdit = (agent: Agent) => {
    setAgentToEdit(agent)
    setCurrentTab("add")
  }
  
  const handleFormComplete = () => {
    setAgentToEdit(null)
    setCurrentTab("list")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
        <p className="text-muted-foreground">Add, edit, and manage your agents</p>
      </div>
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="list">Agent List</TabsTrigger>
          <TabsTrigger value="add">{agentToEdit ? "Edit Agent" : "Add New Agent"}</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <AgentTable onEdit={handleEdit} />
        </TabsContent>
        <TabsContent value="add" className="mt-4">
          <AgentForm agentToEdit={agentToEdit} onComplete={handleFormComplete} />
        </TabsContent>
      </Tabs>
    </div>
  )
}