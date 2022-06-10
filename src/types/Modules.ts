import type { LanguageModule } from '../modules/LanguageModule';

interface LanguageModuleValues {
  language: string;
}

interface ClientModules {
  language: LanguageModule;
}

export type {
  ClientModules,

  LanguageModuleValues,
};
