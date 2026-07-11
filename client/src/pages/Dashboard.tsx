import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Heart, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const chartData = [
  { name: "Jan", value: 45, consultations: 24 },
  { name: "Feb", value: 52, consultations: 28 },
  { name: "Mar", value: 48, consultations: 22 },
  { name: "Apr", value: 61, consultations: 35 },
  { name: "May", value: 55, consultations: 31 },
  { name: "Jun", value: 67, consultations: 42 },
];

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {trend && <p className="text-xs text-green-600 mt-1">↑ {trend}</p>}
        </div>
        <div className="p-3 bg-purple-100 rounded-lg">
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Dr. Ananya</h1>
        <p className="text-muted-foreground mt-1">Here's your clinic performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Patients" value="1,248" trend="12% from last month" />
        <StatCard icon={Heart} label="Active Cycles" value="156" trend="8% from last month" />
        <StatCard icon={Calendar} label="Consultations" value="342" trend="15% from last month" />
        <StatCard icon={TrendingUp} label="Success Rate" value="67.2%" trend="2.1% improvement" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Visits Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#9333ea" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultations vs Cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#9333ea" />
                <Bar dataKey="consultations" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Patient Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { patient: "Sarah Johnson", action: "Completed IVF Cycle", time: "2 hours ago", status: "Success" },
              { patient: "Emily Davis", action: "Started Hormonal Assessment", time: "4 hours ago", status: "In Progress" },
              { patient: "Jessica Lee", action: "Asked Question via Q&A", time: "6 hours ago", status: "Answered" },
              { patient: "Michelle Brown", action: "Scheduled Video Consultation", time: "1 day ago", status: "Pending" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.patient}</p>
                  <p className="text-sm text-muted-foreground">{item.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                  <p className={`text-xs font-medium mt-1 ${
                    item.status === "Success" ? "text-green-600" :
                    item.status === "In Progress" ? "text-blue-600" :
                    item.status === "Answered" ? "text-purple-600" :
                    "text-yellow-600"
                  }`}>{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
