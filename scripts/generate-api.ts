import { generateApiService } from "@force-dev/utils/node";
import path from "path";

const projectRootDir = path.resolve(import.meta.dirname);

generateApiService({
  output: path.resolve(projectRootDir, "../src/api/api-gen"),
  url: "http://147.45.245.104:8181/api-docs/swagger.json", // URL вашего Swagger JSON
})
  .then(() => {
    console.log("API успешно сгенерировано");
  })
  .catch(e => console.error(e));
