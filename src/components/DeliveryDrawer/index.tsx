'use client';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { IUser } from '@/interfaces';

interface DeliveryDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: IUser;
  online: boolean;
  onLogout: () => void;
}

export function DeliveryDrawer({ open, setOpen, user, online, onLogout }: DeliveryDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Dados do Entregador</DrawerTitle>
          <DrawerDescription>
            <span className="font-bold">{user.name}</span><br />
            Usuário: <span>{user.username}</span><br />
            Status: <span className={online ? 'text-green-600' : 'text-red-600'}>{user.DeliveryPerson[0].online}</span>
          </DrawerDescription>
          <Button variant="destructive" onClick={onLogout} className="mt-3 w-full">Sair</Button>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
