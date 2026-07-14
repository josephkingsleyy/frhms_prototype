import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, ChevronDown } from "lucide-react";

const journeyStages = [
  {
    stage: "Registration & Medical History",
    status: "Completed",
    date: "March 15, 2024",
    details: "Patient registered and provided complete medical history.",
    icon: CheckCircle,
  },
  {
    stage: "Initial Assessment",
    status: "Completed",
    date: "March 22, 2024",
    details: "Initial consultation with Dr. Ananya Sharma. Diagnosis: PCOS.",
    icon: CheckCircle,
  },
  {
    stage: "Hormonal Assessment",
    status: "Completed",
    date: "April 5, 2024",
    details: "FSH: 8.2, LH: 12.5, Prolactin: Normal. Ultrasound: Multiple follicles detected.",
    icon: CheckCircle,
  },
  {
    stage: "Treatment Planning",
    status: "Completed",
    date: "April 12, 2024",
    details: "Recommended: Standard IVF Protocol with GnRH Agonist.",
    icon: CheckCircle,
  },
  {
    stage: "Medication & Monitoring",
    status: "In Progress",
    date: "April 20 - May 10, 2024",
    details: "Patient on Gonal-F 300IU daily. Monitoring cycle with ultrasounds.",
    icon: Clock,
  },
  {
    stage: "Egg Retrieval",
    status: "Pending",
    date: "Expected: May 15, 2024",
    details: "Scheduled for egg retrieval procedure.",
    icon: AlertCircle,
  },
  {
    stage: "Embryology & Transfer",
    status: "Pending",
    date: "Expected: May 18-20, 2024",
    details: "Embryo development monitoring and transfer planning.",
    icon: AlertCircle,
  },
  {
    stage: "Pregnancy Test",
    status: "Pending",
    date: "Expected: June 2, 2024",
    details: "Beta hCG test to confirm pregnancy.",
    icon: AlertCircle,
  },
];

export default function PatientJourney() {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState("Sarah Johnson");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600";
      case "In Progress":
        return "text-blue-600";
      case "Pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Patient Journey</h1>
        <p className="text-muted-foreground mt-1">Track the complete fertility treatment timeline for each patient.</p>
      </div>

      {/* Patient Selection */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {["Sarah Johnson", "Emily Davis", "Jessica Lee", "Michelle Brown"].map((name) => (
          <button
            key={name}
            onClick={() => setSelectedPatient(name)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedPatient === name
                ? "bg-purple-600 text-white"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <p className="text-lg font-semibold mt-1">{selectedPatient}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age / Gender</p>
              <p className="text-lg font-semibold mt-1">32 / Female</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Diagnosis</p>
              <p className="text-lg font-semibold mt-1">PCOS</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Journey Progress</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "62.5%" }}></div>
                </div>
                <p className="text-sm font-medium mt-1">62.5%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Timeline */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Treatment Timeline</h2>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-600 via-blue-600 to-yellow-600"></div>

          {/* Timeline Items */}
          <div className="space-y-4">
            {journeyStages.map((item, idx) => {
              const Icon = item.icon;
              const isExpanded = expandedStage === idx;

              return (
                <div key={idx} className="ml-20">
                  <button
                    onClick={() => setExpandedStage(isExpanded ? null : idx)}
                    className="w-full text-left"
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="absolute -left-12 mt-1">
                              <Icon className={`w-6 h-6 ${getIconColor(item.status)}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{item.stage}</h3>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.date}</p>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-muted-foreground transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-foreground">{item.details}</p>
                            {item.status === "Completed" && (
                              <Button variant="outline" size="sm" className="mt-3">
                                View Details
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Continue daily Gonal-F injections as prescribed</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Attend ultrasound monitoring on May 12, 2024</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Prepare for egg retrieval procedure scheduled for May 15, 2024</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
