import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { HeartPulse, LayoutDashboard, BookOpen, MessageCircleQuestion, Route as RouteIcon } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/knowledge-hub", label: "Knowledge Hub", icon: BookOpen },
  { href: "/ask-specialist", label: "Ask Specialist", icon: MessageCircleQuestion },
  { href: "/patient-journey", label: "Patient Journey", icon: RouteIcon },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 shrink-0 border-r bg-background flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b">
          <HeartPulse className="w-6 h-6 text-purple-600" />
          <span className="font-semibold">FRHMS</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = location === href || (href === "/dashboard" && location === "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
