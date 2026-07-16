import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dna, Snowflake, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  developing: "bg-blue-100 text-blue-800",
  arrested: "bg-red-100 text-red-800",
  transferred: "bg-pink-100 text-pink-800",
  frozen: "bg-cyan-100 text-cyan-800",
  discarded: "bg-gray-100 text-gray-800",
  biopsied: "bg-yellow-100 text-yellow-800",
};

export default function Embryology() {
  const [isOpen, setIsOpen] = useState(false);
  const [cycleIdFilter, setCycleIdFilter] = useState("1");
  const [newEmbryo, setNewEmbryo] = useState({
    cycleId: "",
    patientId: "",
    embryoNumber: 1,
    fertilizationMethod: "icsi" as const,
    notes: "",
  });

  const utils = trpc.useUtils();
  const { data: embryos, isLoading } = trpc.embryology.byCycle.useQuery(
    { cycleId: parseInt(cycleIdFilter) || 1 }
  );

  const createMutation = trpc.embryology.create.useMutation({
    onSuccess: () => {
      utils.embryology.byCycle.invalidate();
      setIsOpen(false);
      setNewEmbryo({ cycleId: "", patientId: "", embryoNumber: 1, fertilizationMethod: "icsi", notes: "" });
      toast.success("Embryo record created successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleCreate = () => {
    if (!newEmbryo.cycleId || !newEmbryo.patientId) {
      toast.error("Please fill required fields");
      return;
    }
    createMutation.mutate({
      cycleId: parseInt(newEmbryo.cycleId),
      patientId: parseInt(newEmbryo.patientId),
      embryoNumber: newEmbryo.embryoNumber,
      fertilizationMethod: newEmbryo.fertilizationMethod,
      fertilizationDate: new Date(),
      notes: newEmbryo.notes || undefined,
    });
  };

  // Group embryos by status for Kanban view
  const groupedEmbryos: Record<string, any[]> = {
    developing: [],
    biopsied: [],
    transferred: [],
    frozen: [],
    arrested: [],
    discarded: [],
  };
  embryos?.forEach((e: any) => {
    if (groupedEmbryos[e.status]) {
      groupedEmbryos[e.status].push(e);
    } else {
      groupedEmbryos.developing.push(e);
    }
  });

  const kanbanColumns = [
    { title: "Developing", status: "developing", color: "bg-blue-500" },
    { title: "Biopsied (PGT)", status: "biopsied", color: "bg-yellow-500" },
    { title: "Transferred", status: "transferred", color: "bg-pink-500" },
    { title: "Frozen", status: "frozen", color: "bg-cyan-500" },
    { title: "Arrested", status: "arrested", color: "bg-red-500" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Embryology Workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">Track embryo development from fertilization to transfer</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Snowflake className="w-4 h-4 mr-2" /> Cryo Log
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> Record Embryo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Embryo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Cycle ID</Label>
                  <Input type="number" value={newEmbryo.cycleId} onChange={(e) => setNewEmbryo({ ...newEmbryo, cycleId: e.target.value })} placeholder="Enter cycle ID" />
                </div>
                <div>
                  <Label>Patient ID</Label>
                  <Input type="number" value={newEmbryo.patientId} onChange={(e) => setNewEmbryo({ ...newEmbryo, patientId: e.target.value })} placeholder="Enter patient ID" />
                </div>
                <div>
                  <Label>Embryo Number</Label>
                  <Input type="number" value={newEmbryo.embryoNumber} onChange={(e) => setNewEmbryo({ ...newEmbryo, embryoNumber: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <Label>Fertilization Method</Label>
                  <select className="w-full border rounded-md p-2 text-sm" value={newEmbryo.fertilizationMethod} onChange={(e) => setNewEmbryo({ ...newEmbryo, fertilizationMethod: e.target.value as any })}>
                    <option value="ivf">IVF</option>
                    <option value="icsi">ICSI</option>
                    <option value="split">Split</option>
                  </select>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Input value={newEmbryo.notes} onChange={(e) => setNewEmbryo({ ...newEmbryo, notes: e.target.value })} placeholder="Optional notes" />
                </div>
                <Button onClick={handleCreate} className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Record Embryo"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cycle Filter */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
              <Dna className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <p className="font-semibold">Viewing Cycle ID:</p>
              <p className="text-sm text-muted-foreground">Filter embryos by IVF cycle</p>
            </div>
          </div>
          <Input
            type="number"
            value={cycleIdFilter}
            onChange={(e) => setCycleIdFilter(e.target.value)}
            className="w-32"
            placeholder="Cycle ID"
          />
        </CardContent>
      </Card>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading embryo records...</div>
      ) : !embryos || embryos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Dna className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No embryo records found for this cycle. Record a new embryo to begin tracking.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {kanbanColumns.map((col) => (
              <div key={col.status} className="w-64 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${col.color}`}></div>
                  <h3 className="text-sm font-semibold">{col.title}</h3>
                  <span className="text-xs text-muted-foreground ml-auto bg-muted px-2 py-0.5 rounded-full">
                    {groupedEmbryos[col.status]?.length || 0}
                  </span>
                </div>
                <div className="space-y-2">
                  {groupedEmbryos[col.status]?.map((embryo: any) => (
                    <Card key={embryo.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-muted-foreground">E{String(embryo.embryoNumber).padStart(3, "0")}</span>
                          <Badge className={statusColors[embryo.status] || "bg-gray-100 text-gray-800"}>
                            {embryo.status}
                          </Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          {embryo.blastocystGrade && <p><span className="font-medium">Grade:</span> {embryo.blastocystGrade}</p>}
                          {embryo.fertilizationMethod && <p><span className="font-medium">Method:</span> {embryo.fertilizationMethod.toUpperCase()}</p>}
                          {embryo.pgtResult && <p><span className="font-medium">PGT:</span> {embryo.pgtResult}</p>}
                        </div>
                        {embryo.notes && <p className="text-xs text-muted-foreground">{embryo.notes}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Embryos", value: embryos?.length || 0, color: "text-blue-600" },
          { label: "Developing", value: groupedEmbryos.developing.length, color: "text-purple-600" },
          { label: "Transferred", value: groupedEmbryos.transferred.length, color: "text-pink-600" },
          { label: "Frozen", value: groupedEmbryos.frozen.length, color: "text-cyan-600" },
          { label: "Biopsied", value: groupedEmbryos.biopsied.length, color: "text-yellow-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
