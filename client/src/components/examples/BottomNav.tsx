import { useState } from "react";
import BottomNav from "../BottomNav";

export default function BottomNavExample() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'historico' | 'estatisticas' | 'planejamentos' | 'ajustes'>('inicio');
  
  return (
    <div className="h-screen bg-background">
      <div className="p-4">
        <p className="text-foreground">Aba ativa: {activeTab}</p>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
