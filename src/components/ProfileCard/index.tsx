'use client';

import { IUser } from "@/interfaces";

interface ProfileCardProps {
  user: IUser;
  online: boolean;
}

export function ProfileCard({ user, online }: ProfileCardProps) {

  return (
    <div className="bg-card rounded-xl shadow flex flex-col justify-center items-center h-64 text-base p-4">
      <span className="font-bold">{user.name}</span>
      <div className="my-2">Usuário: {user.username}</div>
      <div>Status: <span className={online ? 'text-green-600' : 'text-red-600'}>{user.DeliveryPerson[0].online}</span></div>
    </div>
  );
}
