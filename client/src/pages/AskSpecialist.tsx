import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Clock, CheckCircle } from "lucide-react";

const specialist = {
  name: "Dr. Meera Krishnan",
  title: "Senior IVF Consultant",
  credentials: "MBBS, DGO, DNB (OG), FNB (Repro)",
  experience: "15+ Years Experience",
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
};

const qnaHistory = [
  {
    question: "Embryo Grading – Is Grade 3 good for transfer?",
    status: "Answered",
    date: "12 May 2024",
    preview: "I was told my embryo is Grade 3 on Day 5. What are the chances of success...",
  },
  {
    question: "Post Egg Retrieval – Mild Pain & Bloating",
    status: "Pending",
    date: "Expected within 24–48 hours",
    preview: "It's been 2 days since my egg retrieval. I'm experiencing mild pain...",
  },
  {
    question: "Medications – Side Effects",
    status: "Answered",
    date: "02 May 2024",
    preview: "I've been taking Gonal-F for 5 days and experiencing headaches...",
  },
];

export default function AskSpecialist() {
  const [selectedTab, setSelectedTab] = useState("ask");
  const [question, setQuestion] = useState("");
  const [details, setDetails] = useState("");

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Ask the Specialist</h1>
        <p className="text-muted-foreground mt-1">Get personalized answers to your fertility and treatment related questions from our experienced IVF specialists.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setSelectedTab("ask")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                selectedTab === "ask"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Ask a New Question
            </button>
            <button
              onClick={() => setSelectedTab("history")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                selectedTab === "history"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Your Questions & Answers
            </button>
          </div>

          {/* Ask Tab */}
          {selectedTab === "ask" && (
            <Card>
              <CardHeader>
                <CardTitle>Ask a New Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Your Question</label>
                  <Input
                    placeholder="Type your question here..."
                    className="mt-2"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">0/1000 characters</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Add relevant details (optional)</label>
                  <Textarea
                    placeholder="Provide any additional context that might help the specialist..."
                    className="mt-2 min-h-24"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Attach Report / Document</label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-purple-600 transition-colors">
                    <p className="text-sm text-muted-foreground">PDF, JPG, PNG (Max. 10MB)</p>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">ℹ</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Answer by IVF Specialist</p>
                      <p className="text-xs text-muted-foreground mt-1">You will receive an answer within 24–48 hours</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">₹299</div>
                  <Button className="bg-purple-600 hover:bg-purple-700">Proceed to Pay ₹299</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* History Tab */}
          {selectedTab === "history" && (
            <div className="space-y-4">
              {qnaHistory.map((item, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.question}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{item.preview}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <Badge variant={item.status === "Answered" ? "default" : "secondary"}>
                            {item.status === "Answered" ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> {item.status}</>
                            ) : (
                              <><Clock className="w-3 h-3 mr-1" /> {item.status}</>
                            )}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Answer</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Specialist Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarImage src={specialist.image} />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mt-3">{specialist.name}</h3>
                <p className="text-sm text-purple-600 font-medium">{specialist.title}</p>
                <p className="text-xs text-muted-foreground mt-2">{specialist.credentials}</p>
                <p className="text-xs text-muted-foreground">{specialist.experience}</p>
                <Button variant="outline" className="w-full mt-4">View Profile</Button>
              </div>
            </CardContent>
          </Card>

          {/* Why Ask Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Why ask our specialists?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: "👨‍⚕️", text: "Experienced IVF specialists" },
                { icon: "💬", text: "Personalized & confidential answers" },
                { icon: "📋", text: "Evidence-based guidance" },
                { icon: "🔒", text: "Safe & secure platform" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <p className="text-sm font-medium">Need Immediate Help?</p>
              <p className="text-xs text-muted-foreground mt-2">For urgent medical concerns, please contact our care team.</p>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">Contact Care Team</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
