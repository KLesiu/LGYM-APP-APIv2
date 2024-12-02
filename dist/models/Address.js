"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configModels_1 = __importDefault(require("./configModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const AddressSchema = new configModels_1.default({
    // Miasto
    city: { type: String, required: false },
    // Kraj
    country: { type: String, required: false },
    // Dzielnica
    district: { type: String, required: false },
    // Pełny adres
    formattedAddress: { type: String, required: false },
    // Kod kraju
    isoCountryCode: { type: String, required: false },
    // Nazwa
    name: { type: String, required: false },
    // Kod pocztowy
    postalCode: { type: String, required: false },
    // Region
    region: { type: String, required: false },
    // Ulica
    street: { type: String, required: false },
    // Numer budynku
    streetNumber: { type: String, required: false },
    // Subregion  
    subregion: { type: String, required: false },
    // Szerokość geograficzna
    latitude: { type: Number, required: true },
    // Długość geograficzna
    longitude: { type: Number, required: true },
});
const Address = mongoose_1.default.model("Address", AddressSchema);
exports.default = Address;
