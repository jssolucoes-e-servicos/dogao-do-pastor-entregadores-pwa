'use client';
import { Switch } from '@/components/ui/switch';
import { useOnline } from '@/context/OnlineContext';

export function OnlineSwitch() {
  const { online, setOnline } = useOnline();
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs">Receber rotas</span>
      <Switch checked={online} onCheckedChange={setOnline} />
      <span className={online ? "text-green-600 text-xs" : "text-red-600 text-xs"}>
        {online ? "Online" : "Offline"}
      </span>
    </div>
  );
}
