// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Users, FileSpreadsheet, ListChecks, CheckCircle } from "lucide-react"

// export function DashboardStats() {
//   // In a real app, you would fetch this data from an API
//   const stats = [
//     {
//       title: "Total Agents",
//       value: "12",
//       icon: Users,
//       description: "Active agents in the system",
//     },
//     {
//       title: "Uploaded Files",
//       value: "24",
//       icon: FileSpreadsheet,
//       description: "CSV files processed",
//     },
//     {
//       title: "Distributed Items",
//       value: "1,234",
//       icon: ListChecks,
//       description: "Items assigned to agents",
//     },
//     {
//       title: "Completion Rate",
//       value: "78%",
//       icon: CheckCircle,
//       description: "Tasks completed by agents",
//     },
//   ]

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {stats.map((stat) => (
//         <Card key={stat.title}>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
//             <stat.icon className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stat.value}</div>
//             <p className="text-xs text-muted-foreground">{stat.description}</p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }


import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileSpreadsheet, ListChecks, CheckCircle } from "lucide-react";
import Api from "@/lib/Api";

const fetchDashboardStats=async()=>{
  const res=await Api.get("stats",)
  const data=await res.data;
  console.log(res.data);
  return data;
}
export function DashboardStats() {

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) return <div>Loading stats...</div>;
  if (error) return <div>Error loading stats</div>;

  const stats = [
    {
      title: "Total Agents",
      value: data.totalAgents,
      icon: Users,
      description: "Active agents in the system",
    },
    {
      title: "Uploaded Files",
      value: data.uploadedFiles,
      icon: FileSpreadsheet,
      description: "CSV files processed",
    },
    {
      title: "Distributed Items",
      value: data.distributedItems,
      icon: ListChecks,
      description: "Items assigned to agents",
    },
    {
      title: "Completion Rate",
      value: data.completionRate,
      icon: CheckCircle,
      description: "Tasks completed by agents",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
