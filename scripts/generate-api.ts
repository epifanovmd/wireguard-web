import * as path from "path";
import { generateApi } from "swagger-typescript-api";

const projectRootDir = path.resolve(import.meta.dirname);

generateApi({
  url: "https://wireguard.epifanov-dev.ru/api-docs/swagger.json",
  output: path.resolve(projectRootDir, "../src/api/api-gen"),
  httpClientType: "axios",
  templates: path.resolve(projectRootDir, "./api-templates"),
  modular: true,
  extractRequestBody: true,
  extractRequestParams: true,
  cleanOutput: false,
})
  .then(() => {
    console.log("API generated successfully");
  })
  .catch(e => console.error(e));
