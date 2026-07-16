import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, TrendingUp, Calendar, AlertCircle, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  planned: "bg-blue-100 text-blue-800",
  stimulation: "bg-purple-100 text-purple-800",
  trigger: "bg-orange-100 text-orange-800",
  retrieval: "bg-green-100 text-green-800",
  fertilization: "bg-teal-100 text-teal-800",
  culture: "bg-indigo-100 text-indigo-800",
  transfer: "bg-pink-100 text-pink-800",
  tww: "bg-yellow-100 text-yellow-800",
  pregnant: "bg-emerald-100 text-emerald-800",
  not_pregnant: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
  completed: "bg-green-100 text-green-800",
};

export default function CycleMonitoring() {
  const [isOpen, setIsOpen] = useState(false);
  const [newCycle, setNewCycle] = useState({
    patientId: "",
    cycleType: "ivf" as const,
    cycleNumber: 1,
    protocol: "",
    notes: "",
  });

  const utils = trpc.useUtils();
  const { data: cycles, isLoading } = trpc.ivfCycles.list.useQuery({});

  const createMutation = trpc.ivfCycles.create.useMutation({
    onSuccess: () => {
      utils.ivfCycles.list.invalidate();
      setIsOpen(false);
      setNewCycle({ patientId: "", cycleType: "ivf", cycleNumber: 1, protocol: "", notes: "" });
      toast.success("IVF cycle created successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCreate = () => {
    if (!newCycle.patientId) {
      toast.error("Please select a patient");
      return;
    }
    createMutation.mutate({
      patientId: parseInt(newCycle.patientId),
      cycleType: newCycle.cycleType,
      cycleNumber: newCycle.cycleNumber,
      protocol: newCycle.protocol || undefined,
      startDate: new Date(),
      notes: newCycle.notes || undefined,
    });
  };

  const activeCycles = cycles?.filter((c: any) => !["completed", "cancelled", "not_pregnant"].includes(c.status)) || [];
  const triggerReady = cycles?.filter((c: any) => c.status === "trigger") || [];

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cycle Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-1">Track hormonal levels, ultrasound data, and medication protocols</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> New Cycle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New IVF Cycle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Patient ID</Label>
                <Input type="number" value={newCycle.patientId} onChange={(e) => setNewCycle({ ...newCycle, patientId: e.target.value })} placeholder="Enter patient ID" />
              </div>
              <div>
                <Label>Cycle Type</Label>
                <select className="w-full border rounded-md p-2 text-sm" value={newCycle.cycleType} onChange={(e) => setNewCycle({ ...newCycle, cycleType: e.target.value as any })}>
                  <option value="ivf">IVF</option>
                  <option value="icsi">ICSI</option>
                  <option value="iui">IUI</option>
                  <option value="fet">FET</option>
                  <option value="egg_freezing">Egg Freezing</option>
                  <option value="donor_egg">Donor Egg</option>
                  <option value="surrogacy">Surrogacy</option>
                </select>
              </div>
              <div>
                <Label>Cycle Number</Label>
                <Input type="number" value={newCycle.cycleNumber} onChange={(e) => setNewCycle({ ...newCycle, cycleNumber: parseInt(e.target.value) || 1 })} />
              </div>
              <div>
                <Label>Protocol</Label>
                <Input value={newCycle.protocol} onChange={(e) => setNewCycle({ ...newCycle, protocol: e.target.value })} placeholder="e.g., Long Agonist, Antagonist" />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={newCycle.notes} onChange={(e) => setNewCycle({ ...newCycle, notes: e.target.value })} placeholder="Optional notes" />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Start Cycle"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{activeCycles.length}</p>
              <p className="text-xs text-muted-foreground">Active Cycles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{triggerReady.length}</p>
              <p className="text-xs text-muted-foreground">Trigger Ready</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{cycles?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total Cycles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Cycles Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Cycles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading cycles...</div>
          ) : !cycles || cycles.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No cycles found. Start a new IVF cycle to begin monitoring.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">ID</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Patient ID</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Type</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Cycle #</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Protocol</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Eggs Retrieved</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Embryos</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cycles.map((c: any) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono">{c.id}</td>
                      <td className="px-6 py-4 text-sm">{c.patientId}</td>
                      <td className="px-6 py-4 text-sm font-medium uppercase">{c.cycleType}</td>
                      <td className="px-6 py-4 text-sm">{c.cycleNumber}</td>
                      <td className="px-6 py-4 text-sm">{c.protocol || "—"}</td>
                      <td className="px-6 py-4 text-sm font-medium">{c.eggsRetrieved ?? "—"}</td>
                      <td className="px-6 py-4 text-sm font-medium">{c.embryosFormed ?? "—"}</td>
                      <td className="px-6 py-4">
                        <Badge className={statusColors[c.status] || "bg-gray-100 text-gray-800"}>{c.status}</Badge>
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
