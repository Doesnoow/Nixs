import type { CommandInteraction } from 'discord.js';
import type { TFunction } from 'i18next';

import { Discord, Slash } from 'discordx';

import type { NixsClient } from '../../client';

import type { CommandContext } from '../../structures';
import { NixsEmbed } from '../../structures';

import { ComponentUtils } from '../../utils';

@Discord()
export abstract class Settings {
  @Slash('settings')
  private async overview(
    interaction: CommandInteraction<'cached'>,
  ) {
    return interaction.reply({
      content: interaction.context.t('command:settings.content'),
      components: [
        this.getSelectionMenu(interaction.context.t, interaction.client.modules.keys()),
      ],
    });
  }

  // private async autorole(
  //   interaction: CommandInteraction<'cached'>
  // ) {
  // }

  getSelectionMenu(t: TFunction, modules: string[]) {
    return ComponentUtils.createSelectMenu(
      'testing',
      modules.map((key) => ({
        label: t(`modules:${key}.name`),
        value: key,
      })),
    );
  }

  getSelectMenuOptions(client: NixsClient, homePage: boolean) {
    return [
      {
        label: '',
      },
      ...client.modules.keys().map((key) => ({
        label: key,
        value: key,
      })),
    ];
  }
}
