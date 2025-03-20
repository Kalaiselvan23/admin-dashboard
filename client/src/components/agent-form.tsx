// "use client"

// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"

// const formSchema = z.object({
//   name: z.string().min(2, { message: "Name must be at least 2 characters" }),
//   email: z.string().email({ message: "Please enter a valid email address" }),
//   mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters" }),
// })

// export function AgentForm() {
//   // const { toast } = useToast()
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       mobile: "",
//       password: "",
//     },
//   })

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsSubmitting(true)
//     try {
//       // In a real app, you would make an API call to create the agent
//       // const response = await fetch("/api/agents", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify(values),
//       // })

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       // toast({
//       //   title: "Agent created",
//       //   description: `${values.name} has been added successfully`,
//       // })

//       form.reset()
//     } catch (error) {
//       // toast({
//       //   title: "Error",
//       //   description: "Failed to create agent. Please try again.",
//       //   variant: "destructive",
//       // })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Add New Agent</CardTitle>
//         <CardDescription>Create a new agent account to manage leads and tasks</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Full Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="John Doe" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input placeholder="agent@example.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="mobile"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Mobile Number</FormLabel>
//                     <FormControl>
//                       <Input placeholder="1234567890" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="••••••" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Creating..." : "Create Agent"}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   )
// }



import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Api from "@/lib/Api"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function AgentForm() {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
    },
  })

  const createAgentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await Api.post("/agents/add", values, {
        headers: { "Content-Type": "application/json" },
      })
      return response.data
    },
    onSuccess: (data) => {
      toast({ title: "Agent Created", description: `${data.name} has been added successfully` })
      console.log("Agent created")
      queryClient.invalidateQueries(["agents"]) // Refetch agents list
      form.reset()
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create agent. Please try again.", variant: "destructive" })
      // console.log("Error")
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createAgentMutation.mutate(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Agent</CardTitle>
        <CardDescription>Create a new agent account to manage leads and tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
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
            </div>
            <Button type="submit" disabled={createAgentMutation.isPending}>
              {createAgentMutation.isPending ? "Creating..." : "Create Agent"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

