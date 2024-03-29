// build.ts
// resposible for generating the config.ts file in /src/utils
// from the config.ts file in /config/config.ts
// @kalrnlo
// 29/03/2024

import { config } from "./config";
import util from "node/node_modules/.bin/util";
import fs from "node/node_modules/.bin/fs";

// checking if the config is not an object, function, or promise
if (
  !(
    config instanceof Promise ||
    config instanceof Function ||
    config instanceof Object
  )
) {
  throw new Error("Config is not instanceof Promise, Function, or object");
}

const config_promise = Promise.resolve(
  config instanceof Function ? config() : config,
);
const current_date = new Date();
const config_header = `

	// config.ts
	// auto generated configuration file
	// @kalrnlo
	// ${current_date.getUTCDay()}/${current_date.getUTCMonth()}/${current_date.getUTCFullYear()}


`;

config_promise.then(
  function (config_object) {
    const config_string = util.inspect(config_object, {
      depth: Infinity,
      compact: false,
    });

    fs.writeFileSync(
      "../src/util/config.ts",
      config_header + `export const config = Object.freeze(${config_string})`,
    );
  },
  function (reason) {
    throw new Error(
      `An error occurred whilst generating the config file ${reason}`,
    );
  },
);
