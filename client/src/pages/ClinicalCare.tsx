import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stethoscope, FileText, ClipboardList, Plus, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  reviewed: "bg-blue-100 text-blue-800",
};

export default function ClinicalCare() {
  const [isOpen, setIsOpen] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    patientId: "",
    assessmentType: "initial" as "initial" | "hormonal" | "ultrasound" | "semen_analysis" | "hysteroscopy" | "laparoscopy" | "genetic",
    assessmentDate: "",
    findings: "",
    diagnosis: "",
    recommendations: "",
    amh: "",
    fsh: "",
    lh: "",
    estradiol: "",
  });

  const utils = trpc.useUtils();
  const { data: assessments, isLoading } = trpc.clinicalAssessments.list.useQuery({ limit: 50, offset: 0 });
  const { data: patients } = trpc.patients.list.useQuery({ limit: 100, offset: 0 });

  const createMutation = trpc.clinicalAssessments.create.useMutation({
    onSuccess: () => {
      utils.clinicalAssessments.list.invalidate();
      setIsOpen(false);
      toast.success("Assessment created successfully");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCreate = () => {
    if (!newAssessment.patientId || !newAssessment.assessmentDate) {
      toast.error("Please fill required fields");
      return;
    }
    createMutation.mutate({
      patientId: parseInt(newAssessment.patientId),
      assessmentType: newAssessment.assessmentType,
      assessmentDate: new Date(newAssessment.assessmentDate),
      findings: newAssessment.findings || undefined,
      diagnosis: newAssessment.diagnosis || undefined,
      recommendations: newAssessment.recommendations || undefined,
      amh: newAssessment.amh || undefined,
      fsh: newAssessment.fsh || undefined,
      lh: newAssessment.lh || undefined,
      estradiol: newAssessment.estradiol || undefined,
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clinical Care</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage assessments, diagnoses, and treatment plans</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> New Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Clinical Assessment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Patient *</Label>
                <Select value={newAssessment.patientId} onValueChange={(v) => setNewAssessment({ ...newAssessment, patientId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients?.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.firstName} {p.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Assessment Type *</Label>
                  <Select value={newAssessment.assessmentType} onValueChange={(v) => setNewAssessment({ ...newAssessment, assessmentType: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">Initial</SelectItem>
                      <SelectItem value="hormonal">Hormonal</SelectItem>
                      <SelectItem value="ultrasound">Ultrasound</SelectItem>
                      <SelectItem value="semen_analysis">Semen Analysis</SelectItem>
                      <SelectItem value="hysteroscopy">Hysteroscopy</SelectItem>
                      <SelectItem value="laparoscopy">Laparoscopy</SelectItem>
                      <SelectItem value="genetic">Genetic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date *</Label>
                  <Input type="date" value={newAssessment.assessmentDate} onChange={(e) => setNewAssessment({ ...newAssessment, assessmentDate: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label>AMH</Label>
                  <Input value={newAssessment.amh} onChange={(e) => setNewAssessment({ ...newAssessment, amh: e.target.value })} placeholder="ng/mL" />
                </div>
                <div>
                  <Label>FSH</Label>
                  <Input value={newAssessment.fsh} onChange={(e) => setNewAssessment({ ...newAssessment, fsh: e.target.value })} placeholder="mIU/mL" />
                </div>
                <div>
                  <Label>LH</Label>
                  <Input value={newAssessment.lh} onChange={(e) => setNewAssessment({ ...newAssessment, lh: e.target.value })} placeholder="mIU/mL" />
                </div>
                <div>
                  <Label>Estradiol</Label>
                  <Input value={newAssessment.estradiol} onChange={(e) => setNewAssessment({ ...newAssessment, estradiol: e.target.value })} placeholder="pg/mL" />
                </div>
              </div>
              <div>
                <Label>Findings</Label>
                <Input value={newAssessment.findings} onChange={(e) => setNewAssessment({ ...newAssessment, findings: e.target.value })} placeholder="Clinical findings..." />
              </div>
              <div>
                <Label>Diagnosis</Label>
                <Input value={newAssessment.diagnosis} onChange={(e) => setNewAssessment({ ...newAssessment, diagnosis: e.target.value })} placeholder="Diagnosis..." />
              </div>
              <div>
                <Label>Recommendations</Label>
                <Input value={newAssessment.recommendations} onChange={(e) => setNewAssessment({ ...newAssessment, recommendations: e.target.value })} placeholder="Treatment recommendations..." />
              </div>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Stethoscope className="w-4 h-4 mr-2" />}
                Create Assessment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="assessments">
        <TabsList>
          <TabsTrigger value="assessments"><ClipboardList className="w-4 h-4 mr-2" /> Assessments</TabsTrigger>
          <TabsTrigger value="treatments"><FileText className="w-4 h-4 mr-2" /> Treatment Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading assessments...</span>
                </div>
              ) : !assessments || assessments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Stethoscope className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No assessments recorded</p>
                  <p className="text-xs text-muted-foreground mt-1">Click "New Assessment" to create one</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Patient</th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Type</th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Date</th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Diagnosis</th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((a) => (
                        <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium">Patient #{a.patientId}</td>
                          <td className="px-6 py-4 text-sm capitalize">{a.assessmentType.replace("_", " ")}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {a.assessmentDate ? new Date(a.assessmentDate).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-6 py-4 text-sm">{a.diagnosis || "—"}</td>
                          <td className="px-6 py-4">
                            <Badge className={statusColor[a.status] || "bg-gray-100 text-gray-800"}>{a.status}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Button variant="outline" size="sm" onClick={() => toast.info("Feature coming soon")}>View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatments" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Treatment plans are generated from IVF Cycles</p>
                <p className="text-xs text-muted-foreground mt-1">Navigate to "Cycle Monitoring" to manage active treatment cycles</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
