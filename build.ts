// build.ts
// resposible for generating the config.ts file in /src/utils
// from the config.ts file in /config/config.ts
// @kalrnlo
// 31/03/2024

import typia, { tags } from "typia";
import { config_template, color } from "./confg_types";
import { config } from "./config";
import util from "node:util";
import fs from "node:fs";

const color_regex =
  /\b(hex\(#?([0-9a-fA-F]{6})\))|hct\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\))\b/;

const current_date = new Date();
const config_header = `

	// config.ts
	// auto generated configuration file
	// @kalrnlo
	// ${current_date.getUTCDay()}/${current_date.getUTCMonth()}/${current_date.getUTCFullYear()}


`;

const generated_conifg = Promise.resolve(
  config instanceof Function ? config() : config
);

generated_conifg.then(
  function (config_object: config_template) {
    const result: typia.IValidation<config_template> = typia.validate(
      config_object as any
    );

    if (!result.success) {
      console.error(`Config provided is invalid\n\t${result.errors}`);
      return;
    }
    const universe_ids = new Array();

    for (const [place_name, place_data] of Object.entries(
      config_object.places
    )) {
      if (!universe_ids.includes(place_data.universe_id)) {
        universe_ids.push(place_data.universe_id);
      }
    }

    const universe_ids_string = util.inspect(universe_ids, {
      depth: Infinity,
      compact: false,
    });

    const config_string = util.inspect(config_object, {
      depth: Infinity,
      compact: false,
    });

    fs.writeFileSync(
      "../src/util/config.ts",
      config_header +
        `export const config = Object.freeze(${config_string})\n\texport const universe_ids = Object.freeze(${universe_ids_string})`
    );
  },
  function (reason) {
    console.error(
      `An error occurred whilst generating the config file ${reason}`
    );
  }
);
