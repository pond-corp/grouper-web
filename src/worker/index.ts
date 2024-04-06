
// api.ts
// the entry point for the worker
// @kalrnlo
// 05/04/2024

import { Request, ExecutionContext, setTimeout } from "@cloudflare/workers-types";
import { config, universe_ids, place_join_urls } from "../util/config";
import { oidcAuthMiddleware } from "@hono/oidc-auth";
import { Hono, HonoRequest } from "hono";
import api from "./api";

const group_url = `https://roblox.com/groups/${config.id}`;
const request_counts: Map<string, number> = new Map()
const odic_middleware = oidcAuthMiddleware();
const roblox_asns = Array(22697, 132203);
const socials = config.socials;
const rate_limit_ms = 60000
const rate_limit = 60 * 100
const max_requests = 48
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

// middleware for providing event data
//app.use("/api/events/*", aysnc (ctx, next) => {
//
//})
// middleware for providing form data
//app.use("/api/forms/*", aysnc (ctx, next) => {
//
//})
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

export default {
	async fetch(request: Request, env: any, ctx: ExecutionContext) {
		const ip: string = request.headers.get('CF-Connecting-IP')
		let request_count = request_counts.get(ip)

		if (!request_count) {
			request_count = 1
			setTimeout((a) => request_counts.delete(a), rate_limit_ms, ip)
			request_counts[ip] = request_count
		}
	  
		if (request_count >= max_requests) {
			return new Response('Too Many Requests', {
				status: 429,
				headers: {
					'X-RateLimit-Remaining': '0',
					'X-RateLimit-Reset': (Date.now() + rate_limit_ms).toString(),
				},
			})
		} else {
			request_counts[ip]++
		}

		return app.fetch(request as any, env, ctx)
	},
}