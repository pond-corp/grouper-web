
// config.ts
// module for containing a object version of the config.json file
// @kalrnlo
// 27/03/2024

import fs from "node:fs"

export type config = {

}

const config_json = fs.readFileSync("./config.json").toString("utf8")
export const config = JSON.parse(config_json)