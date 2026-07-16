import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, Baby, Activity, Calendar, TrendingUp, Clock,
  ArrowUpRight, Bell
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { trpc } from "@/lib/trpc";

const chartData = [
  { name: "Jan", patients: 45, cycles: 12, success: 5 },
  { name: "Feb", patients: 52, cycles: 15, success: 7 },
  { name: "Mar", patients: 48, cycles: 14, success: 6 },
  { name: "Apr", patients: 61, cycles: 18, success: 8 },
  { name: "May", patients: 55, cycles: 20, success: 9 },
  { name: "Jun", patients: 67, cycles: 24, success: 10 },
  { name: "Jul", patients: 72, cycles: 28, success: 12 },
];

const stats = [
  { label: "Active Patients", value: "156", change: "+12", icon: Users, color: "bg-purple-100 text-purple-600" },
  { label: "Active Cycles", value: "28", change: "+4", icon: Activity, color: "bg-blue-100 text-blue-600" },
  { label: "Success Rate (Q2)", value: "42%", change: "+5%", icon: Baby, color: "bg-green-100 text-green-600" },
  { label: "Today's Appointments", value: "12", change: "3 pending", icon: Calendar, color: "bg-yellow-100 text-yellow-600" },
];

const todaySchedule = [
  { time: "09:00", patient: "Sarah Johnson", type: "Cycle Monitoring - Day 8 Scan", status: "Confirmed" },
  { time: "09:30", patient: "Lisa Chen", type: "Follicle Tracking - Day 5", status: "Confirmed" },
  { time: "10:00", patient: "Michelle Brown", type: "Initial Consultation", status: "Confirmed" },
  { time: "11:00", patient: "Priya Sharma", type: "Egg Retrieval Prep", status: "In Progress" },
  { time: "14:00", patient: "Emily Davis", type: "Hormonal Assessment Review", status: "Pending" },
  { time: "15:30", patient: "Amanda Wilson", type: "IUI Procedure", status: "Pending" },
];

const alerts = [
  { type: "urgent", message: "Priya Sharma — Trigger ready (E2: 1,890 pg/mL, 9 follicles >18mm)", time: "15 min ago" },
  { type: "info", message: "Lab results ready: Sarah Johnson — FSH, LH, E2 Panel", time: "1 hr ago" },
  { type: "warning", message: "Michelle Brown — Initial assessment payment pending", time: "2 hrs ago" },
  { type: "info", message: "New Q&A question received: 'Embryo Grading — Grade 3 transfer?'", time: "3 hrs ago" },
];

const alertColors: Record<string, string> = {
  urgent: "border-l-red-500 bg-red-50",
  warning: "border-l-yellow-500 bg-yellow-50",
  info: "border-l-blue-500 bg-blue-50",
};

const recentOutcomes = [
  { patient: "Rachel Green", cycle: "IVF #2", outcome: "Positive Beta", date: "Jun 28" },
  { patient: "Fatima Ali", cycle: "FET #1", outcome: "Positive Beta", date: "Jun 22" },
  { patient: "Chen Wei", cycle: "IVF #1", outcome: "Negative", date: "Jun 15" },
  { patient: "Maria Santos", cycle: "IUI #3", outcome: "Positive Beta", date: "Jun 10" },
];

export default function Dashboard() {
  const { data: dashStats } = trpc.dashboard.stats.useQuery();

  const dynamicStats = [
    { label: "Active Patients", value: dashStats?.totalPatients?.toString() || "0", change: "+12", icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Active Cycles", value: dashStats?.activeCycles?.toString() || "0", change: "+4", icon: Activity, color: "bg-blue-100 text-blue-600" },
    { label: "Success Rate (Q2)", value: "42%", change: "+5%", icon: Baby, color: "bg-green-100 text-green-600" },
    { label: "Total Appointments", value: dashStats?.totalAppointments?.toString() || "0", change: "pending", icon: Calendar, color: "bg-yellow-100 text-yellow-600" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, Dr. Ananya — here's your overview for today</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" /> 4 Alerts
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Calendar className="w-4 h-4 mr-2" /> Today's Schedule
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="flex items-center text-xs text-green-600 font-medium">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />{stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold mt-3">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Patient Growth & Cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="patients" stroke="#9333ea" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="cycles" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Successful Outcomes by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="success" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.map((apt, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="text-center min-w-[50px]">
                      <p className="text-sm font-semibold text-primary">{apt.time}</p>
                    </div>
                    <div className="w-px h-10 bg-border"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{apt.patient}</p>
                      <p className="text-xs text-muted-foreground">{apt.type}</p>
                    </div>
                    <Badge className={
                      apt.status === "Confirmed" ? "bg-green-100 text-green-800" :
                      apt.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }>{apt.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className={`p-3 rounded-lg border-l-4 ${alertColors[alert.type]}`}>
                    <p className="text-xs font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Outcomes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Cycle Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentOutcomes.map((o, i) => (
              <div key={i} className="p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                <p className="text-sm font-medium">{o.patient}</p>
                <p className="text-xs text-muted-foreground mt-1">{o.cycle}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge className={o.outcome.includes("Positive") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {o.outcome}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{o.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
