'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useRef } from 'react';

interface DirectInfo {
  stops: number;
  hotdogs: number;
  distanceKm: number;
}

interface AlertModalProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  type: 'queue' | 'direct';
  routeInfo: Partial<DirectInfo & { endereco?: string; pedido?: string }>;
}

export function AlertModal({ open, onAccept, onDecline, type, routeInfo }: AlertModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (open) {
      const soundUrl = type === 'queue'
        ? '/assets/sounds/notif_atached.mp3'
        : '/assets/sounds/alert.mp3';
      const audio = new Audio(soundUrl);
      audio.loop = true;
      audio.play();
      audioRef.current = audio;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [open, type]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'queue'
              ? "Nova rota aguardando!"
              : "Rota atribuída para você"}
          </DialogTitle>
        </DialogHeader>
        <div>
          {type === 'queue' ? (
            <div className="flex flex-col items-center p-6">
              <span className="text-lg font-semibold text-slate-800 mb-2">
                Há uma nova rota disponível aguardando na expedição.
              </span>
              <span className="text-sm text-muted-foreground mb-6 text-center">
                Clique para aceitar ou recusar essa rota. Você será responsável pela entrega dos dogões desta expedição.
              </span>
            </div>
          ) : (
            <div className="rounded-xl bg-gradient-to-tr from-amber-100 via-white to-slate-100 p-5 flex flex-col items-center shadow-md border mb-2">
              <div className="flex gap-6 mb-4">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl text-orange-600">{routeInfo.stops ?? '-'}</span>
                  <span className="text-xs text-muted-foreground">Paradas</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl text-red-600">{routeInfo.hotdogs ?? '-'}</span>
                  <span className="text-xs text-muted-foreground">Dogões</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-xl text-slate-700">{routeInfo.distanceKm ?? '-'} km</span>
                  <span className="text-xs text-muted-foreground">Total km</span>
                </div>
              </div>
              <div className="bg-white rounded shadow p-2 px-3 mb-3 text-center">
                <span className="text-base text-slate-700 font-medium">Rota atribuída, confira os detalhes e comece suas entregas!</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex gap-2 mt-2 justify-end">
          {type === 'queue' ? (
            <>
              <Button onClick={onAccept}>Aceitar</Button>
              <Button variant="secondary" onClick={onDecline}>Recusar</Button>
            </>
          ) : (
            <Button onClick={onAccept}>Ver rota</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
