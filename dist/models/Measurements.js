"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const MeasurementsSchema = new configModels_1.default({
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    bodyPart: { type: String, required: true },
    unit: { type: String, required: true },
}, {
    timestamps: true
});
const Measurements = mongoose.model('Measurements', MeasurementsSchema);
exports.default = Measurements;
module.exports = Measurements;
