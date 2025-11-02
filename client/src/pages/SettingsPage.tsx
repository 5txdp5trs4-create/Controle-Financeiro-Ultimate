import { Sun, Moon, Download, Trash2, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/lib/theme";
import { storage, type UserData } from "@/lib/storage";
import * as XLSX from 'xlsx';

interface SettingsPageProps {
  user: UserData;
  onLogout: () => void;
}

export default function SettingsPage({ user, onLogout }: SettingsPageProps) {
  const { theme, toggleTheme } = useTheme();

  const handleExport = () => {
    const transactions = storage.getTransactions();
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transações');
    XLSX.writeFile(wb, 'historico-financeiro.xlsx');
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      storage.clearAll();
      alert('Todos os dados foram limpos com sucesso!');
    }
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <h2 className="text-2xl font-bold">Ajustes</h2>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.photoURL} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg" data-testid="text-user-name">{user.name}</h3>
            <p className="text-sm text-muted-foreground" data-testid="text-user-email">{user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Autenticado via {user.authProvider === 'google' ? 'Google' : 'E-mail'}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Preferências</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <div>
              <p className="font-medium">Tema</p>
              <p className="text-sm text-muted-foreground">
                {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
              </p>
            </div>
          </div>
          <Button onClick={toggleTheme} variant="outline" data-testid="button-toggle-theme">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-3">
        <h3 className="font-semibold mb-4">Dados</h3>
        
        <Button
          onClick={handleExport}
          variant="outline"
          className="w-full justify-start"
          data-testid="button-export"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Histórico (Excel)
        </Button>

        <Button
          onClick={handleClearData}
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          data-testid="button-clear-data"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Limpar Todos os Dados
        </Button>

        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full justify-start"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </Card>

      <div className="pt-8 border-t">
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>© 2025 - Todos os direitos reservados</p>
          <p className="font-medium">Desenvolvido por Jonatan Tonussi</p>
          <p>Suporte: jonatan_spy@hotmail.com</p>
        </div>
      </div>
    </div>
  );
}
