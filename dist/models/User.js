"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passportLocalMongoose = require("passport-local-mongoose");
const configModels_1 = __importDefault(require("./configModels"));
const mongoose = require('mongoose');
const UserSchema = new configModels_1.default({
    name: { type: String, maxLength: 20, required: true },
    admin: { type: Boolean, required: false },
    email: { type: String, required: true, maxLength: 40, },
    rank: { type: String, required: false },
    plan: { type: configModels_1.default.Types.ObjectId, ref: "Plan", required: false },
    Sq: { type: Number, required: false },
    Dl: { type: Number, required: false },
    Bp: { type: Number, required: false },
    profileRank: { type: String, required: false },
    elo: { type: Number, required: false }
}, {
    timestamps: true
});
UserSchema.plugin(passportLocalMongoose, { usernameField: 'name' });
const User = mongoose.model('User', UserSchema);
exports.default = User;
module.exports = User;
