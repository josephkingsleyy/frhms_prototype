import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Play, BookOpen, Heart, Pill, Users, Plus, Loader2, FileText, Video } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

const categories = [
  { icon: BookOpen, label: "All Topics", value: "" },
  { icon: Heart, label: "IVF Basics", value: "ivf" },
  { icon: Users, label: "Ovulation & Fertility", value: "fertility" },
  { icon: Pill, label: "Medications", value: "medications" },
];

export default function KnowledgeHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newContent, setNewContent] = useState({
    title: "",
    contentType: "article" as "article" | "video" | "guide" | "faq",
    category: "",
    summary: "",
    content: "",
    thumbnailUrl: "",
    videoUrl: "",
    accessLevel: "free" as "free" | "premium" | "subscriber",
  });

  const utils = trpc.useUtils();
  const { data: contentList, isLoading } = trpc.knowledge.list.useQuery({ published: true });

  const createMutation = trpc.knowledge.create.useMutation({
    onSuccess: () => {
      utils.knowledge.list.invalidate();
      setIsOpen(false);
      setNewContent({ title: "", contentType: "article", category: "", summary: "", content: "", thumbnailUrl: "", videoUrl: "", accessLevel: "free" });
      toast.success("Content published successfully");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCreate = () => {
    if (!newContent.title || !newContent.category) {
      toast.error("Please fill title and category");
      return;
    }
    const slug = newContent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    createMutation.mutate({
      title: newContent.title,
      slug,
      contentType: newContent.contentType,
      category: newContent.category || undefined,
      summary: newContent.summary || undefined,
      content: newContent.content || undefined,
      videoUrl: newContent.videoUrl || undefined,
      thumbnailUrl: newContent.thumbnailUrl || undefined,
      isPublished: true,
    });
  };

  const filteredContent = contentList?.filter((item) =>
    searchTerm ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Educational resources for patients and practitioners</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Publish New Content</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Title *</Label>
                <Input value={newContent.title} onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} placeholder="Content title..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type *</Label>
                  <Select value={newContent.contentType} onValueChange={(v) => setNewContent({ ...newContent, contentType: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Access Level</Label>
                  <Select value={newContent.accessLevel} onValueChange={(v) => setNewContent({ ...newContent, accessLevel: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="subscriber">Subscriber</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Category *</Label>
                <Input value={newContent.category} onChange={(e) => setNewContent({ ...newContent, category: e.target.value })} placeholder="e.g., ivf, fertility, medications" />
              </div>
              <div>
                <Label>Summary</Label>
                <Input value={newContent.summary} onChange={(e) => setNewContent({ ...newContent, summary: e.target.value })} placeholder="Brief summary..." />
              </div>
              <div>
                <Label>Content</Label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newContent.content}
                  onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  placeholder="Full content body..."
                />
              </div>
              {newContent.contentType === "video" && (
                <div>
                  <Label>Video URL</Label>
                  <Input value={newContent.videoUrl} onChange={(e) => setNewContent({ ...newContent, videoUrl: e.target.value })} placeholder="https://..." />
                </div>
              )}
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BookOpen className="w-4 h-4 mr-2" />}
                Publish Content
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Categories */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search articles, videos, guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat.label}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
            >
              <cat.icon className="w-4 h-4 mr-1" />
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading content...</span>
        </div>
      ) : !filteredContent || filteredContent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No content available</h3>
          <p className="text-sm text-muted-foreground mt-1">Click "Add Content" to publish educational resources</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContent.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                {item.contentType === "video" ? (
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                ) : (
                  <FileText className="w-12 h-12 text-primary/60" />
                )}
                <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-white/80 text-primary capitalize">
                  {item.isFeatured ? "Featured" : "Free"}
                </span>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {item.contentType === "video" ? <Video className="w-3 h-3 text-primary" /> : <FileText className="w-3 h-3 text-primary" />}
                  <span className="text-xs text-muted-foreground capitalize">{item.contentType} • {item.category}</span>
                </div>
                <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                {item.summary && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.summary}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.viewCount || 0} views</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
