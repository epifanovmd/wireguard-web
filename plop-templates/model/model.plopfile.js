export default plop => {
  plop.setGenerator("model", {
    description: "Создает модель",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Введите название модели:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/models/{{camelCase name}}/index.ts",
        templateFile: "plop-templates/model/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/models/{{camelCase name}}/{{properCase name}}.model.ts",
        templateFile: "plop-templates/model/Model.model.ts.hbs",
      },

      {
        type: "modify",
        path: "src/models/index.ts",
        pattern: /(\/\/ EXPORT MODEL HERE)/gi,
        template:
          // eslint-disable-next-line quotes
          'export * from "./{{camelCase name}}";\n$1',
      },
    ],
  });
};
