import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Shield, Building2, FileCode, Bell } from "lucide-react";

const users = [
  { name: "Dr. Ananya Krishnan", role: "IVF Specialist", email: "ananya@frhms.com", status: "Active", lastLogin: "Jul 13, 2024" },
  { name: "Dr. Rajesh Mehta", role: "Andrologist", email: "rajesh@frhms.com", status: "Active", lastLogin: "Jul 12, 2024" },
  { name: "Dr. Priya Patel", role: "Embryologist", email: "priya@frhms.com", status: "Active", lastLogin: "Jul 13, 2024" },
  { name: "Nurse Sita Ram", role: "Clinical Nurse", email: "sita@frhms.com", status: "Active", lastLogin: "Jul 13, 2024" },
  { name: "Admin Deepak", role: "System Admin", email: "deepak@frhms.com", status: "Active", lastLogin: "Jul 11, 2024" },
  { name: "Lab Tech Arun", role: "Lab Technician", email: "arun@frhms.com", status: "Inactive", lastLogin: "Jun 28, 2024" },
];

const roles = [
  { name: "IVF Specialist", permissions: "Full clinical access, prescriptions, assessments", users: 2 },
  { name: "Embryologist", permissions: "Embryology workspace, lab results, cycle data", users: 1 },
  { name: "Clinical Nurse", permissions: "Patient records, monitoring, medications", users: 1 },
  { name: "Lab Technician", permissions: "Lab requests, result upload, test catalog", users: 1 },
  { name: "System Admin", permissions: "Full system access, user management, settings", users: 1 },
  { name: "Receptionist", permissions: "Appointments, patient registration, billing", users: 0 },
];

const auditLog = [
  { action: "Patient Record Updated", user: "Dr. Ananya", target: "Sarah Johnson", time: "10 min ago" },
  { action: "Lab Result Uploaded", user: "Lab Tech Arun", target: "LR001 - FSH Panel", time: "25 min ago" },
  { action: "Invoice Created", user: "Admin Deepak", target: "INV-2024-004", time: "1 hr ago" },
  { action: "Treatment Plan Modified", user: "Dr. Ananya", target: "Priya Sharma - Mini IVF", time: "2 hrs ago" },
  { action: "New Patient Registered", user: "Nurse Sita", target: "Michelle Brown", time: "3 hrs ago" },
];

export default function Administration() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage users, roles, clinic settings, and system configuration</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="settings">Clinic Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">System Users</CardTitle>
              <Button size="sm" className="bg-primary hover:bg-primary/90">Add User</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Name</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Role</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Email</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Last Login</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">{u.name}</td>
                        <td className="px-6 py-4 text-sm">{u.role}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                        <td className="px-6 py-4">
                          <Badge className={u.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{u.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{u.lastLogin}</td>
                        <td className="px-6 py-4">
                          <Button variant="outline" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <h3 className="font-semibold text-sm">{role.name}</h3>
                    </div>
                    <Badge variant="outline">{role.users} users</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{role.permissions}</p>
                  <Button variant="outline" size="sm" className="w-full">Manage Permissions</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileCode className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">by {log.user} — {log.target}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" /> Clinic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Clinic Name</label>
                  <input className="w-full px-3 py-2 border border-border rounded-lg text-sm" value="WebMedic Fertility Center" readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <input className="w-full px-3 py-2 border border-border rounded-lg text-sm" value="123 Medical Drive, Lagos, Nigeria" readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact</label>
                  <input className="w-full px-3 py-2 border border-border rounded-lg text-sm" value="+234 800 123 4567" readOnly />
                </div>
                <Button className="w-full">Update Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Lab Results Ready", desc: "Notify when lab results are uploaded", enabled: true },
                  { label: "Appointment Reminders", desc: "Send SMS 24hrs before appointment", enabled: true },
                  { label: "Payment Due Alerts", desc: "Alert when payment is overdue", enabled: false },
                  { label: "Cycle Trigger Alerts", desc: "Notify when patient is trigger-ready", enabled: true },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${n.enabled ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
