"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const auth = require("./routes/auth");
const plan = require('./routes/plan');
const training = require("./routes/training");
const measurements = require("./routes/measurements");
const mainRecords = require("./routes/mainRecords");
const mongoose = require("mongoose");
// Mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_CONNECT;
main().catch((err) => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect(mongoDB);
    });
}
// Config app
const app = (0, express_1.default)();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cors());
// Passport
const passport = require("./config/passport").passportConfig;
passport();
// Routes
app.use('/api', auth);
app.use('/api', plan);
app.use('/api', training);
app.use("/api", measurements);
app.use("/api", mainRecords);
module.exports = app;
// Server
const server = require('./server');
server;
