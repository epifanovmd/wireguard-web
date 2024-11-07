export default plop => {
  plop.setGenerator("store", {
    description: "Создает стор",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Введите название стора:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/store/{{camelCase name}}/index.ts",
        templateFile: "plop-templates/store/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/store/{{camelCase name}}/{{properCase name}}Data.store.ts",
        templateFile: "plop-templates/store/Data.store.ts.hbs",
      },
      {
        type: "add",
        path: "src/store/{{camelCase name}}/{{properCase name}}Data.types.ts",
        templateFile: "plop-templates/store/Data.types.ts.hbs",
      },

      {
        type: "add",
        path: "src/store/{{camelCase name}}/hooks/index.ts",
        templateFile: "plop-templates/store/hooks/index.ts.hbs",
      },
      {
        type: "add",
        path: "src/store/{{camelCase name}}/hooks/use{{properCase name}}DataStore.ts",
        templateFile: "plop-templates/store/hooks/useDataStore.ts.hbs",
      },

      {
        type: "modify",
        path: "src/store/index.ts",
        pattern: /(\/\/ EXPORT STORE HERE)/gi,
        template:
          // eslint-disable-next-line quotes
          'export * from "./{{camelCase name}}";\n$1',
      },
    ],
  });
};
