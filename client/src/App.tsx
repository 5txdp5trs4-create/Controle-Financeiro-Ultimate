import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { storage, type UserData } from "@/lib/storage";
import SplashScreen from "@/components/SplashScreen";
import LoginPage from "@/components/LoginPage";
import BottomNav from "@/components/BottomNav";
import DashboardPage from "@/pages/DashboardPage";
import HistoryPage from "@/pages/HistoryPage";
import StatisticsPage from "@/pages/StatisticsPage";
import PlanningPage from "@/pages/PlanningPage";
import SettingsPage from "@/pages/SettingsPage";

type Tab = 'inicio' | 'historico' | 'estatisticas' | 'planejamentos' | 'ajustes';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('inicio');

  useEffect(() => {
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (userData: UserData) => {
    storage.saveUser(userData);
    setUser(userData);
  };

  const handleLogout = () => {
    storage.clearUser();
    setUser(null);
    setActiveTab('inicio');
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <LoginPage onLogin={handleLogin} />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            {activeTab === 'inicio' && <DashboardPage />}
            {activeTab === 'historico' && <HistoryPage />}
            {activeTab === 'estatisticas' && <StatisticsPage />}
            {activeTab === 'planejamentos' && <PlanningPage />}
            {activeTab === 'ajustes' && <SettingsPage user={user} onLogout={handleLogout} />}
            
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
