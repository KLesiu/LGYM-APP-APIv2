import Schema from "./configModels";
import mongoose,{Document} from "mongoose";

export interface AddressEntity extends Document {
    city?: string;
    country?: string;
    district?: string;
    formattedAddress?: string;
    isoCountryCode?: string;
    name?: string;
    postalCode?: string;
    region?: string;
    street?: string;
    streetNumber?: string;
    subregion?: string;
    latitude: number;
    longitude: number;
}

const AddressSchema = new Schema({
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
})

const Address = mongoose.model<AddressEntity>("Address", AddressSchema);
export default Address;