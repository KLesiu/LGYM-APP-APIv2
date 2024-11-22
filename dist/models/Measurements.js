"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const MeasurementsSchema = new configModels_1.default({
    // Użytkownik, który zapisuje pomiary
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    // Część ciała, dla której zapisujemy pomiary
    bodyPart: { type: String, required: true },
    // Jednostka miary
    unit: { type: String, required: true },
    // Wartość pomiaru
    value: { type: Number, required: true },
}, {
    timestamps: true
});
const Measurements = mongoose_1.default.model('Measurements', MeasurementsSchema);
exports.default = Measurements;
module.exports = Measurements;
