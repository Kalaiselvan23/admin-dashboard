// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   type ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   useReactTable,
//   type ColumnFiltersState,
//   getFilteredRowModel,
//   type SortingState,
//   getSortedRowModel,
// } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ArrowUpDown, Search } from "lucide-react";
// import Api from "@/lib/Api";

// interface Task {
//   id: string;
//   agentName: string;
//   agentEmail: string;
//   firstName: string;
//   phone: string;
//   notes: string;
//   status: "pending" | "progress" | "completed";
//   assignedAt: string;
// }

// export function DistributedListTable() {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [statusFilter, setStatusFilter] = useState<string>("all");

//   const fetchTasks = async () => {
//     const res = await Api.get("/tasks/distributed");
//     return res.data;
//   };

//   const { data: tasks, isLoading, error } = useQuery({
//     queryKey: ["tasks"],
//     queryFn: fetchTasks,
//   });

//   const columns: ColumnDef<Task>[] = [
//     {
//       accessorKey: "agentName",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Agent Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="font-medium">{row.getValue("agentName")}</div>
//       ),
//     },
//     {
//       accessorKey: "agentEmail",
//       header: "Email",
//       cell: ({ row }) => (
//         <div>{row.getValue("agentEmail") || "N/A"}</div>
//       ),
//     },
//     {
//       accessorKey: "firstName",
//       header: "First Name",
//       cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
//     },
//     {
//       accessorKey: "phone",
//       header: "Phone",
//       cell: ({ row }) => <div>{row.getValue("phone")}</div>,
//     },
//     {
//       accessorKey: "notes",
//       header: "Notes",
//       cell: ({ row }) => (
//         <div className="truncate max-w-xs">{row.getValue("notes") || "—"}</div>
//       ),
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const status = row.getValue("status") as string;
//         let statusClass = "";

//         switch (status) {
//           case "pending":
//             statusClass = "text-yellow-600";
//             break;
//           case "progress":
//             statusClass = "text-blue-600";
//             break;
//           case "completed":
//             statusClass = "text-green-600";
//             break;
//         }

//         return <div className={`capitalize ${statusClass}`}>{status}</div>;
//       },
//     },
//     {
//       accessorKey: "assignedAt",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Assigned At
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       cell: ({ row }) => {
//         const date = new Date(row.getValue("assignedAt"));
//         return <div>{date.toLocaleDateString()}</div>;
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: tasks || [],
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),
//     onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       sorting,
//       columnFilters,
//     },
//   });

//   if (isLoading) return <div>Loading tasks...</div>;
//   if (error) return <div>Error loading tasks</div>;

//   return (
//     <>
//       <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
//         <div className="relative flex-1">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search agents..."
//             value={(table.getColumn("agentName")?.getFilterValue() as string) ?? ""}
//             onChange={(event) =>
//               table.getColumn("agentName")?.setFilterValue(event?.target?.value)
//             }
//             className="pl-8"
//           />
//         </div>
//         <div className="flex w-full items-center gap-2 md:w-auto">
//           <span className="text-sm">Status:</span>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Filter by status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="progress">In Progress</SelectItem>
//               <SelectItem value="completed">Completed</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Card>
//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={columns.length} className="h-24 text-center">
//                     No distributed items found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </Card>
//     </>
//   );
// }


"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, Calendar, ClipboardList, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Api from "@/lib/Api";

interface Task {
  _id: string;
  taskName: string;
  notes: string;
  status: "pending" | "progress" | "completed";
  deadline: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  taskCount: number;
  tasks: Task[];
}

export function DistributedListTable() {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [taskPagination, setTaskPagination] = useState<Record<string, { page: number, pageSize: number }>>({});
  
  const fetchTasks = async () => {
    const res = await Api.get("/tasks/distributed");
    return res.data;
  };
  
  const { data: agents, isLoading, error } = useQuery({ 
    queryKey: ["agents"], 
    queryFn: fetchTasks 
  });
  
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      // Initialize pagination when expanding
      if (newState[id] && !taskPagination[id]) {
        setTaskPagination((prev) => ({
          ...prev,
          [id]: { page: 0, pageSize: 3 }
        }));
      }
      return newState;
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  const isOverdue = (dateString: string) => {
    if (!dateString) return false;
    const deadline = new Date(dateString);
    const today = new Date();
    return deadline < today && today.setHours(0, 0, 0, 0) > deadline.setHours(0, 0, 0, 0);
  };
  
  // Handle task pagination
  const setTaskPage = (agentId: string, newPage: number) => {
    setTaskPagination((prev) => ({
      ...prev,
      [agentId]: { ...prev[agentId], page: newPage }
    }));
  };
  
  const changeTaskPageSize = (agentId: string, newSize: number) => {
    setTaskPagination((prev) => ({
      ...prev,
      [agentId]: { page: 0, pageSize: newSize }
    }));
  };
  
  const columns: ColumnDef<Agent>[] = [
    {
      accessorKey: "name",
      header: "Agent Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "taskCount",
      header: "Tasks Assigned",
      cell: ({ row }) => <div className="text-center">{row.getValue("taskCount")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => toggleRow(row.original.id)}>
          {expandedRows[row.original.id] ? (
            <>Hide Tasks <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>View Tasks <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
      ),
    },
  ];
  
  const table = useReactTable({
    data: agents || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });
  
  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks</div>;
  
  return (
    <Card className="mb-8">
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
            {table.getRowModel().rows.map((row) => (
              <>
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {expandedRows[row.original.id] && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="p-0">
                      <div className="bg-gray-50 p-4">
                        <h3 className="text-lg font-medium mb-3">Tasks for {row.original.name}</h3>
                        
                        {row.original.tasks.length === 0 ? (
                          <p className="text-gray-500 italic">No tasks assigned</p>
                        ) : (
                          <>
                            <div className="grid gap-3">
                              {row.original.tasks
                                .slice(
                                  taskPagination[row.original.id]?.page * taskPagination[row.original.id]?.pageSize || 0,
                                  (taskPagination[row.original.id]?.page + 1) * taskPagination[row.original.id]?.pageSize || 3
                                )
                                .map((task) => (
                                  <div 
                                    key={task._id} 
                                    className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="text-md font-semibold">{task.taskName}</h4>
                                      <Badge className={getStatusColor(task.status)}>
                                        {task.status === "progress" ? "In Progress" : task.status}
                                      </Badge>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" /> 
                                        <span className={isOverdue(task.deadline) ? "text-red-600 font-medium" : ""}>
                                          {formatDate(task.deadline)}
                                          {isOverdue(task.deadline) && " (Overdue)"}
                                        </span>
                                      </div>
                                      
                                      {task.status === "progress" && (
                                        <div className="flex items-center gap-2 text-sm text-blue-600">
                                          <Clock className="h-4 w-4" /> In progress
                                        </div>
                                      )}
                                    </div>
                                    
                                    {task.notes && (
                                      <div className="mt-3 pt-3 border-t">
                                        <div className="flex items-start gap-2">
                                          <ClipboardList className="h-4 w-4 mt-1 text-gray-500" />
                                          <p className="text-sm text-gray-700">{task.notes}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                              ))}
                            </div>
                            
                            {/* Task Pagination */}
                            <div className="flex items-center justify-between space-x-2 mt-4">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm text-gray-500">
                                  Page {(taskPagination[row.original.id]?.page || 0) + 1} of{" "}
                                  {Math.max(1, Math.ceil(row.original.tasks.length / (taskPagination[row.original.id]?.pageSize || 3)))}
                                </p>
                                <select
                                  className="border rounded p-1 text-sm"
                                  value={taskPagination[row.original.id]?.pageSize || 3}
                                  onChange={(e) => changeTaskPageSize(row.original.id, Number(e.target.value))}
                                >
                                  {[3, 5, 10].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                      Show {pageSize}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setTaskPage(row.original.id, Math.max(0, (taskPagination[row.original.id]?.page || 0) - 1))}
                                  disabled={(taskPagination[row.original.id]?.page || 0) === 0}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setTaskPage(
                                    row.original.id, 
                                    Math.min(
                                      Math.ceil(row.original.tasks.length / (taskPagination[row.original.id]?.pageSize || 3)) - 1,
                                      (taskPagination[row.original.id]?.page || 0) + 1
                                    )
                                  )}
                                  disabled={
                                    (taskPagination[row.original.id]?.page || 0) >= 
                                    Math.ceil(row.original.tasks.length / (taskPagination[row.original.id]?.pageSize || 3)) - 1
                                  }
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Main Table Pagination */}
      <div className="flex items-center justify-between space-x-2 p-4 border-t">
        <div className="flex-1 text-sm text-gray-700">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} agents
        </div>
        
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm">Rows per page</p>
            <select
              className="border rounded p-1"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex w-[100px] items-center justify-center text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span>First</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span>Last</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
