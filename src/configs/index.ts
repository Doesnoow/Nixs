import 'dotenv/config';

type NonNullValues<O> = {
  [key in keyof O]: Exclude<O[key], null | undefined>;
}

const configs = {
  TOKEN: process.env.TOKEN,
  DEV_TOKEN: process.env.DEV_TOKEN,

  TEST_GUILD_ID: process.env.TEST_GUILD_ID,
  TEST_GUILDS_IDS: process.env.TEST_GUILDS_IDS?.split(' '),

  OWNER_ID: process.env.OWNER_ID,

  MONGOOSE_PASSWORD: process.env.MONGOOSE_PASSWORD,
  MONGOOSE_URI: process.env.MONGOOSE_URI,

  EMBED_COLOR: process.env.EMBED_COLOR,

  NODE_ENV: process.env.NODE_ENV,
  debug: process.env.NODE_ENV !== 'production',
} as const;

export default configs as NonNullValues<typeof configs>;
