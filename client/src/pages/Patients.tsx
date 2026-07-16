import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, Loader2, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  completed: "bg-purple-100 text-purple-800",
  transferred: "bg-yellow-100 text-yellow-800",
};

export default function Patients() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "female" as "female" | "male" | "other",
    bloodGroup: "",
    maritalStatus: "single" as "single" | "married" | "divorced" | "widowed",
    partnerName: "",
    yearsOfInfertility: 0,
    notes: "",
  });

  const utils = trpc.useUtils();
  const { data: patients, isLoading } = trpc.patients.list.useQuery({ limit: 100, offset: 0 });
  
  const createMutation = trpc.patients.create.useMutation({
    onSuccess: () => {
      utils.patients.list.invalidate();
      setIsOpen(false);
      toast.success("Patient registered successfully");
      setNewPatient({ firstName: "", lastName: "", email: "", phone: "", gender: "female", bloodGroup: "", maritalStatus: "single", partnerName: "", yearsOfInfertility: 0, notes: "" });
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.patients.delete.useMutation({
    onSuccess: () => {
      utils.patients.list.invalidate();
      toast.success("Patient removed");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCreate = () => {
    const patientId = `P${Date.now().toString(36).toUpperCase()}`;
    createMutation.mutate({
      patientId,
      firstName: newPatient.firstName,
      lastName: newPatient.lastName,
      email: newPatient.email || undefined,
      phone: newPatient.phone || undefined,
      gender: newPatient.gender,
      bloodGroup: newPatient.bloodGroup || undefined,
      maritalStatus: newPatient.maritalStatus,
      partnerName: newPatient.partnerName || undefined,
      yearsOfInfertility: newPatient.yearsOfInfertility || undefined,
      notes: newPatient.notes || undefined,
    });
  };

  const filteredPatients = patients?.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.patientId.toLowerCase().includes(term) ||
      (p.email && p.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and view all registered fertility patients</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Patient</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input value={newPatient.firstName} onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })} placeholder="First name" />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input value={newPatient.lastName} onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })} placeholder="Last name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={newPatient.email} onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} placeholder="email@example.com" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={newPatient.phone} onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} placeholder="+1234567890" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gender</Label>
                  <Select value={newPatient.gender} onValueChange={(v) => setNewPatient({ ...newPatient, gender: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Blood Group</Label>
                  <Input value={newPatient.bloodGroup} onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })} placeholder="e.g. O+" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Marital Status</Label>
                  <Select value={newPatient.maritalStatus} onValueChange={(v) => setNewPatient({ ...newPatient, maritalStatus: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Partner Name</Label>
                  <Input value={newPatient.partnerName} onChange={(e) => setNewPatient({ ...newPatient, partnerName: e.target.value })} placeholder="Partner's name" />
                </div>
              </div>
              <div>
                <Label>Years of Infertility</Label>
                <Input type="number" value={newPatient.yearsOfInfertility || ""} onChange={(e) => setNewPatient({ ...newPatient, yearsOfInfertility: parseInt(e.target.value) || 0 })} placeholder="0" />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={newPatient.notes} onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })} placeholder="Additional notes..." />
              </div>
              <Button onClick={handleCreate} disabled={!newPatient.firstName || !newPatient.lastName || createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Register Patient
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, ID, or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
      </div>

      {/* Patient Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading patients...</span>
            </div>
          ) : !filteredPatients || filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No patients found</p>
              <p className="text-xs text-muted-foreground mt-1">Click "Add Patient" to register your first patient</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Patient</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">ID</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Gender</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Contact</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Registered</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-medium">
                              {p.firstName[0]}{p.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{p.firstName} {p.lastName}</p>
                            {p.partnerName && <p className="text-xs text-muted-foreground">Partner: {p.partnerName}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{p.patientId}</td>
                      <td className="px-6 py-4 text-sm capitalize">{p.gender}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{p.email || "—"}</div>
                        <div className="text-xs text-muted-foreground">{p.phone || "—"}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={statusColor[p.status] || "bg-gray-100 text-gray-800"}>{p.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => toast.info("Feature coming soon")}>View</Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => deleteMutation.mutate({ id: p.id })}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
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
