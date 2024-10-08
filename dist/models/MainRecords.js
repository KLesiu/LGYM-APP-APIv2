"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const MainRecordsSchema = new configModels_1.default({
    user: { type: configModels_1.default.Types.ObjectId, ref: "User", required: true },
    exercise: { type: configModels_1.default.Types.ObjectId, ref: "Exercise", required: true },
    weight: { type: Number, required: true },
    date: { type: Date, required: true },
    unit: { type: String, required: true }
}, {
    timestamps: true
});
const MainRecords = mongoose.model('MainRecords', MainRecordsSchema);
exports.default = MainRecords;
module.exports = MainRecords;
