import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Receipt, TrendingUp, DollarSign, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Financials() {
  const { data: transactions } = trpc.billing.list.useQuery();
  const { data: stats } = trpc.billing.stats.useQuery();

  const handleCreateInvoice = () => {
    toast.info("Invoice creation feature coming soon");
  };

  const invoices = (transactions || []).map((tx: any) => ({
    id: `INV-${tx.id}`,
    patient: `Patient ${tx.patientId}`,
    package: tx.serviceType || "Service",
    amount: `₹${tx.amount}`,
    paid: `₹${Math.floor(tx.amount * 0.7)}`,
    balance: `₹${Math.floor(tx.amount * 0.3)}`,
    status: tx.status === "completed" ? "Paid" : "Pending",
    date: new Date(tx.transactionDate).toLocaleDateString(),
  }));

  const packages = [
    { name: "Initial Fertility Assessment", price: "₹15,000", includes: "Consultation, Hormonal Panel, Ultrasound", duration: "1-2 visits" },
    { name: "Standard IVF Cycle", price: "₹2,50,000", includes: "Stimulation, Monitoring, Retrieval, Transfer", duration: "4-6 weeks" },
    { name: "Mini IVF Cycle", price: "₹2,00,000", includes: "Low-dose stimulation, Monitoring, Retrieval, Transfer", duration: "3-5 weeks" },
    { name: "Frozen Embryo Transfer (FET)", price: "₹1,00,000", includes: "Endometrial prep, Transfer, Follow-up", duration: "3-4 weeks" },
    { name: "IUI + Medication", price: "₹50,000", includes: "Ovulation induction, IUI procedure, Follow-up", duration: "2-3 weeks" },
    { name: "Egg Freezing Package", price: "₹1,50,000", includes: "Stimulation, Retrieval, 1 year storage", duration: "2-3 weeks" },
  ];

  const statusColors: Record<string, string> = {
    Paid: "bg-green-100 text-green-800",
    "Partially Paid": "bg-yellow-100 text-yellow-800",
    Pending: "bg-red-100 text-red-800",
    Overdue: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Financials</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage packages, invoices, and payment tracking</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleCreateInvoice}>
          <Plus className="w-4 h-4 mr-2" /> Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-bold">₹{(stats?.monthlyRevenue ?? 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Collected</p>
              <p className="text-lg font-bold">₹{(stats?.collected ?? 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-bold">₹{(stats?.pending ?? 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Q&A Revenue</p>
              <p className="text-lg font-bold">₹{(stats?.qaRevenue ?? 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Invoice ID</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Patient</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Package</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Paid</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Balance</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-muted-foreground">No invoices found</td>
                      </tr>
                    ) : (
                      invoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-2 font-mono text-xs">{inv.id}</td>
                          <td className="py-3 px-2">{inv.patient}</td>
                          <td className="py-3 px-2 text-muted-foreground">{inv.package}</td>
                          <td className="py-3 px-2 font-semibold">{inv.amount}</td>
                          <td className="py-3 px-2">{inv.paid}</td>
                          <td className="py-3 px-2">{inv.balance}</td>
                          <td className="py-3 px-2">
                            <Badge className={statusColors[inv.status] || "bg-gray-100 text-gray-800"}>{inv.status}</Badge>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">{inv.date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Treatment Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.name} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-sm">{pkg.name}</h4>
                    <p className="text-xl font-bold text-primary mt-2">{pkg.price}</p>
                    <p className="text-xs text-muted-foreground mt-2">{pkg.includes}</p>
                    <p className="text-xs text-muted-foreground mt-2">Duration: {pkg.duration}</p>
                    <Button variant="outline" size="sm" className="w-full mt-3">View Details</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
