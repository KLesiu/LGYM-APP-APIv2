"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const MainRecordsSchema = new configModels_1.default({
    // Użytkownik, który zapisuje rekord
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    // Ćwiczenie, dla którego zapisujemy rekord
    exercise: { type: configModels_1.default.Types.ObjectId, ref: "Exercise", required: true },
    // Ciężar, z jakim wykonano rekord
    weight: { type: Number, required: true },
    // Data wykonania rekordu
    date: { type: Date, required: true },
    // Jednostka wagi
    unit: { type: String, required: true }
}, {
    timestamps: true
});
const MainRecords = mongoose_1.default.model('MainRecords', MainRecordsSchema);
exports.default = MainRecords;
