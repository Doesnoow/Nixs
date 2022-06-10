/* eslint-disable no-param-reassign */
import type { ArgsOf } from 'discordx';
import { Discord, Once, On } from 'discordx';

import type { NixsClient } from '../client';

import { CommandContext } from '../structures';

import configs from '../configs';

@Discord()
export abstract class MainListener {
  @Once('ready')
  // eslint-disable-next-line no-empty-pattern
  private async onReady([]: ArgsOf<'ready'>, client: NixsClient) {
    if (configs.debug) await client.clearApplicationCommands();
    
    await client.initApplicationCommands({
      global: { log: configs.debug },
      guild: { log: configs.debug },
    });
    await client.initApplicationPermissions(configs.debug);
    
    client._logger.info({ tag: 'NIXS' }, 'Client logged-in!');
  }

  @On('interactionCreate')
  private async onInteractionCreate([interaction]: ArgsOf<'interactionCreate'>, client: NixsClient) {
    if (interaction.user.bot || !interaction.inGuild()) return false;
    if (interaction.inRawGuild()) {
      await client.guilds.fetch(interaction.guildId);

      this.onInteractionCreate([interaction], client);
      return false;
    }

    const isBlacklisted = await client.services.get('user').isBlacklisted(interaction.user.id);
    if (isBlacklisted) return false;

    const language = await client.services.get('guild').getGuildLanguage(interaction.guildId);
    const context = new CommandContext({
      language,
    }, client);

    interaction.context = context;
    await client.executeInteraction(interaction);

    return true;
  }
}
