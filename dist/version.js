import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { version: packageVersion } = require("../package.json");
export { packageVersion };
//# sourceMappingURL=version.js.map