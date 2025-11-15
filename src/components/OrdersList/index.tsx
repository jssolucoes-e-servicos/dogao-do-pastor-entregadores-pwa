'use client';

interface OrdersListProps {
  active: boolean;
}

export function OrdersList({ active }: OrdersListProps) {
  if (!active) {
    return (
      <div className="bg-card rounded-xl shadow flex items-center justify-center h-64 text-base text-muted-foreground font-semibold">
        Você precisa aceitar uma rota para visualizar pedidos
      </div>
    );
  }
  // Futuro: listar os pedidos da rota
  return (
    <div className="bg-card rounded-xl shadow flex items-center justify-center h-64">
      <span>Lista de pedidos da sua rota aparecerá aqui</span>
    </div>
  );
}
