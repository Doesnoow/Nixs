import type { MessageSelectOptionData } from 'discord.js';
import { MessageActionRow, MessageSelectMenu } from 'discord.js';

export class ComponentUtils {
  /**
   * @example
   * const selectMenuRow = ComponentUtils.createSelectMenu([
   *   {
   *     label: 'some label',
   *     value: 'value'
   *   },
   *   {
   *     label: 'other label',
   *     value: 'other value'
   *   }
   * ]);
   *
   * console.log(selectMenuRow) // MessageActionRow { components: [MessageSelectMenuComponent] }
   * @example
   * const selectMenuRow = ComponentUtils.createSelectMenu(
   *   [{
   *     label: 'some label',
   *     value: 'value'
   *   }],
   *   [{
   *     label: 'other label',
   *     value: 'other value'
   *   }]
   * );
   *
   * console.log(selectMenuRow)
   * // MessageActionRow {
   * //   components: [MessageSelectMenu, MessageSelectMenu]
   * // }
   */
  static createSelectMenu(
    ids: string[] | string,
    ...menus: MessageSelectOptionData[][]
  ): MessageActionRow {
    return new MessageActionRow()
      .addComponents(
        ...menus.map((options, index) => (
          new MessageSelectMenu()
            .addOptions(...options)
            .setCustomId(Array.isArray(ids)
              ? ids[index]
              : ids)
        )),
      );
  }
}
