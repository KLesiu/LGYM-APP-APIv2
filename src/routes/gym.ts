import Router from "./configRouter";
import { addGym,deleteGym,editGym,getGyms,getGym } from "../controllers/gymController";


Router.post("/gym/:id/addGym",addGym);
Router.delete("/gym/:id/deleteGym",deleteGym);
Router.get("/gym/:id/getGyms",getGyms);
Router.get("/gym/:id/getGym",getGym);
Router.post("/gym/editGym",editGym);



export default Router;