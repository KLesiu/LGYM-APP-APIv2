"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Platforms_1 = require("../enums/Platforms");
const configModels_1 = __importDefault(require("./configModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppConfigSchema = new configModels_1.default({
    platform: {
        type: String,
        enum: [Platforms_1.Platforms.ANDROID, Platforms_1.Platforms.IOS],
        required: true
    },
    minRequiredVersion: {
        type: String,
        required: true
    },
    latestVersion: {
        type: String,
        required: true
    },
    forceUpdate: {
        type: Boolean,
        default: false
    },
    updateUrl: {
        type: String,
        required: true
    },
    releaseNotes: {
        type: String
    },
}, {
    timestamps: true
});
const AppConfig = mongoose_1.default.model('AppConfig', AppConfigSchema);
exports.default = AppConfig;
