"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const PlanSchema = new configModels_1.default({
    // Użytkownik, który stworzył plan
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    // Nazwa planu
    name: { type: String, required: true },
    /// Czy plan jest aktywny
    isActive: { type: Boolean, required: true, default: true },
});
const Plan = mongoose_1.default.model('Plan', PlanSchema);
exports.default = Plan;
