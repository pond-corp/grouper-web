import { prettyJSON } from 'hono/pretty-json';
import event_api from "./events";
// import rank_api from "./rank"
import form_api from "./forms";
import { Hono } from "hono";
const app = new Hono();
app.route("/events", event_api);
// app.route("/rank", rank_api)
app.route("/forms", form_api);
app.use(prettyJSON());
export default app;
