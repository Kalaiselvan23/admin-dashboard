import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
  type SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Search } from "lucide-react"
import Api from "@/lib/Api"
import { toast } from "sonner"
import { Modal } from "./Model"

interface Agent {
  _id: string
  name: string
  email: string
  mobile: string
  status: "active" | "inactive"
  createdAt: string
}

interface AgentTableProps {
  onEdit: (agent: Agent) => void
}

const fetchAgents = async () => {
  const response = await Api.get("agents")
  return response.data
}

export function AgentTable({ onEdit }: AgentTableProps) {
  const queryClient = useQueryClient()
  const { data: agents = [], isLoading } = useQuery({ queryKey: ["agents"], queryFn: fetchAgents })
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null)

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await Api.delete(`agents/${id}`)
    },
    onSuccess: () => {
      toast("Agent has been removed successfully")
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      setDeleteDialogOpen(false)
      setAgentToDelete(null)
    },
    onError: () => {
      toast.error("Failed to delete agent. Try again")
    },
  })

  const columns: ColumnDef<Agent>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "mobile", header: "Mobile" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className={`capitalize ${row.getValue("status") === "active" ? "text-green-600" : "text-red-600"}`}>
          {row.getValue("status")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      header:"Actions",
      cell: ({ row }) => {
        const agent = row.original
        return (
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs"
              onClick={() => onEdit(agent)}
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                setAgentToDelete(agent)
                setDeleteDialogOpen(true)
              }}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: agents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  })

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event?.target?.value || "")}            
            className="pl-8"
          />
        </div>
      </div>
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Loading agents...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No agents found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
       <Modal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Agent"
      >
        <p>Are you sure you want to delete <strong>{agentToDelete?.name}</strong>? This action cannot be undone.</p>
        <div className="mt-4 flex justify-end">
          {/* <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button> */}
          <Button
            variant="destructive"
            onClick={() => {
              if (agentToDelete) {
                deleteMutation.mutate(agentToDelete.id);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  )
}