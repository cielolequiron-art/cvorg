import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileJson, 
  Send, 
  Settings, 
  ChevronLeft,
  Car,
  ShieldCheck,
  Sparkles,
  FileText,
  Menu,
  X,
  ChevronRight,
  Share2,
  Truck
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExit: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onExit, 
  isCollapsed, 
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'entries', label: 'Entries', icon: FileText },
    { id: 'submissions', label: 'Submissions', icon: Users },
    { id: 'id-analyst', label: 'ID Analyst', icon: ShieldCheck },
    { id: 'vehicles', label: 'Vehicles', icon: Truck },
    { id: 'forms', label: 'Form Builder', icon: FileJson },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'social-media', label: 'Social Media', icon: Share2 },
    { id: 'ai-settings', label: 'AI Settings', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-50 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-all duration-300 ease-in-out lg:relative",
    isCollapsed ? "w-20" : "w-64",
    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={sidebarClasses}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", isCollapsed && "w-0 opacity-0")}>
            <div className="bg-blue-600 p-2 rounded-lg shrink-0">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">COMMAND</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Center</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0",
                activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"
              )} />
              {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              {isCollapsed && activeTab === item.id && (
                <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onExit}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all",
              isCollapsed && "justify-center"
            )}
            title={isCollapsed ? "Exit Admin" : undefined}
          >
            <ChevronLeft className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium">Exit Admin</span>}
          </button>
        </div>
      </div>
    </>
  );
};
