interface EnvVariables {
  BASE_URL: string;
  MODE: "development" | "productions";
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;

  VITE_PROTOCOL: string;
  VITE_HOST: string;
  VITE_PORT: string;
  VITE_BASE_URL: string;
  VITE_SOCKET_BASE_URL: string;
  VITE_APP_NAME: string;
}

type ImportMetaEnv = EnvVariables;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
