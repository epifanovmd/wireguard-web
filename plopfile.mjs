import modelGenerator from "./plop-templates/model/model.plopfile.js";
import serviceGenerator from "./plop-templates/service/service.plopfile.js";
import storeGenerator from "./plop-templates/store/store.plopfile.js";

export default plop => {
  plop.setGenerator("service-model-store", {
    description: "Создает сервис, модель и стор",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Введите название:",
      },
    ],
    actions: () => {
      return ["service", "model", "store"].reduce((actions, name) => {
        const generator = plop.getGenerator(name);

        return [...actions, ...generator.actions];
      }, []);
    },
  });

  serviceGenerator(plop);
  storeGenerator(plop);
  modelGenerator(plop);
};
