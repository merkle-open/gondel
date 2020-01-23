export const loadComponentTemplate = (path: string) => {
  try {
    const templateModule = require(path);

    if (templateModule.default) {
      return templateModule.default;
    }

    if (!templateModule || typeof templateModule !== "string") {
      console.error(`Invalid content of template module "${path}", expected a string`);
      return "";
    }

    return templateModule;
  } catch (err) {
    console.error(`Unable to resolve template module "${path}": ${err}`);
    return "";
  }
};
