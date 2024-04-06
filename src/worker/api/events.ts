import { pack_date_bigint, unpack_date_bigint } from "../../util/dateutil";
import {} from "@cloudflare/workers-types";
import { typiaValidator } from "@hono/typia-validator";
import { Hono } from "hono";

const app = new Hono();



app.delete("/destroy", function (ctx) {});

app.post("/create",typiaValidator(),   function (ctx) {});

app.patch("/start", typiaValidator(),  (ctx) {});

app.patch("/edit", function (ctx) {
  return ctx.text("Hello World!");
});

export default app;
