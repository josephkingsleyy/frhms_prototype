import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Loader2, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const specialist = {
  name: "Dr. Meera Krishnan",
  title: "Senior IVF Consultant",
  credentials: "MBBS, DGO, DNB (OG), FNB (Repro)",
  experience: "15+ Years Experience",
};

export default function AskSpecialist() {
  const [selectedTab, setSelectedTab] = useState("ask");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");

  const utils = trpc.useUtils();
  const { data: sessions, isLoading } = trpc.qna.list.useQuery({});

  const createMutation = trpc.qna.create.useMutation({
    onSuccess: () => {
      utils.qna.list.invalidate();
      setQuestion("");
      setCategory("");
      setSelectedTab("history");
      toast.success("Question submitted successfully! You will receive an answer within 24-48 hours.");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleSubmit = () => {
    if (!question.trim()) {
      toast.error("Please enter your question");
      return;
    }
    createMutation.mutate({
      patientId: 1,
      question: question.trim(),
      category: category || undefined,
    });
  };

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
              Your Questions & Answers ({sessions?.length || 0})
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
                  <label className="text-sm font-medium">Your Question *</label>
                  <Textarea
                    placeholder="Type your question here..."
                    className="mt-2 min-h-28"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{question.length}/1000 characters</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Category (optional)</label>
                  <Input
                    placeholder="e.g., IVF, Medications, Embryo Transfer"
                    className="mt-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                      <span className="text-sm font-semibold">i</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Answer by IVF Specialist</p>
                      <p className="text-xs text-muted-foreground mt-1">You will receive an answer within 24-48 hours</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">$29 <span className="text-xs text-muted-foreground font-normal">Inclusive of all taxes</span></div>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleSubmit}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Submit Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* History Tab */}
          {selectedTab === "history" && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading your questions...</span>
                </div>
              ) : !sessions || sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No questions submitted yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Switch to "Ask a New Question" to get started</p>
                </div>
              ) : (
                sessions.map((session: any) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{session.question}</h3>
                          {session.answer && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                              <p className="text-sm text-green-800">{session.answer}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-3">
                            <Badge variant={session.status === "answered" ? "default" : "secondary"}>
                              {session.status === "answered" ? (
                                <><CheckCircle className="w-3 h-3 mr-1" /> Answered</>
                              ) : (
                                <><Clock className="w-3 h-3 mr-1" /> {session.status}</>
                              )}
                            </Badge>
                            {session.category && <span className="text-xs text-muted-foreground">• {session.category}</span>}
                            <span className="text-xs text-muted-foreground">
                              {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : ""}
                            </span>
                          </div>
                        </div>
                        {session.status === "answered" && (
                          <Button variant="outline" size="sm" onClick={() => toast.info("Feature coming soon")}>View Answer</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
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
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-lg">MK</AvatarFallback>
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
                "Experienced IVF specialists",
                "Personalized & confidential answers",
                "Evidence-based guidance",
                "Safe & secure platform",
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{text}</p>
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
