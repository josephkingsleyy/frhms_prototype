import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, FileText, TrendingUp, Users, Baby } from "lucide-react";
import { trpc } from "@/lib/trpc";

const clinicalReports = [
  { name: "IVF Success Rate Report", period: "Q2 2024", generated: "Jul 1, 2024", type: "Clinical" },
  { name: "Cycle Outcome Analysis", period: "Jun 2024", generated: "Jul 2, 2024", type: "Clinical" },
  { name: "Patient Demographics Summary", period: "H1 2024", generated: "Jul 5, 2024", type: "Clinical" },
  { name: "Embryology Lab Performance", period: "Q2 2024", generated: "Jul 3, 2024", type: "Laboratory" },
];

const financialReports = [
  { name: "Revenue Summary", period: "Jun 2024", generated: "Jul 1, 2024", type: "Financial" },
  { name: "Outstanding Payments Report", period: "Jul 2024", generated: "Jul 12, 2024", type: "Financial" },
  { name: "Package Utilization Analysis", period: "Q2 2024", generated: "Jul 5, 2024", type: "Financial" },
  { name: "Referral Commission Report", period: "Jun 2024", generated: "Jul 1, 2024", type: "Financial" },
];

export default function Reports() {
  const { data: dashboardStats } = trpc.dashboard.stats.useQuery();
  const { data: patients } = trpc.patients.list.useQuery();

  const activePatients = dashboardStats?.activePatients || patients?.length || 156;
  const successRate = 42; // From dashboard
  const activeCycles = dashboardStats?.activeCycles || 28;
  const monthlyRevenue = parseInt(dashboardStats?.totalRevenue || "4000000");

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Clinical, financial, and operational analytics</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <FileText className="w-4 h-4 mr-2" /> Generate Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center space-y-1">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mx-auto">
              <Baby className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-700">{successRate}%</p>
            <p className="text-xs text-muted-foreground">IVF Success Rate</p>
            <p className="text-xs text-green-600">+5% vs Q1</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center space-y-1">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mx-auto">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">{activePatients}</p>
            <p className="text-xs text-muted-foreground">Active Patients</p>
            <p className="text-xs text-green-600">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center space-y-1">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mx-auto">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{activeCycles}</p>
            <p className="text-xs text-muted-foreground">Cycles This Month</p>
            <p className="text-xs text-green-600">+8% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center space-y-1">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mx-auto">
              <BarChart3 className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold">₹{(monthlyRevenue / 100000).toFixed(1)}L</p>
            <p className="text-xs text-muted-foreground">Monthly Revenue</p>
            <p className="text-xs text-green-600">+15% vs Jun</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clinical" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clinical">Clinical Reports</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="clinical">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Report Name</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Period</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Generated</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Type</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicalReports.map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{r.name}</td>
                        <td className="px-6 py-4 text-sm">{r.period}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{r.generated}</td>
                        <td className="px-6 py-4"><Badge variant="outline">{r.type}</Badge></td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> Download</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Report Name</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Period</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Generated</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Type</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialReports.map((r, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{r.name}</td>
                        <td className="px-6 py-4 text-sm">{r.period}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{r.generated}</td>
                        <td className="px-6 py-4"><Badge variant="outline">{r.type}</Badge></td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> Download</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
