'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Adapte conforme seu contexto de autenticação/login real
const DELIVERY_PERSON_ID = '6917da8677f240f92d0ebe29'; // Substitua pelo ID correto do usuário logado
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';

type OnlineContextType = {
  online: boolean;
  setOnline: (state: boolean) => void;
};

const OnlineContext = createContext<OnlineContextType>({
  online: false,
  setOnline: () => { },
});

export function OnlineProvider({ children }: { children: ReactNode }) {
  const [online, setOnlineState] = useState(false);

  // Busca status inicial do backend ao montar
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(
          `${API_URL}/delivery-routes/delivery-person/get-status?id=${DELIVERY_PERSON_ID}`
        );
        if (res.ok) {
          const { online: apiOnline } = await res.json();
          setOnlineState(!!apiOnline);
          console.log('[OnlineContext] Status inicial:', apiOnline);
        }
      } catch (err) {
        console.error('[OnlineContext] Erro ao buscar status inicial:', err);
      }
    }
    fetchStatus();
  }, [DELIVERY_PERSON_ID]);

  // Atualiza backend e toca audio ao alterar status (depois do status inicial)
  useEffect(() => {
    // Só dispara atualização e áudio se já passou do carregamento inicial
    if (typeof window !== 'undefined') {
      // Feedback sonoro (com try/catch para ignorar erro de autoplay)
      try {
        const audio = new Audio(`/assets/sounds/${online ? 'online' : 'offline'}.mp3`);
        audio.play().catch(() => { });
      } catch { }

      // Atualiza backend
      fetch(`${API_URL}/delivery-routes/delivery-person/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryPersonId: DELIVERY_PERSON_ID, online }),
      })
        .then(res => {
          console.log('[OnlineContext] Status online enviado ao backend:', online, res.status);
        })
        .catch(err => {
          console.error('[OnlineContext] Erro ao salvar status:', err);
        });
    }
  }, [online]);

  const setOnline = (state: boolean) => {
    setOnlineState(state);
    // O efeito cuida do resto (audio + envio backend)
  };

  return (
    <OnlineContext.Provider value={{ online, setOnline }}>
      {children}
    </OnlineContext.Provider>
  );
}

export function useOnline() {
  return useContext(OnlineContext);
}
