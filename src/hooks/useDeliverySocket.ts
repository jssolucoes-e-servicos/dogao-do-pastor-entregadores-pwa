"use cliente"
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL
  ? `${process.env.NEXT_PUBLIC_WS_URL}/delivery`
  : 'http://localhost:3001/delivery';

type QueueRoutePayload = {
  orderIds: string[];
  editionId: string;
  message: string;
};

type RouteCreatedPayload = {
  id: string;
  deliveryPersonId: string;
  totalStops: number;
  stops: any[];
  // ... outros campos do backend
};

type EventHandlers = {
  onQueueRoute?: (data: QueueRoutePayload) => void;
  onRouteCreated?: (route: RouteCreatedPayload) => void;
  onLocationUpdate?: (data: any) => void;
};

export function useDeliverySocket(
  deliveryPersonId: string,
  handlers: EventHandlers
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!deliveryPersonId) return;

    // Conecta socket.io no namespace certo
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      upgrade: false,
      secure: true,
      rejectUnauthorized: false,
      query: { deliveryPersonId }
    });

    // Entra na sala do entregador
    socket.emit('join', { room: `deliveryPerson:${deliveryPersonId}` });

    socket.on('connect', () => {
      console.log('[Socket front] Conectado:', socket.id, 'url:', SOCKET_URL);
    });
    socket.on('connect_error', err => {
      console.error('[Socket front] Erro na conexão:', err);
    });
    socket.on('disconnect', reason => {
      console.warn('[Socket front] Desconectado:', reason);
    });

    // Listeners para os eventos delivery
    socket.on('queue:route', (data) => {
      console.log('[Socket front] Evento recebido: queue:route =>', data);
      handlers.onQueueRoute?.(data);
    });
    socket.on('route:created', (data) => {
      console.log('[Socket front] Evento recebido: route:created =>', data);
      handlers.onRouteCreated?.(data);
    });
    socket.on('location:update', (data) => {
      console.log('[Socket front] Evento recebido: location:update =>', data);
    });

    // Fazer cleanup na saída
    socketRef.current = socket;
    return () => {
      socket.emit('leave', { room: `deliveryPerson:${deliveryPersonId}` });
      socket.disconnect();
    };
  }, [deliveryPersonId]);

  // Função para responder à queue (aceitar/recusar rota)
  function respondQueueRoute(accepted: boolean, orderIds: string[], editionId?: string) {
    console.log('[Socket front] Emitindo evento: queue:route:response', { accepted, orderIds, editionId });
    socketRef.current?.emit('queue:route:response', {
      deliveryPersonId, accepted, orderIds, editionId,
    });
  }

  // Função para enviar localização atual pelo socket
  function sendLocation(lat: number, lng: number) {
    socketRef.current?.emit('location:update:in', {
      deliveryPersonId, lat, lng,
    });
  }

  async function setDeliveryPersonStatus(deliveryPersonId: string, online: boolean, inRoute?: boolean) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-person/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryPersonId, online, inRoute })
    });
    // Exemplo: setando online
    // setDeliveryPersonStatus('DELIVERYPERSON_ID', true);
  }

  return { respondQueueRoute, sendLocation, setDeliveryPersonStatus };
}
