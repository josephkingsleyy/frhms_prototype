import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  User, Building2, Bell, Shield, Palette, Globe, Database, Key
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "clinic", label: "Clinic", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Database },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account, clinic, and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input defaultValue="Dr. Ananya Sharma" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Specialization</Label>
                    <Input defaultValue="Reproductive Medicine & IVF" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input defaultValue="dr.ananya@frhms.com" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input defaultValue="+91 98765 43210" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Registration Number</Label>
                    <Input defaultValue="MCI-2015-78432" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Experience</Label>
                    <Input defaultValue="15+ Years" className="mt-1.5" />
                  </div>
                </div>
                <Button className="mt-4">Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "clinic" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clinic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Clinic Name</Label>
                    <Input defaultValue="LifeCare Fertility Centre" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>License Number</Label>
                    <Input defaultValue="ART-2020-MH-0045" className="mt-1.5" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <Input defaultValue="23, Green Park, New Delhi - 110016" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Working Hours</Label>
                    <Input defaultValue="Mon-Sat: 9:00 AM - 6:00 PM" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Emergency Contact</Label>
                    <Input defaultValue="+91 1800 123 4567" className="mt-1.5" />
                  </div>
                </div>
                <Button className="mt-4">Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Appointment Reminders", desc: "Receive alerts for upcoming appointments", enabled: true },
                  { label: "Lab Results Ready", desc: "Get notified when patient lab results are available", enabled: true },
                  { label: "New Q&A Questions", desc: "Alert when patients submit new questions", enabled: true },
                  { label: "Payment Notifications", desc: "Receive payment confirmations and overdue alerts", enabled: false },
                  { label: "Cycle Milestone Alerts", desc: "Notifications for critical cycle events (trigger, retrieval)", enabled: true },
                  { label: "SMS Notifications", desc: "Send SMS to patients for appointment reminders", enabled: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security & Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="Enter current password" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter new password" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input type="password" placeholder="Confirm new password" className="mt-1.5" />
                  </div>
                  <Button>Update Password</Button>
                </div>
                <div className="border-t border-border pt-6">
                  <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Enable 2FA for enhanced security</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Recommended for HIPAA compliance</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Integrations & APIs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "WebMedic HMS", status: "Connected", desc: "Core EMR integration for patient data sync" },
                  { name: "Twilio SMS", status: "Connected", desc: "SMS notifications for patients" },
                  { name: "Daily.co Video", status: "Connected", desc: "Video consultation platform" },
                  { name: "Razorpay", status: "Active", desc: "Payment gateway for online collections" },
                  { name: "FHIR API", status: "Pending", desc: "HL7 FHIR interoperability standard" },
                ].map((integration, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Database className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.desc}</p>
                      </div>
                    </div>
                    <Badge className={
                      integration.status === "Connected" || integration.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }>{integration.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
