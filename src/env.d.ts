/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly UMAMI_API_KEY?: string;
  readonly BCRYPT_SALT_ROUNDS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}