import { Home, History, TrendingUp, Target, Settings } from "lucide-react";

type Tab = 'inicio' | 'historico' | 'estatisticas' | 'planejamentos' | 'ajustes';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'inicio' as Tab, label: 'Início', icon: Home },
    { id: 'historico' as Tab, label: 'Histórico', icon: History },
    { id: 'estatisticas' as Tab, label: 'Estatísticas', icon: TrendingUp },
    { id: 'planejamentos' as Tab, label: 'Metas', icon: Target },
    { id: 'ajustes' as Tab, label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-card-border z-50">
      <div className="flex h-full items-center justify-around max-w-7xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              data-testid={`button-tab-${tab.id}`}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              } hover-elevate`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
