export interface IUser {
  id: string;
  name: string;
  username: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  Seller: object[];
  Cell: object[];
  CellNetwork: [
    {
      id: string;
      name: string;
      supervisorName: string;
      phone: string;
      userId: string;
      active: boolean;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    }
  ],
  DeliveryPerson: [
    {
      id: string;
      name: string;
      phone: string;
      userId: string;
      online: boolean;
      inRoute: boolean;
      active: boolean;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    }
  ],
  userRoles: object[];
  roles: object[];
  permissions: object[];
}