import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pill, Search, Plus, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  discontinued: "bg-red-100 text-red-800",
  on_hold: "bg-yellow-100 text-yellow-800",
};

export default function Medications() {
  const [isOpen, setIsOpen] = useState(false);
  const [patientIdFilter, setPatientIdFilter] = useState("1");
  const [newMed, setNewMed] = useState({
    patientId: "",
    name: "",
    dosage: "",
    frequency: "",
    route: "oral" as const,
    purpose: "",
    notes: "",
  });

  const utils = trpc.useUtils();
  const { data: medications, isLoading } = trpc.medications.byPatient.useQuery(
    { patientId: parseInt(patientIdFilter) || 1 }
  );

  const createMutation = trpc.medications.create.useMutation({
    onSuccess: () => {
      utils.medications.byPatient.invalidate();
      setIsOpen(false);
      setNewMed({ patientId: "", name: "", dosage: "", frequency: "", route: "oral", purpose: "", notes: "" });
      toast.success("Medication prescribed successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCreate = () => {
    if (!newMed.patientId || !newMed.name || !newMed.dosage) {
      toast.error("Please fill required fields");
      return;
    }
    createMutation.mutate({
      patientId: parseInt(newMed.patientId),
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency || undefined,
      route: newMed.route,
      startDate: new Date(),
      purpose: newMed.purpose || undefined,
      notes: newMed.notes || undefined,
    });
  };

  const activeMeds = medications?.filter((m: any) => m.status === "active") || [];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Medications</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage prescriptions, protocols, and medication tracking</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Prescribe Medication</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Patient ID</Label>
                <Input type="number" value={newMed.patientId} onChange={(e) => setNewMed({ ...newMed, patientId: e.target.value })} placeholder="Enter patient ID" />
              </div>
              <div>
                <Label>Medication Name *</Label>
                <Input value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} placeholder="e.g., Gonal-F (Follitropin alfa)" />
              </div>
              <div>
                <Label>Dosage *</Label>
                <Input value={newMed.dosage} onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })} placeholder="e.g., 300 IU daily" />
              </div>
              <div>
                <Label>Frequency</Label>
                <Input value={newMed.frequency} onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })} placeholder="e.g., Once daily" />
              </div>
              <div>
                <Label>Route</Label>
                <select className="w-full border rounded-md p-2 text-sm" value={newMed.route} onChange={(e) => setNewMed({ ...newMed, route: e.target.value as any })}>
                  <option value="oral">Oral</option>
                  <option value="injection_sc">Subcutaneous Injection</option>
                  <option value="injection_im">Intramuscular Injection</option>
                  <option value="vaginal">Vaginal</option>
                  <option value="topical">Topical</option>
                  <option value="nasal">Nasal</option>
                </select>
              </div>
              <div>
                <Label>Purpose</Label>
                <Input value={newMed.purpose} onChange={(e) => setNewMed({ ...newMed, purpose: e.target.value })} placeholder="e.g., Ovarian stimulation" />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Prescribing..." : "Prescribe Medication"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeMeds.length}</p>
              <p className="text-xs text-muted-foreground">Active Prescriptions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{medications?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total Prescriptions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Interaction Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Filter */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search medications..." className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm whitespace-nowrap">Patient ID:</Label>
          <Input type="number" value={patientIdFilter} onChange={(e) => setPatientIdFilter(e.target.value)} className="w-24" />
        </div>
      </div>

      {/* Prescriptions Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading medications...</div>
          ) : !medications || medications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No medications found for this patient. Prescribe a new medication to begin tracking.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Medication</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Dosage</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Route</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Frequency</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Purpose</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Start Date</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((rx: any) => (
                    <tr key={rx.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-primary" />
                          <span className="font-medium">{rx.name}</span>
                        </div>
                        {rx.genericName && <p className="text-xs text-muted-foreground ml-6">{rx.genericName}</p>}
                      </td>
                      <td className="py-3 px-2">{rx.dosage}</td>
                      <td className="py-3 px-2 capitalize">{rx.route?.replace("_", " ")}</td>
                      <td className="py-3 px-2">{rx.frequency || "—"}</td>
                      <td className="py-3 px-2 text-muted-foreground">{rx.purpose || "—"}</td>
                      <td className="py-3 px-2 text-xs">{new Date(rx.startDate).toLocaleDateString()}</td>
                      <td className="py-3 px-2">
                        <Badge className={statusColors[rx.status] || "bg-gray-100 text-gray-800"}>{rx.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
