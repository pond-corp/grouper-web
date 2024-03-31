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

interface config_template {
  name: string;

  event: {
    auto_delete_events_after: tags.Format<"duration">;
    minimum_high_rank: tags.Type<"uint32">;
    minimum_rank: tags.Type<"uint32">;
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
    maximum_paragraph_responce_length: tags.Type<"uint32">;
    auto_delete_unreviewed_after: tags.Format<"duration">;
    minimum_create_and_destroy_rank: tags.Type<"uint32">;
    auto_delete_reviewed_after: tags.Format<"duration">;
    minimum_review_rank: tags.Type<"uint32">;
  };
  socials: {
    guilded: opt<tags.Format<"url">>;
    discord: opt<tags.Format<"url">>;
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
  function (config_object) {
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
    console.error(
      `An error occurred whilst generating the config file ${reason}`
    );
  }
);
