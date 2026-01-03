import { getEloRegistry } from "../controllers/eloRegistryController";
import Router from "./configRouter";

Router.get("/eloRegistry/:id/getEloRegistryChart",getEloRegistry)

export default Router;
