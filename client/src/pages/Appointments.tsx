import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar, Clock, Video, MapPin, Search, Plus, Filter, Loader2
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-yellow-100 text-yellow-800",
};

export default function Appointments() {
  const [isOpen, setIsOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({
    patientId: "",
    title: "",
    type: "consultation" as "consultation" | "followup" | "procedure" | "monitoring" | "lab_test" | "video_call",
    date: "",
    time: "",
    duration: 30,
    notes: "",
  });

  const utils = trpc.useUtils();
  const { data: appointments, isLoading } = trpc.appointments.list.useQuery({ limit: 50, offset: 0 });
  const { data: patients } = trpc.patients.list.useQuery({ limit: 100, offset: 0 });

  const createMutation = trpc.appointments.create.useMutation({
    onSuccess: () => {
      utils.appointments.list.invalidate();
      setIsOpen(false);
      toast.success("Appointment scheduled successfully");
      setNewAppt({ patientId: "", title: "", type: "consultation", date: "", time: "", duration: 30, notes: "" });
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.appointments.update.useMutation({
    onSuccess: () => {
      utils.appointments.list.invalidate();
      toast.success("Appointment updated");
    },
  });

  const handleCreate = () => {
    if (!newAppt.patientId || !newAppt.title || !newAppt.date) {
      toast.error("Please fill required fields");
      return;
    }
    const dateTime = new Date(`${newAppt.date}T${newAppt.time || "09:00"}`);
    createMutation.mutate({
      patientId: parseInt(newAppt.patientId),
      title: newAppt.title,
      type: newAppt.type,
      date: dateTime,
      duration: newAppt.duration,
      notes: newAppt.notes || undefined,
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">Schedule and manage patient consultations</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Patient *</Label>
                <Select value={newAppt.patientId} onValueChange={(v) => setNewAppt({ ...newAppt, patientId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients?.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.firstName} {p.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title *</Label>
                <Input value={newAppt.title} onChange={(e) => setNewAppt({ ...newAppt, title: e.target.value })} placeholder="e.g. Follicle Tracking" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={newAppt.type} onValueChange={(v) => setNewAppt({ ...newAppt, type: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="lab_test">Lab Test</SelectItem>
                      <SelectItem value="video_call">Video Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duration (min)</Label>
                  <Input type="number" value={newAppt.duration} onChange={(e) => setNewAppt({ ...newAppt, duration: parseInt(e.target.value) || 30 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date *</Label>
                  <Input type="date" value={newAppt.date} onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })} />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={newAppt.time} onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={newAppt.notes} onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })} placeholder="Additional notes..." />
              </div>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
                Schedule Appointment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search appointments..." className="pl-9" />
        </div>
        <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading appointments...</span>
            </div>
          ) : !appointments || appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No appointments scheduled</p>
              <p className="text-xs text-muted-foreground mt-1">Click "New Appointment" to schedule one</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-semibold text-primary">
                      {apt.date ? new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {apt.date ? new Date(apt.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "—"}
                    </p>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{apt.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{apt.type.replace("_", " ")} • {apt.duration} min</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {apt.type === "video_call" ? (
                      <Video className="w-4 h-4 text-blue-500" />
                    ) : (
                      <MapPin className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <Badge className={statusColor[apt.status] || "bg-gray-100 text-gray-800"}>
                    {apt.status.replace("_", " ")}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMutation.mutate({ id: apt.id, data: { status: "confirmed" } })}
                      disabled={apt.status === "confirmed"}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateMutation.mutate({ id: apt.id, data: { status: "completed" } })}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
