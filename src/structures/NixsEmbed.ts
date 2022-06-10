import type { ColorResolvable, User } from 'discord.js';
import { MessageEmbed } from 'discord.js';

import configs from '../configs';

export class NixsEmbed extends MessageEmbed {
  constructor(user?: User) {
    super();

    this.setColor(configs.EMBED_COLOR as ColorResolvable);
    if (user) this.setFooter({ text: user.tag, iconURL: user.displayAvatarURL({ size: 2048 }) });
  }
}
