import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play, BookOpen, Heart, Pill, Users } from "lucide-react";

const categories = [
  { icon: BookOpen, label: "All Topics", count: 48 },
  { icon: Heart, label: "IVF Basics", count: 12 },
  { icon: Users, label: "Ovulation & Fertility", count: 10 },
  { icon: Pill, label: "Medications", count: 8 },
];

const videos = [
  {
    title: "IVF Explained: Step by Step",
    description: "A complete overview of the IVF process from start to finish.",
    duration: "6:45",
    views: "12.5K",
    image: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=400&h=300&fit=crop",
  },
  {
    title: "How Ovarian Stimulation Works",
    description: "Understand how medications help stimulate ovulation.",
    duration: "4:12",
    views: "8.3K",
    image: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=400&h=300&fit=crop",
  },
  {
    title: "Embryo Transfer: What to Expect",
    description: "A quick guide to the embryo transfer procedure and aftercare.",
    duration: "5:38",
    views: "15.2K",
    image: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=400&h=300&fit=crop",
  },
  {
    title: "Emotional Wellness During IVF",
    description: "Tips to manage stress and stay positive through your fertility journey.",
    duration: "3:59",
    views: "9.8K",
    image: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=400&h=300&fit=crop",
  },
];

const articles = [
  {
    title: "Best Time to Conceive: Facts and Myths",
    description: "Discover the science behind ovulation and fertility windows.",
    readTime: "5 min read",
    date: "May 10, 2024",
  },
  {
    title: "Nutrition for Fertility: What to Eat and Avoid",
    description: "Learn how the right nutrition can improve fertility and support a healthy pregnancy.",
    readTime: "6 min read",
    date: "May 6, 2024",
  },
  {
    title: "Stress and Fertility: The Hidden Connection",
    description: "How stress can impact your fertility and effective ways to manage it.",
    readTime: "4 min read",
    date: "May 2, 2024",
  },
];

export default function KnowledgeHub() {
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Knowledge Hub</h1>
        <p className="text-muted-foreground mt-1">Expert insights and trusted resources on IVF and fertility.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for videos, articles, FAQs and more..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
              <span className="text-xs ml-1">({cat.count})</span>
            </button>
          );
        })}
      </div>

      {/* Featured Videos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Videos</h2>
          <Button variant="outline">View all videos →</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.map((video, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-32 bg-muted overflow-hidden group">
                <img src={video.image} alt={video.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </span>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{video.description}</p>
                <p className="text-xs text-muted-foreground mt-3">{video.views} views</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Latest Articles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
          <Button variant="outline">View all articles →</Button>
        </div>
        <div className="space-y-4">
          {articles.map((article, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg">{article.title}</h3>
                <p className="text-muted-foreground mt-2">{article.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular FAQs */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Popular FAQs</h2>
        <div className="space-y-3">
          {[
            "What is IVF and how does it work?",
            "What are the chances of success with IVF?",
            "How much time does an IVF cycle take?",
            "Is IVF treatment painful?",
            "What should I do after an embryo transfer?",
          ].map((faq, idx) => (
            <Card key={idx} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="py-4 flex items-center justify-between">
                <p className="font-medium">{faq}</p>
                <span className="text-muted-foreground">→</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
