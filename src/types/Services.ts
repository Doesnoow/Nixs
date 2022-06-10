import type { UserService } from '../services/UserService';
import type { GuildService } from '../services/GuildService';

interface ClientServices {
  guild: GuildService;
  user: UserService
}

export type {
  ClientServices,
};
