// api.ts
//

import { Request, Response } from "@cloudflare/workers-types";
import { config, universe_ids } from "../util/config";
import { oidcAuthMiddleware } from "@hono/oidc-auth";
import { Hono, HonoRequest } from "hono";
import api from "./api";

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
    app.get("/discord", function (ctx) {
      return ctx.redirect(discord);
    });
  }
  if (guilded) {
    app.get("/guilded", function (ctx) {
      return ctx.redirect(guilded);
    });
  }
}
app.route("/events");
app.route("/forms");
app.route("/api", api);

export default app;
