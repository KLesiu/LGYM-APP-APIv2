"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const GymSchema = new configModels_1.default({
    // Nazwa siłowni
    name: { type: String, required: true },
    // Użytkownik, który dodał siłownię
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    // Adres siłowni
    address: { type: configModels_1.default.Types.ObjectId, ref: 'Address', required: false },
    // Czy siłownia jest usunięta
    isDeleted: { type: Boolean, default: false }
});
const Gym = mongoose_1.default.model("Gym", GymSchema);
exports.default = Gym;
