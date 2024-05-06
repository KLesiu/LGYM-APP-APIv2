"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const MeasurementsSchema = new configModels_1.default({
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    weight: { type: Number, required: false },
    neck: { type: Number, required: false },
    chest: { type: Number, required: false },
    biceps: { type: Number, required: false },
    waist: { type: Number, required: false },
    abdomen: { type: Number, required: false },
    hips: { type: Number, required: false },
    thigh: { type: Number, required: false },
    calf: { type: Number, required: false }
}, {
    timestamps: true
});
const Measurements = mongoose.model('Measurements', MeasurementsSchema);
exports.default = Measurements;
module.exports = Measurements;
