// styled.d.ts
import "styled-components";

declare module "styled-components" {
  import { AppTheme } from "./types";
  export interface DefaultTheme extends AppTheme {}
}
