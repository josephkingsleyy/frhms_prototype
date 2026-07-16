import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientJourney from "./pages/PatientJourney";
import ClinicalCare from "./pages/ClinicalCare";
import CycleMonitoring from "./pages/CycleMonitoring";
import Laboratory from "./pages/Laboratory";
import Embryology from "./pages/Embryology";
import KnowledgeHub from "./pages/KnowledgeHub";
import AskSpecialist from "./pages/AskSpecialist";
import Financials from "./pages/Financials";
import Reports from "./pages/Reports";
import Administration from "./pages/Administration";
import Appointments from "./pages/Appointments";
import Medications from "./pages/Medications";
import BillingPayments from "./pages/BillingPayments";
import Settings from "./pages/Settings";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/patients" component={Patients} />
      <Route path="/patient-journey" component={PatientJourney} />
      <Route path="/clinical-care" component={ClinicalCare} />
      <Route path="/cycle-monitoring" component={CycleMonitoring} />
      <Route path="/laboratory" component={Laboratory} />
      <Route path="/embryology" component={Embryology} />
      <Route path="/knowledge-hub" component={KnowledgeHub} />
      <Route path="/ask-specialist" component={AskSpecialist} />
      <Route path="/financials" component={Financials} />
      <Route path="/reports" component={Reports} />
      <Route path="/administration" component={Administration} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/medications" component={Medications} />
      <Route path="/billing" component={BillingPayments} />
      <Route path="/settings" component={Settings} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <DashboardLayout>
            <Router />
          </DashboardLayout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
