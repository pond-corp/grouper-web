// build.ts
// resposible for generating the config.ts file in /src/utils
// from the config.ts file in /config/config.ts
// @kalrnlo
// 31/03/2024

import typia, { tags } from "typia";
import { config } from "./config";
import util from "node:util";
import fs from "node:fs";

type opt<T> = T | undefined;

const color_regex = /\b(hex\(#?([0-9a-fA-F]{6})\))|hct\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\))\b/;
type color = string & tags.Pattern<"/\b(hex\(#?([0-9a-fA-F]{6})\))|hct\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\))\b/">;

interface config_template {
	name: string;

	event: {
		auto_delete_events_after: string & tags.Format<"duration">;
		minimum_high_rank: number & tags.Type<"uint32">;
		minimum_rank: number & tags.Type<"uint32">;
		check_if_events_are_full: boolean;
		types: string[];
	};
	places: {
		[place_name: string]: {
			use_direct_join_urls: boolean;
			universe_id: number;
			place_id: number;
		};
	};
	forms: {
		maximum_paragraph_responce_length: number & tags.Type<"uint32">;
		auto_delete_unreviewed_after: string & tags.Format<"duration">;
		minimum_create_and_destroy_rank: number & tags.Type<"uint32">;
		auto_delete_reviewed_after: string & tags.Format<"duration">;
		minimum_review_rank: number & tags.Type<"uint32">;
	};
	socials: opt<{
		guilded: opt<string & tags.Format<"url">>;
		discord: opt<string & tags.Format<"url">>;
	}>;
	theme: color | {
		primary: color;
		secondary: color;
		tertiary: color;
		error: color;
		neutral: color;
		neutral_variant: color;
	};
}

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

		const config_string = util.inspect(config_object, {
			depth: Infinity,
			compact: false,
		});

		fs.writeFileSync(
			"../src/util/config.ts",
			config_header + `export const config = Object.freeze(${config_string})`
		);
	},
	function (reason) {
		console.error(`An error occurred whilst generating the config file ${reason}`);
	}
);
