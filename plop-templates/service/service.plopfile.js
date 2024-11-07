module.exports = plop => {
  plop.setGenerator("service", {
    description: "Создает сервис",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Введите название сервиса:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/service/{{camelCase name}}/index.ts",
        templateFile: "plop-templates/service/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/service/{{camelCase name}}/{{properCase name}}.service.ts",
        templateFile: "plop-templates/service/Service.service.ts.hbs",
      },
      {
        type: "add",
        path: "src/service/{{camelCase name}}/{{properCase name}}.types.ts",
        templateFile: "plop-templates/service/Service.types.ts.hbs",
      },

      {
        type: "modify",
        path: "src/service/index.ts",
        pattern: /(\/\/ EXPORT SERVICE HERE)/gi,
        template:
          // eslint-disable-next-line quotes
          'export * from "./{{camelCase name}}";\n$1',
      },
    ],
  });
};
