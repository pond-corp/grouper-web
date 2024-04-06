// build.ts
// resposible for generating the config.ts file in /src/utils
// from the config.ts file in /config/config.ts
// @kalrnlo
// 05/04/2024

import { config_template } from "./confg_types";
import { config } from "./config";
import util from "node:util";
import typia from "typia";
import fs from "node:fs";

const color_regex = /\b(hex\(#?([0-9a-fA-F]{6})\))|hct\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\))\b/;

const current_date = new Date();

const generated_conifg = Promise.resolve(config instanceof Function ? config() : config);

generated_conifg.then(
	function (config_object: config_template) {
    	const result: typia.IValidation<config_template> = typia.validate(config_object as any);

		if (!result.success) {
			console.error(`Config provided is invalid\n\t${result.errors}`);
			return;
		}
		const place_join_urls = new Map();
		const universe_ids = new Array();

		for (const [place_name, place_data] of Object.entries(config_object.places)) {
			const place_id = place_data.place_id;
			const link1 = encodeURIComponent(`https://www.roblox.com/games/start?placeId=${place_id}`);
			const link2 = encodeURIComponent(`roblox://placeId=${place_id}`);
			const join_url = `ro.blox.com/Ebh5?af_dp=${link2}&af_web_dp=${link1}`;

			place_join_urls.set(place_name, join_url)
			
			if (!universe_ids.includes(place_data.universe_id)) {
				universe_ids.push(place_data.universe_id);
			}
			if (place_data.is_main) {
				place_join_urls.set("play", join_url)
			}
    	}

    	const config_string = util.inspect(config_object, {
			depth: Infinity,
			compact: false,
		});

    	const file_string = `

			// config.ts
			// auto generated configuration file
			// @kalrnlo
			// ${current_date.getUTCDay()}/${current_date.getUTCMonth()}/${current_date.getUTCFullYear()}

			export const place_join_urls = Object.freeze(${Array.from(place_join_urls.entries()).map(([key, value]) => `${key}: ${value}`).join(", ")}};
			export const universe_ids = Object.freeze(Array(${universe_ids.join(", ")}))
			export const config = Object.freeze(${config_string})
		`;

    	fs.writeFileSync("../src/util/config.ts", file_string);
  }, (reason) => console.error(`An error occurred whilst generating the config file ${reason}`)
);
