"use client"

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Search } from "lucide-react"

// Define the DistributedItem type
interface DistributedItem {
  id: string
  agentName: string
  agentEmail: string
  itemType: string
  itemCount: number
  status: "pending" | "in-progress" | "completed"
  assignedAt: string
}

// Sample data
const data: DistributedItem[] = [
  {
    id: "1",
    agentName: "John Smith",
    agentEmail: "john.smith@example.com",
    itemType: "Leads",
    itemCount: 45,
    status: "in-progress",
    assignedAt: "2023-03-15T09:30:00Z",
  },
  {
    id: "2",
    agentName: "Sarah Johnson",
    agentEmail: "sarah.j@example.com",
    itemType: "Contacts",
    itemCount: 32,
    status: "completed",
    assignedAt: "2023-03-14T14:45:00Z",
  },
  {
    id: "3",
    agentName: "Michael Brown",
    agentEmail: "michael.b@example.com",
    itemType: "Leads",
    itemCount: 28,
    status: "pending",
    assignedAt: "2023-03-16T11:15:00Z",
  },
  {
    id: "4",
    agentName: "Emily Davis",
    agentEmail: "emily.d@example.com",
    itemType: "Contacts",
    itemCount: 50,
    status: "in-progress",
    assignedAt: "2023-03-13T16:20:00Z",
  },
  {
    id: "5",
    agentName: "Robert Wilson",
    agentEmail: "robert.w@example.com",
    itemType: "Leads",
    itemCount: 37,
    status: "completed",
    assignedAt: "2023-03-12T10:00:00Z",
  },
]

export function DistributedListTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const columns: ColumnDef<DistributedItem>[] = [
    {
      accessorKey: "agentName",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Agent Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("agentName")}</div>,
    },
    {
      accessorKey: "agentEmail",
      header: "Email",
    },
    {
      accessorKey: "itemType",
      header: "Item Type",
    },
    {
      accessorKey: "itemCount",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Item Count
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-right">{row.getValue("itemCount")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        let statusClass = ""

        switch (status) {
          case "pending":
            statusClass = "text-yellow-600"
            break
          case "in-progress":
            statusClass = "text-blue-600"
            break
          case "completed":
            statusClass = "text-green-600"
            break
        }

        return <div className={`capitalize ${statusClass}`}>{status.replace("-", " ")}</div>
      },
    },
    {
      accessorKey: "assignedAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Assigned At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("assignedAt"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  // Apply status filter
  const filteredData = statusFilter === "all" ? data : data.filter((item) => item.status === statusFilter)

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={(table.getColumn("agentName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("agentName")?.setFilterValue(event.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <span className="text-sm">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
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
                    No distributed items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </Card>
    </>
  )
}

