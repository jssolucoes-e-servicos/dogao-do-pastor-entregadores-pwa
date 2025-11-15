import { useOnline } from '@/context/OnlineContext';

export function DeliveryRoute({ active }: { active: boolean }) {
  const { online } = useOnline();

  if (!online) {
    return (
      <div className="bg-destructive/20 border-2 border-destructive text-destructive rounded-xl font-bold flex items-center justify-center h-64 text-base">
        Você está offline! Fique online para receber rotas.
      </div>
    );
  }
  // ... resto da lógica igual anterior
  if (!active) {
    return (
      <div className="bg-card rounded-xl shadow flex items-center justify-center h-64 text-base text-muted-foreground font-semibold">
        Nenhuma rota atribuída no momento
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow flex items-center justify-center h-64">
      {/* Aqui virá o mapa */}
      <span className="text-muted-foreground">Mapa e detalhes da rota aqui</span>
    </div>
  );
}
