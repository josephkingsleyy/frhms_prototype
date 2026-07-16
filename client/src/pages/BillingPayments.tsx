import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CreditCard, DollarSign, TrendingUp, Search, Download,
  ArrowUpRight, Receipt, Clock
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function BillingPayments() {
  const { data: transactions, isLoading: txLoading } = trpc.billing.list.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.billing.stats.useQuery();

  const handleExport = () => {
    toast.success("Exporting transactions...");
    // Implement CSV export logic
  };

  const handleNewInvoice = () => {
    toast.info("Invoice creation feature coming soon");
  };

  const monthlyRevenue = stats?.monthlyRevenue ?? 0;
  const collected = stats?.collected ?? 0;
  const pending = stats?.pending ?? 0;
  const qaRevenue = stats?.qaRevenue ?? 0;

  const packages = [
    { name: "Basic IVF Package", price: "₹2,50,000", includes: "Consultation + Stimulation + Retrieval + Transfer", patients: 12 },
    { name: "Premium IVF Package", price: "₹3,80,000", includes: "Basic + Embryo Freezing + 2 FET cycles", patients: 8 },
    { name: "IUI Package (3 cycles)", price: "₹75,000", includes: "3 IUI cycles + Monitoring + Medications", patients: 15 },
    { name: "Fertility Assessment", price: "₹15,000", includes: "Consultation + Hormonal Panel + Ultrasound", patients: 22 },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Billing & Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">Track revenue, invoices, and payment collections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleNewInvoice}>
            <Receipt className="w-4 h-4 mr-2" /> New Invoice
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="flex items-center text-xs text-green-600 font-medium">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />+18%
              </span>
            </div>
            <p className="text-2xl font-bold mt-3">₹{monthlyRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Revenue This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <span className="flex items-center text-xs text-green-600 font-medium">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />+12%
              </span>
            </div>
            <p className="text-2xl font-bold mt-3">₹{collected.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-3">₹{pending.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-3">₹{qaRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Q&A Revenue (MTD)</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search transactions, patients, invoices..." className="pl-9" />
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading transactions...</div>
          ) : !transactions || transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No transactions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Patient ID</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Method</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: any) => (
                    <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs">{tx.id}</td>
                      <td className="py-3 px-2">{tx.patientId}</td>
                      <td className="py-3 px-2 text-muted-foreground">{tx.serviceType || "Service"}</td>
                      <td className="py-3 px-2 font-semibold">₹{tx.amount.toLocaleString()}</td>
                      <td className="py-3 px-2 text-muted-foreground">{new Date(tx.transactionDate).toLocaleDateString()}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline">{tx.paymentMethod || "Unknown"}</Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={
                          tx.status === "completed" ? "bg-green-100 text-green-800" :
                          tx.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>{tx.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Packages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Treatment Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.name} className="p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                <h4 className="font-semibold text-sm">{pkg.name}</h4>
                <p className="text-xl font-bold text-primary mt-2">{pkg.price}</p>
                <p className="text-xs text-muted-foreground mt-2">{pkg.includes}</p>
                <p className="text-xs text-muted-foreground mt-2">{pkg.patients} active patients</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
