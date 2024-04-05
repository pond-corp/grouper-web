import { Validation } from "@hono/typia-validator";
import { Hono } from "hono";

const app = new Hono();

app.delete("/destroy", function (ctx) {
  return ctx.text("Hello World!");
});

app.post("/create", function (ctx) {
  return ctx.text("Hello World!");
});

app.post("/submit", function (ctx) {
  return ctx.text("Hello World!");
});

app.patch("/pass", function (ctx) {
  return ctx.text("Hello World!");
});

app.patch("/fail", function (ctx) {
  return ctx.text("Hello World!");
});

app.patch("/edit", function (ctx) {
  return ctx.text("Hello World!");
});

export default app;
