// api.ts
//

import { Request, Response } from "@cloudflare/workers-types";
import { config, universe_ids, place_join_urls } from "../util/config";
import { oidcAuthMiddleware } from "@hono/oidc-auth";
import { Hono, HonoRequest } from "hono";
import api from "./api";

const group_url = `https://roblox.com/groups/${config.id}`;
const odic_middleware = oidcAuthMiddleware();
const roblox_asns = Array(22697, 132203);
const socials = config.socials;
const app = new Hono();

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
	} else {
		return odic_middleware(ctx, next);
	}
});
app.use("/panel/*", odic_middleware);
app.use("/forms/*", odic_middleware);

if (socials) {
	const discord = socials.discord;
	const guilded = socials.guilded;

	if (discord) {
 		app.get("/discord",(ctx) => ctx.redirect(discord));
	}
	if (guilded) {
		app.get("/guilded",(ctx) => ctx.redirect(guilded));
	}
}

for (const [place_name, join_url] of Object.entries(place_join_urls)) {
	app.get(`/${place_name}`, (ctx) => ctx.redirect(join_url))
}
app.get("/group", (ctx) => ctx.redirect(group_url));
app.route("/events");
app.route("/forms");
app.route("/api", api);

export default app;
