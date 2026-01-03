"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
require("dotenv").config();
let server;
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
server = index_1.default.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = server;
