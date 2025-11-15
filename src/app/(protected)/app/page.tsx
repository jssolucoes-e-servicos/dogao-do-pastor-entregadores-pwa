'use client';
import { AlertModal } from '@/components/AlertModal';
import { DeliveryDrawer } from '@/components/DeliveryDrawer';
import { DeliveryRoute } from '@/components/DeliveryRoute';
import { OnlineSwitch } from '@/components/OnlineSwitch';
import { OrdersList } from '@/components/OrdersList';
import { ProfileCard } from '@/components/ProfileCard';
import { TabBar } from '@/components/TabBar';
import { useAuth } from '@/context/AuthContext';
import { useDeliverySocket } from '@/hooks/useDeliverySocket';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { token, logout, user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('route');
  const [deliveryPersonId, setDeliveryPersonId] = useState<string | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [online, setOnline] = useState(true);
  const [modalAlert, setModalAlert] = useState<{ open: boolean; type: 'queue' | 'direct'; routeInfo: any }>({ open: false, type: 'queue', routeInfo: {} });

  // Recupere o deliveryPersonId do usuário autenticado no seu app, ex: do token ou do backend
  useEffect(() => {
    if (!token || !user) router.replace('/login');

    setDeliveryPersonId(user?.DeliveryPerson[0].id);
  }, [token, user]);

  // Inicialize socket quando o ID existir
  const { respondQueueRoute, sendLocation } = useDeliverySocket(deliveryPersonId ?? '', {
    onQueueRoute: (data) => {
      setModalAlert({ open: true, type: 'queue', routeInfo: data });
    },
    onRouteCreated: (route) => {
      setModalAlert({
        open: true, type: 'direct', routeInfo: {
          stops: route.totalStops,
          hotdogs: route.stops.reduce((acc, curr) => acc + (curr.order?.quantity || 1), 0),
          distanceKm: calcularDistancia(route.stops), // implemente se quiser!
        }
      });
    },
    onLocationUpdate: (data) => {
      // Se for caso de atualizar UI com localização
    }
  });

  // Exemplo função para aceitar ou recusar rota da fila
  function handleQueueAccept() {
    respondQueueRoute(true, modalAlert.routeInfo.orderIds, modalAlert.routeInfo.editionId);
    setModalAlert(prev => ({ ...prev, open: false }));
  }

  function handleQueueDecline() {
    respondQueueRoute(false, modalAlert.routeInfo.orderIds, modalAlert.routeInfo.editionId);
    setModalAlert(prev => ({ ...prev, open: false }));
  }

  // Exemplo de status
  const inRoute = false; // troque para true para testar rota ativa

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <header className="w-full flex items-center gap-3 justify-between px-4 pt-4 pb-2">
        <OnlineSwitch online={online} setOnline={setOnline} />
        <button onClick={() => setDrawerOpen(true)} className="text-muted-foreground">
          <span className="icon-[lucide--info]" /> Dados
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-3">
        {tab === 'route' && <DeliveryRoute active={inRoute} />}
        {tab === 'orders' && <OrdersList active={inRoute} />}
        {tab === 'profile' && <ProfileCard user={user} online={online} />}
      </div>
      <DeliveryDrawer open={drawerOpen} setOpen={setDrawerOpen} user={user} online={online} onLogout={logout} />
      <div className="fixed right-4 bottom-24 z-40">
        {/* Fila (aceitar/recusar) */}
        <button
          className="mb-2 bg-indigo-600 text-white px-4 py-2 rounded shadow font-bold"
          onClick={() => setModalAlert({
            open: true,
            type: 'queue',
            routeInfo: { endereco: 'Rua Exemplo Fila', pedido: '#filatest' }
          })}
        >
          Testar Modal Fila
        </button>
        {/* Direto (só aceitar/ver rota) */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded shadow font-bold"
          onClick={() => setModalAlert({
            open: true,
            type: 'direct',
            routeInfo: { endereco: 'Avenida Direta', pedido: '#diretotest' }
          })}
        >
          Testar Modal Direto
        </button>
      </div>
      <AlertModal
        open={modalAlert.open}
        type={modalAlert.type}
        routeInfo={modalAlert.routeInfo}
        onAccept={handleQueueAccept}
        onDecline={handleQueueDecline}
      />
      <TabBar selected={tab} setSelected={setTab} />
    </div>
  );
}
