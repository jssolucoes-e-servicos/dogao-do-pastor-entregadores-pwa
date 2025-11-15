'use client';
import { Button } from '@/components/ui/button';

interface TabBarProps {
  selected: string;
  setSelected: (tab: string) => void;
}

export function TabBar({ selected, setSelected }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 flex justify-around border-t z-20 pb-[env(safe-area-inset-bottom)] pt-2">
      <Button variant={selected === 'route' ? 'default' : 'ghost'} className="flex-1 flex flex-col items-center py-2" onClick={() => setSelected('route')}>
        <span className="icon-[lucide--map] mb-1" />
        <span className="text-xs">Rota</span>
      </Button>
      <Button variant={selected === 'orders' ? 'default' : 'ghost'} className="flex-1 flex flex-col items-center py-2" onClick={() => setSelected('orders')}>
        <span className="icon-[lucide--list] mb-1" />
        <span className="text-xs">Pedidos</span>
      </Button>
      <Button variant={selected === 'profile' ? 'default' : 'ghost'} className="flex-1 flex flex-col items-center py-2" onClick={() => setSelected('profile')}>
        <span className="icon-[lucide--user] mb-1" />
        <span className="text-xs">Perfil</span>
      </Button>
    </nav>
  );
}
