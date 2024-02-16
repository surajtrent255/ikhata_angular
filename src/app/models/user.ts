import { Roles } from './Roles';

export class User {
  token!: string;
  user!: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: number;
    roles: Roles[];
    enabled: boolean;
    username: string;
    authorities: [
      {
        authority: string;
      }
    ];
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
  };
}
