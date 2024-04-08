
// gen.ts
// resposible for generating the config.ts file in /src/utils
// from the config.ts file in /config/config.ts
// @kalrnlo
// 05/04/2024

import { argbFromHex, argbFromRgb, Scheme, CorePalette} from "@material/material-color-utilities"
import { validate, config_template } from "./type";

function deep_freeze<T extends object>(object: T) {
    Object.freeze(object)

    for (const value of Object.values(object)) {
        if (typeof value === 'object' && value !== null) {
            deep_freeze(value)
        } 
    }
    return object as Readonly<T>
}

function get_argb_from_color_str(color_str: string) {
    const subbed = color_str.substring(0, 2)

    switch (subbed) {
        case "rgb": {
            return argbFromRgb(
                Number(color_str.substring(4, 5)),
                Number(color_str.substring(6, 7)),
                Number(color_str.substring(8, 9)),
            )
        }
        case "hex": {
            return argbFromHex(color_str.substring(4, 9))
        }
        default: {
            throw new Error("color_str is not rgb or hex")
        }
    }
}

export default function(config: config_template) {
    const place_join_urls: Map<string, string> = new Map();
    const universe_ids: string[] = new Array();
    let light_theme: Scheme
    let dark_theme: Scheme

    validate(config)

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

    if (typeof config.theme === "string") {
        const color = get_argb_from_color_str(config.theme)
        light_theme = Scheme.light(color)
        dark_theme = Scheme.dark(color)
    } else {
        const palette = CorePalette.fromColors({
            neutralVariant: config.theme.neutral_variant ? get_argb_from_color_str(config.theme.neutral_variant) : undefined,
            secondary: config.theme.secondary ? get_argb_from_color_str(config.theme.secondary) : undefined,
            tertiary: config.theme.tertiary ? get_argb_from_color_str(config.theme.tertiary) : undefined,
            neutral: config.theme.neutral ? get_argb_from_color_str(config.theme.neutral) : undefined,
            error: config.theme.error ? get_argb_from_color_str(config.theme.error) : undefined,
            primary: get_argb_from_color_str(config.theme.primary),
        })

        light_theme = Scheme.lightFromCorePalette(palette)
        dark_theme = Scheme.darkFromCorePalette(palette)
    }

    return deep_freeze({
        place_join_urls: place_join_urls,
        universe_ids: universe_ids,
        raw: config,
        theme: {
            light: light_theme,
            dark: dark_theme,
        },
    })
}