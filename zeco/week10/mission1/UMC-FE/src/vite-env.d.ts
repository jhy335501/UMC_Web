/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_API_URL: string;
  readonly VITE_TMDB_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
