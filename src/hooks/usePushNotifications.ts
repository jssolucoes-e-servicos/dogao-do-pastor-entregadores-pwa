'use client';
import { useEffect } from 'react';

export function usePushNotifications(deliveryPersonId: string) {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window && deliveryPersonId) {
      navigator.serviceWorker.register('/sw.js').then(async registration => {
        // Solicita permissão do usuário
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // Cria subscription push
        const applicationServerKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!);
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        // Envia subscription (JSON) ao backend para salvar por deliveryPersonId
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-person/subscribe-push`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deliveryPersonId, subscription }),
        });
      });
    }
  }, [deliveryPersonId]);
}

// Utilitário VAPID
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
