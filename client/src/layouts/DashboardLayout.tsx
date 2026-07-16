import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Heart,
  Stethoscope,
  Activity,
  FlaskConical,
  Dna,
  BookOpen,
  MessageCircle,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Search,
  ChevronLeft,
  Calendar,
  Pill,
  Receipt,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Appointments", icon: Calendar, href: "/appointments" },
    ],
  },
  {
    title: "Patient Care",
    items: [
      { label: "Patients", icon: Users, href: "/patients" },
      { label: "Patient Journey", icon: Heart, href: "/patient-journey" },
      { label: "Clinical Care", icon: Stethoscope, href: "/clinical-care" },
      { label: "Cycle Monitoring", icon: Activity, href: "/cycle-monitoring" },
      { label: "Medications", icon: Pill, href: "/medications" },
    ],
  },
  {
    title: "Laboratory",
    items: [
      { label: "Lab Results", icon: FlaskConical, href: "/laboratory" },
      { label: "Embryology", icon: Dna, href: "/embryology" },
    ],
  },
  {
    title: "Engagement",
    items: [
      { label: "Knowledge Hub", icon: BookOpen, href: "/knowledge-hub" },
      { label: "Ask Specialist", icon: MessageCircle, href: "/ask-specialist" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Billing", icon: Receipt, href: "/billing" },
      { label: "Financials", icon: CreditCard, href: "/financials" },
      { label: "Reports", icon: BarChart3, href: "/reports" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Administration", icon: Settings, href: "/administration" },
      { label: "Settings", icon: Settings, href: "/settings" },
    ],
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, navigate] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return location === "/" || location === "/dashboard";
    return location === href;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 h-full flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-out ${
          collapsed ? "w-[72px]" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide">FRHMS</span>
              <span className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">Fertility Care</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navigationGroups.map((group) => (
            <div key={group.title} className="mb-3">
              {!collapsed && (
                <p className="px-4 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 mb-1">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        navigate(item.href);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 ${
                        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"
                      } ${
                        active
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-purple-900/20"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                      {!collapsed && <span className="text-[13px] font-medium">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="hidden md:flex items-center justify-center py-3 border-t border-sidebar-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* User */}
        <div className={`px-3 py-4 border-t border-sidebar-border ${collapsed ? "flex justify-center" : ""}`}>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback className="bg-purple-700 text-white text-xs">DR</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Dr. Ananya</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">IVF Specialist</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-72">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patients, records..."
                className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1.5 hover:bg-accent rounded-lg transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback className="bg-purple-600 text-white text-xs">DR</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">Dr. Ananya</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
