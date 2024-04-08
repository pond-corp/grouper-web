
// gen.ts
// resposible for generating the config.ts file in /src/utils
// from the config.ts file in /config/config.ts
// @kalrnlo
// 05/04/2024

import { validate, config_template } from "./type";

function deep_freeze<T extends object>(object: T) {
    Object.freeze(object)

    for (const value of Object.values(object)) {
        if (typeof value === 'object' && value !== null) {
            deep_freeze(value)
        } 
    }
    return object
}

export default function(config: config_template) {
    const result = validate(config)

    if (!result.success) {
        throw new Error(`Config provided is invalid\n\t${result.errors}`)
    }
    const place_join_urls: Map<string, string> = new Map();
    const universe_ids: string[] = new Array();

    for (const [place_name, place_data] of Object.entries(config.places)) {
        const place_id = place_data.place_id;
        const link1 = encodeURIComponent(`https://www.roblox.com/games/start?placeId=${place_id}`);
        const link2 = encodeURIComponent(`roblox://placeId=${place_id}`);
        const join_url = `ro.blox.com/Ebh5?af_dp=${link2}&af_web_dp=${link1}`;

        place_join_urls.set(place_name, join_url)
        
        if (!universe_ids.includes(place_data.universe_id)) {
            universe_ids.push(place_data.universe_id);
        }
        
        if (place_data.is_main) {
            if (!place_join_urls.get("play")) {
                place_join_urls.set("play", join_url)
            } else {
                throw new Error ("Cannot have more than 1 place set to be the main place")
            }
        }
    }

    return deep_freeze({
        place_join_urls: place_join_urls,
        universe_ids: universe_ids,
        raw: config,
    })
}