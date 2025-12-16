import app from "./index";
require("dotenv").config();
import { Server } from "http"; 

let server: Server;

const PORT: number = process.env.PORT ? Number(process.env.PORT) : 4000;

server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;