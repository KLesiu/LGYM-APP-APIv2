"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passportLocalMongoose = require("passport-local-mongoose");
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const UserSchema = new configModels_1.default({
    // Username
    name: { type: String, maxLength: 20, required: true },
    // Flaga czy jest adminem
    admin: { type: Boolean, required: false },
    // Email
    email: { type: String, required: true, maxLength: 40, },
    // Plan głowny użytkownika
    plan: { type: configModels_1.default.Types.ObjectId, ref: "Plan", required: false },
    // Ranga użytkownika
    profileRank: { type: String, required: false },
    // Avatar użytkownika
    avatar: { type: String, required: false },
}, {
    timestamps: true
});
UserSchema.plugin(passportLocalMongoose, { usernameField: 'name' });
const User = mongoose.model('User', UserSchema);
exports.default = User;
module.exports = User;
