interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_URL_API: string;
  readonly VITE_APP_URL_WS: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
