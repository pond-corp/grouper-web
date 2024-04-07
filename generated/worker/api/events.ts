import { pack_date_bigint, unpack_date_bigint } from "../../util/dateutil";
import {} from "@cloudflare/workers-types";
import { typiaValidator } from "@hono/typia-validator";
import { Hono } from "hono";
const app = new Hono();
//app.delete("/destroy", (ctx) => { });
//app.post("/create", (ctx) => { });
//app.patch("/start",  (ctx) => {});
app.patch("/edit", function (ctx) {
    return ctx.text("Hello World!");
});
export default app;
