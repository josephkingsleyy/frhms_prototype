import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlaskConical, Plus, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  requested: "bg-yellow-100 text-yellow-800",
  sample_collected: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  results_ready: "bg-green-100 text-green-800",
  reviewed: "bg-teal-100 text-teal-800",
};

export default function Laboratory() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [newLab, setNewLab] = useState({
    patientId: "",
    testName: "",
    testCategory: "hormonal" as "hormonal" | "genetic" | "semen" | "blood" | "imaging" | "other",
    priority: "routine" as "routine" | "urgent" | "stat",
    notes: "",
  });

  const utils = trpc.useUtils();
  const { data: patients } = trpc.patients.list.useQuery({ limit: 100, offset: 0 });
  const { data: labResults, isLoading } = trpc.labResults.byPatient.useQuery(
    { patientId: parseInt(selectedPatientId) || 1 },
    { enabled: selectedPatientId !== "" }
  );

  const createMutation = trpc.labResults.create.useMutation({
    onSuccess: () => {
      utils.labResults.byPatient.invalidate();
      setIsOpen(false);
      setNewLab({ patientId: "", testName: "", testCategory: "hormonal", priority: "routine", notes: "" });
      toast.success("Lab request created successfully");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleCreate = () => {
    if (!newLab.patientId || !newLab.testName) {
      toast.error("Please fill required fields");
      return;
    }
    createMutation.mutate({
      patientId: parseInt(newLab.patientId),
      testName: newLab.testName,
      testCategory: newLab.testCategory,
      testDate: new Date(),
      notes: newLab.notes || undefined,
    });
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lab Results</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage lab requests, sample collection, and results</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> New Lab Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Lab Request</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Patient *</Label>
                <Select value={newLab.patientId} onValueChange={(v) => setNewLab({ ...newLab, patientId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients?.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.firstName} {p.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Test Name *</Label>
                <Input value={newLab.testName} onChange={(e) => setNewLab({ ...newLab, testName: e.target.value })} placeholder="e.g., FSH, LH, Semen Analysis" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={newLab.testCategory} onValueChange={(v) => setNewLab({ ...newLab, testCategory: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hormonal">Hormonal</SelectItem>
                      <SelectItem value="genetic">Genetic</SelectItem>
                      <SelectItem value="semen">Semen</SelectItem>
                      <SelectItem value="blood">Blood</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={newLab.priority} onValueChange={(v) => setNewLab({ ...newLab, priority: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={newLab.notes} onChange={(e) => setNewLab({ ...newLab, notes: e.target.value })} placeholder="Additional notes..." />
              </div>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FlaskConical className="w-4 h-4 mr-2" />}
                Create Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Patient Filter */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <p className="font-semibold">Select Patient:</p>
              <p className="text-sm text-muted-foreground">View lab results for a specific patient</p>
            </div>
          </div>
          <Select value={selectedPatientId} onValueChange={handlePatientSelect}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Choose a patient..." />
            </SelectTrigger>
            <SelectContent>
              {patients?.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.firstName} {p.lastName} (ID: {p.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {!selectedPatientId ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FlaskConical className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Select a patient to view lab results</p>
              <p className="text-xs text-muted-foreground mt-1">Choose from the patient dropdown above</p>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading lab results...</span>
            </div>
          ) : !labResults || labResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FlaskConical className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No lab requests found</p>
              <p className="text-xs text-muted-foreground mt-1">Click "New Lab Request" to create one</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Test</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Category</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Priority</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {labResults.map((lab: any) => (
                    <tr key={lab.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm">{lab.testName}</td>
                      <td className="px-6 py-4 text-sm capitalize">{lab.testCategory?.replace("_", " ") || "—"}</td>
                      <td className="px-6 py-4">
                        <Badge variant={lab.priority === "stat" ? "destructive" : lab.priority === "urgent" ? "default" : "secondary"} className="text-xs">
                          {lab.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={statusColor[lab.status] || "bg-gray-100 text-gray-800"}>
                          {lab.status?.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {lab.requestedDate ? new Date(lab.requestedDate).toLocaleDateString() : "—"}
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
