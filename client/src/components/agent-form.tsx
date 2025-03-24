import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Api from "@/lib/Api"
import { toast } from "sonner"
import { useEffect } from "react"

interface Agent {
  id: string
  name: string
  email: string
  mobile: string
  status: "active" | "inactive"
  createdAt: string
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
})

interface AgentFormProps {
  agentToEdit?: Agent | null
  onComplete?: () => void
}

export function AgentForm({ agentToEdit, onComplete }: AgentFormProps) {
  const queryClient = useQueryClient()
  const isEditMode = !!agentToEdit

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(isEditMode ? formSchema.omit({ password: true }) : formSchema),
    mode: "onTouched", 
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
    },
  })

  useEffect(() => {
    if (agentToEdit) {
      form.reset({
        name: agentToEdit.name,
        email: agentToEdit.email,
        mobile: agentToEdit.mobile,
      })
    } else {
      form.reset({
        name: "",
        email: "",
        mobile: "",
        password: "",
      })
    }
  }, [agentToEdit, form])

  const createAgentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await Api.post("/agents/add", values, {
        headers: { "Content-Type": "application/json" },
      })
      return response.data
    },
    onSuccess: () => {
      toast.success("Agent has been added successfully")
      queryClient.invalidateQueries({queryKey:["agents"]})
      form.reset()
      if (onComplete) onComplete()
    },
    onError: () => {
      toast.error("Failed to create agent. Please try again.")
    },
  })

  const updateAgentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!agentToEdit) throw new Error("No agent to update")
      const response = await Api.put(`/agents/${agentToEdit.id}`, values, {
        headers: { "Content-Type": "application/json" },
      })
      return response.data
    },
    onSuccess: () => {
      toast.success("Agent has been updated successfully")
      queryClient.invalidateQueries({queryKey:["agents"]})
      if (onComplete) onComplete()
    },
    onError: () => {
      toast("Failed to update agent. Please try again.")
    },
  })

  const mutation = isEditMode ? updateAgentMutation : createAgentMutation

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Agent" : "Add New Agent"}</CardTitle>
        <CardDescription>
          {isEditMode ? "Update agent account details" : "Create a new agent account to manage leads and tasks"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="agent@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEditMode && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Agent" : "Create Agent")}
              </Button>
              {isEditMode && (
                <Button type="button" variant="outline" onClick={onComplete}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
