
// app.ts
// seperate file for holding the app object
// so i dont have to constantly retype out the Bindings
// @kalrnlo
// 07/04/2024

import { Request, ExecutionContext, D1Database } from "@cloudflare/workers-types";
import config from "../../config";
import { oidcAuthMiddleware } from "@hono/oidc-auth";
import { Hono } from "hono";

export type ratelimiter = (config: {key: string}) => { success: boolean }

export const app = new Hono<{
    Bindings: {
        form_submission_store: D1Database,
        page_ratelimiter: ratelimiter,
        api_ratelimiter: ratelimiter,
        discord_oauth_token?: string,
        guilded_oauth_token?: string,
        form_info_store: D1Database,
        rbx_messaging_key: string,
        rbx_oauth_token?: string,
        event_store: D1Database,
    }
}>()

export function make_redirect(path: string, url: string) {
    app.get(path, (ctx) => ctx.redirect(url));
}

// replace with multi_ouath_middleware
const odic_middleware = oidcAuthMiddleware();
const roblox_asns = Array(22697, 132203);
const universe_ids = config.universe_ids
const socials = config.raw.socials;

app.use("/api/*", async (ctx, next) => {
    const raw_request: Request = ctx.req.raw as any;
    const universe_id = raw_request.headers.get("roblox-id");
    const asn = raw_request.cf?.asn as number | undefined;

    if (
        asn &&
        roblox_asns.includes(asn) &&
        universe_id &&
        universe_ids.includes(universe_id)
    ) {
        await next();
    }
    else {
        return odic_middleware(ctx, next);
    }
});

if (socials) {
    const discord = socials.discord
    const guilded = socials.guilded

    if (discord) {
        make_redirect("/discord", discord)
    }
    if (guilded) {
        make_redirect("/guilded", guilded)
    }
}
for (const [place_name, join_url] of Object.entries(config.place_join_urls)) {
    make_redirect(`/${place_name}`, join_url)
}
make_redirect("/group", `https://roblox.com/groups/${config.raw.id}`)

export default {
    async fetch(request: Request, env: any, ctx: ExecutionContext) {
        // add in ratelimiting
        return app.fetch(request as any, env, ctx);
    },
};
