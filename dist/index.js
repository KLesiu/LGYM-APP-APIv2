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
const mongoose = require("mongoose");
const gym_1 = __importDefault(require("./routes/gym"));
const appConfig_1 = __importDefault(require("./routes/appConfig"));
const auth_1 = __importDefault(require("./routes/auth"));
const eloRegistry_1 = __importDefault(require("./routes/eloRegistry"));
const exercise_1 = __importDefault(require("./routes/exercise"));
const exerciseScores_1 = __importDefault(require("./routes/exerciseScores"));
const mainRecords_1 = __importDefault(require("./routes/mainRecords"));
const measurements_1 = __importDefault(require("./routes/measurements"));
const plan_1 = __importDefault(require("./routes/plan"));
const planDay_1 = __importDefault(require("./routes/planDay"));
const training_1 = __importDefault(require("./routes/training"));
const rateLimiters_1 = require("./middlewares/rateLimiters");
const auth_2 = require("./middlewares/auth");
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
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cors());
// Passport
const passport = require("./config/passport").passportConfig;
passport();
// Routes
app.use('/api', auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, auth_1.default);
app.use('/api', auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, plan_1.default);
app.use('/api', auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, training_1.default);
app.use("/api", auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, measurements_1.default);
app.use("/api", auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, mainRecords_1.default);
app.use("/api", auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, exercise_1.default);
app.use("/api", auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, planDay_1.default);
app.use("/api", auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, gym_1.default);
app.use("/api", auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, eloRegistry_1.default);
app.use("/api", auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, exerciseScores_1.default);
app.use("/api", auth_2.middlewareAuth, rateLimiters_1.apiUserLimiter, appConfig_1.default);
exports.default = app;
// Server
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
