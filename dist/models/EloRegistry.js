"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const EloRegistrySchema = new configModels_1.default({
    // Użytkownik, który dodał wpis
    user: { type: configModels_1.default.Types.ObjectId, ref: 'User', required: true },
    // Data dodania wpisu
    date: { type: Date, required: true },
    // Wynik
    elo: { type: Number, required: true },
    // Trening w którym został dodany wpis
    training: { type: configModels_1.default.Types.ObjectId, ref: 'Training', required: false }
});
const EloRegistry = mongoose_1.default.model('EloRegistry', EloRegistrySchema);
exports.default = EloRegistry;
