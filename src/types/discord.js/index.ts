/* eslint-disable */
import type { CommandContext } from '../../structures';
import type { NixsClient } from '../../client';

declare module 'discord.js' {
  interface Interaction {
    client: NixsClient;
    context: CommandContext;
  }
}
