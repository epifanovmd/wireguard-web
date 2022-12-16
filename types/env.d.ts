import { AppTheme } from "../src/theme";

interface EnvVariables {
  PUBLIC_ENV__APP_NAME: string;
  PUBLIC_ENV__APP_DESCRIPTION: string;
}

interface ImportMetaEnv extends EnvVariables {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {}
}
